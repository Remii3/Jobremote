import { client } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import React from "react";
import DesktopOfferDetails from "./DesktopOfferDetails";
import MobileOfferDetails from "./MobileOfferDetails";
import { Loader2 } from "lucide-react";

interface OfferDetailsProps {
  selectedOffer: string;
  changeCurrentOffer: (newId: string | null) => void;
  isMobile: boolean;
}

const LoadingState = () => (
  <DialogContent className="flex items-center justify-center flex-col gap-2">
    <DialogTitle className="sr-only">Loading data</DialogTitle>
    <div className="pt-6">
      <Loader2 className="animate-spin h-7 w-7" />
    </div>
    <DialogDescription>Waiting for offer details.</DialogDescription>
  </DialogContent>
);

const ErrorState = ({ error }: { error: any }) => (
  <DialogContent>
    <DialogTitle>Error: {error.status}</DialogTitle>
    <DialogDescription>{error.message}</DialogDescription>
  </DialogContent>
);

const OfferDetails = ({
  selectedOffer,
  changeCurrentOffer,
  isMobile,
}: OfferDetailsProps) => {
  const { data, isLoading, isError, error } = client.offers.getOffer.useQuery(
    ["currentOffer"],
    {
      params: { id: selectedOffer },
    }
  );

  if (isMobile) {
    return (
      <Dialog
        open={!!selectedOffer}
        onOpenChange={() => changeCurrentOffer(null)}
      >
        {isLoading && <LoadingState />}
        {isError && <ErrorState error={error} />}
        {data && <MobileOfferDetails offer={data.body.offer} />}
      </Dialog>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      )}
      {isError && (
        <div>
          <h2>Error: {error.status}</h2>
          {error.status === 404 && <p>{error.body.msg}</p>}
        </div>
      )}
      {data && <DesktopOfferDetails offer={data.body.offer} />}
    </>
  );
};

export default OfferDetails;
