"use client";
import AuthGuard from "@/components/AuthGuard";
import ModelForm from "@/components/offers/newOffer/ModelForm";
import OfferForm from "@/components/offers/newOffer/OfferForm";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";
import { useUser } from "@/context/UserContext";
import { client } from "@/lib/utils";
import {
  ClientModelFormSchema,
  ClientOfferFormSchema,
} from "@/schema/OfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

function HireRemotely() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user, fetchUserData } = useUser();
  const queryClient = useQueryClient();
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);
  const [technologies, setTechnologies] = useState<string[]>([]);

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

  const { mutate: createOffer, isPending } =
    client.offers.createOffer.useMutation({
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.body.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
        }
        queryClient.invalidateQueries({ queryKey: ["offers-list"] });
        offerForm.reset();
      },
    });

  function handleOfferFormSubmit() {
    setCurrentStep(2);
  }

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

    createOffer({
      body: newOfferFormData,
    });
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

  function changeStepPrev(step: number) {
    setCurrentStep(step);
  }

  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-2">
      <MultiStepProgressBar currentStep={currentStep} />
      {currentStep === 1 && (
        <div>
          <OfferForm
            form={offerForm}
            handleSubmit={handleOfferFormSubmit}
            selectedLogo={selectedLogo}
            handleChangeLogo={handleChangeLogo}
            technologies={technologies}
            handleTechnologies={handleTechnologies}
          />
        </div>
      )}
      {currentStep === 2 && (
        <div>
          <ModelForm
            form={modelForm}
            handleSubmit={handlePaymentFormSubmit}
            changeStepPrev={changeStepPrev}
          />
        </div>
      )}
    </div>
  );
}
export default AuthGuard(HireRemotely);
