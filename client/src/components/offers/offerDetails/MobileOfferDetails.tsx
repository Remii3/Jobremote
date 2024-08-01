import { Badge } from "@/components/ui/badge";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OfferType } from "@/types/types";

const MobileOfferDetails = ({ offer }: { offer: OfferType }) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{offer.title}</DialogTitle>
        <DialogDescription>{offer.content}</DialogDescription>
        <div>
          <p className="text-sm font-semibold">Offer details:</p>
          <p>
            {offer.technologies &&
              offer.technologies.map((technology) => (
                <Badge key={technology} variant={"secondary"}>
                  {technology}
                </Badge>
              ))}
          </p>
        </div>
      </DialogHeader>
    </DialogContent>
  );
};

export default MobileOfferDetails;
