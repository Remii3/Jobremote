import { OfferType } from "@/types/types";

const DesktopOfferDetails = ({ offer }: { offer: OfferType }) => {
  return (
    <div>
      <h2>{offer.title}</h2>
      <p>{offer.content}</p>
    </div>
  );
};

export default DesktopOfferDetails;
