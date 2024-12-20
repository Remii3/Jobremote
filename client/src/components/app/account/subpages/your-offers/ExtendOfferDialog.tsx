import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OfferType } from "@/types/types";
import { Wallet } from "lucide-react";
import { useState } from "react";

type ExtendOfferDialogProps = {
  offer: OfferType;
  extendOfferDurationHandler: ({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) => Promise<void>;
  paymentList: {
    code: string;
    name: string;
    price: number;
    benefits: string[];
    activeMonths: number;
  }[];
};

export default function ExtendOfferDialog({
  offer,
  extendOfferDurationHandler,
  paymentList,
}: ExtendOfferDialogProps) {
  const [selectedPricing, setSelectedPricing] = useState("");

  function changeSelectedPricingHandler(value: string) {
    setSelectedPricing(value);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <Wallet className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend offer</DialogTitle>
          <DialogDescription>
            Are you sure you want to extend this offer?
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            extendOfferDurationHandler({
              currency: offer.currency,
              offerId: offer._id,
              title: offer.title,
              pricing: selectedPricing,
            });
          }}
        >
          <Select
            name="pricing"
            onValueChange={(value) => {
              changeSelectedPricingHandler(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              {paymentList.map((paymentType) => (
                <SelectItem key={paymentType.code} value={paymentType.code}>
                  {paymentType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button type="submit" disabled={!selectedPricing}>
              Extend
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
