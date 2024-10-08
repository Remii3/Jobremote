"use client";
import AuthGuard from "@/components/AuthGuard";
import ModelForm from "@/components/offers/newOffer/ModelForm";
import OfferForm from "@/components/offers/newOffer/OfferForm";
import { Button } from "@/components/ui/button";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";
import { useUser } from "@/context/UserContext";
import { client } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { CreateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export const ClientOfferFormSchema = CreateOfferSchema.omit({
  userId: true,
  logo: true,
  pricing: true,
  technologies: true,
}).extend({
  // logo: z.array(z.instanceof(File)).nullable(),
  technologies: z.array(z.string()),
});

export const ClientModelFormSchema = CreateOfferSchema.pick({
  pricing: true,
});

export default function HireRemotely() {
  const [currentStep, setCurrentStep] = useState(1);
  const { user, fetchUserData } = useUser();
  const queryClient = useQueryClient();
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);

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
      technologies: [],
      companyName: "",
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
        queryClient.invalidateQueries({ queryKey: ["offersList"] });
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
    newOfferFormData.append(
      "technologies",
      JSON.stringify(offerValues.technologies)
    );
    newOfferFormData.append("companyName", offerValues.companyName);
    newOfferFormData.append("pricing", modelValues.pricing);

    createOffer({
      body: newOfferFormData,
    });
  }

  function handleTechnologies(technology: string) {
    const currentTechnologies = offerForm.getValues("technologies") || [];
    const updatedTechnologies = currentTechnologies.includes(technology)
      ? currentTechnologies.filter((tech) => tech !== technology)
      : [...currentTechnologies, technology];

    offerForm.setValue("technologies", updatedTechnologies);
  }

  function changeStepPrev(step: number) {
    setCurrentStep(step);
  }
  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }
  return (
    <AuthGuard>
      <div className="max-w-screen-2xl mx-auto w-full px-2">
        <MultiStepProgressBar currentStep={currentStep} />
        {currentStep === 1 && (
          <div>
            <OfferForm
              form={offerForm}
              handleSubmit={handleOfferFormSubmit}
              handleTechnologies={handleTechnologies}
              selectedLogo={selectedLogo}
              handleChangeLogo={handleChangeLogo}
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
    </AuthGuard>
  );
}
