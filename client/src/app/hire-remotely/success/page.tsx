import AuthGuard from "@/components/AuthGuard";
import OfferThankYou from "@/components/offers/newOffer/Offer-thank-you";

export default function page() {
  return (
    <AuthGuard>
      <OfferThankYou />
    </AuthGuard>
  );
}
