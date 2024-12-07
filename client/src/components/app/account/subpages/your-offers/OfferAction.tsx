import { Button, buttonVariants } from "@/components/ui/button";
import { SquarePen, Wallet } from "lucide-react";
import DeleteOfferDialog from "./DeleteOfferDialog";
import { AdminOfferType, OfferType } from "@/types/types";
import ExtendOfferDialog from "./ExtendOfferDialog";
import Link from "next/link";

type OfferActionProps = {
  offer: AdminOfferType;
  onEditChange: (offerId: OfferType | null) => void;
  payForOfferHandler: ({
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
  payForOfferIsPending: boolean;
  handlerDeleteOffer: (offerId: string) => void;
  deleteOfferIsPending: boolean;
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

export default function OfferAction({
  offer,
  onEditChange,
  payForOfferHandler,
  payForOfferIsPending,
  handlerDeleteOffer,
  deleteOfferIsPending,
  extendOfferDurationHandler,
  paymentList,
}: OfferActionProps) {
  return (
    <>
      <Link
        className={`${buttonVariants({ variant: "outline", size: "icon" })}`}
        href={`/account/your-offers/edit/${offer._id}`}
      >
        <SquarePen className="h-5 w-5" />
      </Link>
      {offer.isPaid ? (
        <ExtendOfferDialog
          offer={offer}
          extendOfferDurationHandler={extendOfferDurationHandler}
          paymentList={paymentList}
        />
      ) : (
        <Button
          variant={"outline"}
          size={"icon"}
          disabled={payForOfferIsPending}
          onClick={() =>
            payForOfferHandler({
              offerId: offer._id,
              title: offer.title,
              currency: offer.currency,
              pricing: offer.pricing,
            })
          }
        >
          <Wallet className="h-5 w-5" />
        </Button>
      )}
      <DeleteOfferDialog
        offerId={offer._id}
        handlerDeleteOffer={handlerDeleteOffer}
        deleteOfferIsPending={deleteOfferIsPending}
      />
    </>
  );
}
