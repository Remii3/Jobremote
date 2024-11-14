"use client";
import AuthGuard from "@/components/AuthGuard";
import ModelForm from "@/components/offers/newOffer/ModelForm";
import OfferForm from "@/components/offers/newOffer/OfferForm";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";

import { useState } from "react";
import { useHireRemotely } from "./hireRemotely.hooks";

function HireRemotely() {
  const {
    handleChangeLogo,
    handlePaymentFormSubmit,
    handleTechnologies,
    offerForm,
    selectedLogo,
    technologies,
    isPendingCreateOffer,
    modelForm,
  } = useHireRemotely();
  const [currentStep, setCurrentStep] = useState(1);

  const changeCurrentStepHandler = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full px-2">
      <MultiStepProgressBar currentStep={currentStep} />
      {currentStep === 1 && (
        <div>
          <OfferForm
            form={offerForm}
            changeCurrentStep={changeCurrentStepHandler}
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
            isPendingCreateOffer={isPendingCreateOffer}
            changeCurrentStep={changeCurrentStepHandler}
          />
        </div>
      )}
    </div>
  );
}
export default AuthGuard(HireRemotely);
