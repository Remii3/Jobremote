"use client";

import { client } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Loader2 } from "lucide-react";
import OfferDetailsContent from "./OfferDetailsContent";

interface OfferDetailsProps {
  selectedOffer: string;
  changeCurrentOffer: (newId: string | null) => void;
  isMobile: boolean;
}

const OfferDetails = ({
  selectedOffer,
  changeCurrentOffer,
  isMobile,
}: OfferDetailsProps) => {
  const { data, isLoading, isError, error, refetch } =
    client.offers.getOffer.useQuery(["currentOffer", selectedOffer], {
      query: { id: selectedOffer },
    });

  return (
    <>
      {isMobile && (
        <>
          <Dialog
            open={!!selectedOffer}
            onOpenChange={() => changeCurrentOffer(null)}
          >
            {isError && (error.status === 404 || error.status === 500) && (
              <DialogContent>
                <DialogTitle>Error: {error.status}</DialogTitle>
                <DialogDescription>{error.body.msg}</DialogDescription>
              </DialogContent>
            )}
            {data && (
              <DialogContent className="h-full">
                <DialogHeader>
                  <DialogTitle className="sr-only">
                    {data.body.offer.title}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {data.body.offer.content}
                  </DialogDescription>
                </DialogHeader>
                <OfferDetailsContent
                  offer={{
                    ...data.body.offer,
                    _id: data.body.offer._id.toString(),
                  }}
                  isMobile={isMobile}
                />
              </DialogContent>
            )}
          </Dialog>
        </>
      )}
      {!isMobile && (
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
          {data && (
            <OfferDetailsContent
              offer={{
                ...data.body.offer,
                _id: data.body.offer._id.toString(),
              }}
              isMobile={isMobile}
            />
          )}
        </>
      )}
    </>
  );
};

export default OfferDetails;
