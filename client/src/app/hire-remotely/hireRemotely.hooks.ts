import { axiosInstance } from "@/lib/utils";
import { ClientModelFormSchema, CreateOfferSchema } from "@/schema/OfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserType } from "@/types/types";
import { handleError } from "@/lib/errorHandler";
import fetchWithAuth from "@/lib/fetchWithAuth";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

type CreateNewOfferResponse = {
  sessionId: string;
};

export const useHireRemotely = ({
  user,
  fetchUserData,
}: {
  user: UserType;
  fetchUserData: () => void;
}) => {
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }

  const offerForm = useForm<z.infer<typeof CreateOfferSchema>>({
    resolver: zodResolver(CreateOfferSchema),
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
      priceType: "monthly",
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
        const res = await fetchWithAuth.post<CreateNewOfferResponse>(
          "/offers",
          data
        );
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
          handleError(error, toast);
        }
        queryClient.invalidateQueries({ queryKey: ["offers-list"] });
        offerForm.reset();
      },
      onError: (error) => {
        handleError(error, toast);
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
    newOfferFormData.append("priceType", offerValues.priceType);
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
