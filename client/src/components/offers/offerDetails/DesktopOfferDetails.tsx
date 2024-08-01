import { Badge } from "@/components/ui/badge";
import { OfferType } from "@/types/types";

const DesktopOfferDetails = ({ offer }: { offer: OfferType }) => {
  return (
    <div>
      <h2>{offer.title}</h2>
      <p>{offer.content}</p>
      {offer.technologies &&
        offer.technologies.map((technology) => (
          <Badge key={technology} variant={"secondary"}>
            {technology}
          </Badge>
        ))}
    </div>
  );
};

export default DesktopOfferDetails;
