"use client";

import OfferThankYou from "@/components/offers/newOffer/Offer-thank-you";
import OfferForm from "@/components/offers/newOffer/OfferForm";
import { useState } from "react";

export default function HireRemotely() {
  const [showThanks, setShowThanks] = useState(false);
  function handleAddAnother() {
    setShowThanks((prev) => !prev);
  }
  return (
    <>
      {showThanks && <OfferThankYou handleAddAnother={handleAddAnother} />}
      {!showThanks && <OfferForm handleAddAnother={handleAddAnother} />}
    </>
  );
}
