import AuthGuard from "@/components/AuthGuard";
import OfferForm from "@/components/offers/newOffer/OfferForm";

export default function HireRemotely() {
  return (
    <AuthGuard>
      <OfferForm />
    </AuthGuard>
  );
}
