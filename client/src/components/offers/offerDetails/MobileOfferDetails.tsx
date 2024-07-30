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
      </DialogHeader>
    </DialogContent>
  );
};

export default MobileOfferDetails;
