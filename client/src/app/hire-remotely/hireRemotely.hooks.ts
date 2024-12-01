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
  const [showDuties, setShowDuties] = useState<boolean>(false);
  const [showBenefits, setShowBenefits] = useState<boolean>(false);
  const [bindSalaries, setBindSalaries] = useState<boolean>(true);
  const [showRequirements, setShowRequirements] = useState<boolean>(false);

  function handleShowDuties() {
    setShowDuties(!showDuties);
  }

  function handleShowBenefits() {
    setShowBenefits(!showBenefits);
  }

  function handleShowRequirements() {
    setShowRequirements(!showRequirements);
  }

  function handleBindSalaries() {
    setBindSalaries(!bindSalaries);
  }

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
      requirements: "",
      benefits: "",
      duties: "",
      employmentType: "",
      localization: "",
      maxSalary: 0,
      minSalary: 0,
      maxSalaryYear: 0,
      minSalaryYear: 0,
      currency: "USD",
      contractType: "",
      companyName: "",
      redirectLink: "",
      technologies: [],
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

    if (offerValues.redirectLink) {
      newOfferFormData.append("redirectLink", offerValues.redirectLink);
    }

    if (offerValues.requirements) {
      newOfferFormData.append("requirements", offerValues.requirements);
    }

    if (offerValues.benefits) {
      newOfferFormData.append("benefits", offerValues.benefits);
    }

    if (offerValues.duties) {
      newOfferFormData.append("duties", offerValues.duties);
    }

    newOfferFormData.append("title", offerValues.title);
    newOfferFormData.append("content", offerValues.content);
    newOfferFormData.append("experience", offerValues.experience);
    newOfferFormData.append("employmentType", offerValues.employmentType);
    newOfferFormData.append("contractType", offerValues.contractType);
    newOfferFormData.append("localization", offerValues.localization);
    newOfferFormData.append("minSalary", offerValues.minSalary.toString());
    newOfferFormData.append("maxSalary", offerValues.maxSalary.toString());
    newOfferFormData.append(
      "minSalaryYear",
      offerValues.minSalaryYear.toString()
    );
    newOfferFormData.append(
      "maxSalaryYear",
      offerValues.maxSalaryYear.toString()
    );

    newOfferFormData.append("currency", offerValues.currency);
    newOfferFormData.append("userId", user._id);
    newOfferFormData.append("companyName", offerValues.companyName);
    newOfferFormData.append("pricing", modelValues.pricing);
    newOfferFormData.append(
      "technologies",
      JSON.stringify(offerValues.technologies)
    );

    handleCreateOffer(newOfferFormData);
  }

  function handleTechnologies(technology: string) {
    const technologies = offerForm.getValues().technologies || [];
    const updated = technologies.includes(technology)
      ? technologies.filter((tech) => tech !== technology)
      : [...technologies, technology];

    offerForm.setValue("technologies", updated);
  }

  return {
    offerForm,
    handleTechnologies,
    handleChangeLogo,
    selectedLogo,
    handlePaymentFormSubmit,
    modelForm,
    isPendingCreateOffer,
    handleShowDuties,
    handleShowBenefits,
    showDuties,
    showBenefits,
    showRequirements,
    bindSalaries,
    handleShowRequirements,
    handleBindSalaries,
  };
};
