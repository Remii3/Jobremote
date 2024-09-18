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
import { useEffect, useState } from "react";
import Image from "next/image";

interface OfferDetailsProps {
  selectedOffer: string | null;
  changeSelectedOffer: (newId: string | null) => void;
  isMobile: boolean;
  toggleSuccessApplied: () => void;
}

const OfferDetails = ({
  selectedOffer,
  changeSelectedOffer,
  isMobile,
  toggleSuccessApplied,
}: OfferDetailsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, error } = client.offers.getOffer.useQuery(
    ["currentOffer", selectedOffer],
    {
      query: { id: selectedOffer! },
    },
    {
      enabled: !!selectedOffer,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  function closeCurrentOfferHandler() {
    setDialogOpen(false);
    setTimeout(() => {
      changeSelectedOffer(null);
    }, 200);
  }

  useEffect(() => {
    if (selectedOffer) {
      setDialogOpen(true);
    }
  }, [selectedOffer]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
      );
    }

    if (error && (error.status === 404 || error.status === 500)) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div>
            <h2>Error: {error.status || "Unknown error"}</h2>
            <p>
              {(error && error.body.msg) ||
                "An error occurred while fetching the offer."}
            </p>
          </div>
        </div>
      );
    }

    if (data) {
      return (
        <OfferDetailsContent
          offer={{
            ...data.body.offer,
            _id: data.body.offer._id.toString(),
          }}
          isMobile={isMobile}
          toggleSuccessApplied={toggleSuccessApplied}
        />
      );
    }
    return null;
  };

  if (isMobile) {
    return (
      <Dialog open={dialogOpen} onOpenChange={closeCurrentOfferHandler}>
        <DialogContent className="h-full p-0 overflow-hidden max-w-3xl min-h-[150px] border-0">
          <div className="overflow-y-auto">
            <DialogHeader className="text-left">
              <DialogTitle className="sr-only">
                {data ? data.body.offer.title : "Offer details"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {data
                  ? data.body.offer.content
                  : "Details of the selected offer."}
              </DialogDescription>
            </DialogHeader>
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (selectedOffer) {
    return <>{renderContent()}</>;
  }
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <Image
          src="/marketing_man.webp"
          alt="No offer selected"
          width={500}
          height={500}
          quality={100}
          className="aspect-auto"
        />
        <span className="text-muted-foreground">Choose an offer</span>
      </div>
    </div>
  );
};

export default OfferDetails;
