import { TOAST_TITLES } from "@/data/constant";
import { axiosInstance } from "@/lib/utils";
import {
  ClientModelFormSchema,
  ClientOfferFormSchema,
} from "@/schema/OfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { isAxiosError } from "axios";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export const useHireRemotely = () => {
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, fetchUserData } = useUser();
  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }
  const offerForm = useForm<z.infer<typeof ClientOfferFormSchema>>({
    resolver: zodResolver(ClientOfferFormSchema),
    defaultValues: {
      title: "",
      content: "",
      experience: "",
      employmentType: "",
      localization: "",
      maxSalary: 0,
      currency: "USD",
      minSalary: 0,
      contractType: "",
      companyName: "",
      redirectLink: "",
    },
  });

  const modelForm = useForm({
    resolver: zodResolver(ClientModelFormSchema),
    defaultValues: {
      pricing: "",
    },
  });

  const { mutate: handleCreateOffer, isPending: isPendingCreateOffer } =
    useMutation({
      mutationFn: async (data: any) => {
        const res = await axiosInstance.post("/offers", data);
        return res.data;
      },
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
        }
        queryClient.invalidateQueries({ queryKey: ["offers-list"] });
        offerForm.reset();
      },
      onError: (error) => {
        if (isAxiosError(error)) {
          offerForm.setError("root", {
            type: "manual",
            message: error.message,
          });

          toast({
            title: TOAST_TITLES.ERROR,
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.error("error", error);

          offerForm.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });

          toast({
            title: TOAST_TITLES.ERROR,
            description: "An error occurred while creating offer.",
            variant: "destructive",
          });
        }
      },
    });

  function handlePaymentFormSubmit() {
    if (!user) return;
    const newOfferFormData = new FormData();

    const offerValues = offerForm.getValues();
    const modelValues = modelForm.getValues();
    if (selectedLogo) {
      newOfferFormData.append("logo", selectedLogo[0]);
    }
    if (technologies) {
      newOfferFormData.append("technologies", JSON.stringify(technologies));
    }

    newOfferFormData.append("title", offerValues.title);
    newOfferFormData.append("content", offerValues.content);
    newOfferFormData.append("experience", offerValues.experience);
    newOfferFormData.append("employmentType", offerValues.employmentType);
    newOfferFormData.append("contractType", offerValues.contractType);
    newOfferFormData.append("localization", offerValues.localization);
    newOfferFormData.append("minSalary", offerValues.minSalary.toString());
    newOfferFormData.append("maxSalary", offerValues.maxSalary.toString());
    newOfferFormData.append("currency", offerValues.currency);
    newOfferFormData.append("userId", user._id);
    newOfferFormData.append("companyName", offerValues.companyName);
    newOfferFormData.append("pricing", modelValues.pricing);

    handleCreateOffer(newOfferFormData);
  }

  function handleTechnologies(technology: string) {
    setTechnologies((prevState) => {
      if (prevState.includes(technology)) {
        return prevState.filter((tech) => tech !== technology);
      } else {
        return [...prevState, technology];
      }
    });
  }

  return {
    offerForm,
    handleTechnologies,
    handleChangeLogo,
    selectedLogo,
    technologies,
    handlePaymentFormSubmit,
    modelForm,
    isPendingCreateOffer,
  };
};
