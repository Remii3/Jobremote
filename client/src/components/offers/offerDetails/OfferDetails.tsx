import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import OfferDetailsContent from "./OfferDetailsContent";
import { useEffect, useState } from "react";
import Image from "next/image";
import { OfferFiltersType, OfferType } from "@/types/types";

interface OfferDetailsProps {
  selectedOffer: OfferType | null;
  changeSelectedOffer: (newOfferData: null) => void;
  isMobile: boolean;
  toggleSuccessApplied: () => void;
  changeFilters: (filters: keyof OfferFiltersType, value: string) => void;
}

export default function OfferDetails({
  selectedOffer,
  changeSelectedOffer,
  isMobile,
  toggleSuccessApplied,
  changeFilters,
}: OfferDetailsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

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

  function renderContent() {
    if (selectedOffer) {
      return (
        <OfferDetailsContent
          offer={selectedOffer}
          isMobile={isMobile}
          toggleSuccessApplied={toggleSuccessApplied}
          changeFilters={changeFilters}
        />
      );
    }
    return null;
  }

  if (isMobile) {
    return (
      <Dialog open={dialogOpen} onOpenChange={closeCurrentOfferHandler}>
        <DialogContent className="h-full p-0 overflow-hidden max-w-3xl min-h-[150px] border-0">
          <div className="overflow-y-auto">
            <DialogHeader className="text-left">
              <DialogTitle className="sr-only">
                {selectedOffer ? selectedOffer.title : "Offer details"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {selectedOffer
                  ? selectedOffer.content
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
    <div className="h-full w-full flex items-center flex-col justify-center text-center">
      <Image
        src="/marketing_man.webp"
        alt="No offer selected"
        width={500}
        height={332}
        className="aspect-auto h-[332px] w-[500px]"
        priority
      />
      <span className="text-muted-foreground">Choose an offer</span>
    </div>
  );
}
