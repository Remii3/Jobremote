"use client";

import OfferDetails from "@/components/offers/offerDetails/OfferDetails";
import Filters from "@/components/offers/filters/Filters";
import OffersList from "@/components/offers/offersList/OffersList";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useHome } from "./home.hooks";

export default function Home() {
  const {
    changeCurrentOffer,
    isMobile,
    offerDetailsRef,
    offersListRef,
    selectedOffer,
    setSortOption,
    sortOption,
    toggleSuccessApplied,
    isSuccessApplied,
    filters,
    resetFilters,
    updateFilters,
  } = useHome();
  console.log("filters", filters);
  return (
    <div className="flex flex-col h-full">
      <section className="px-2 py-3 space-y-3 border-b border-b-input">
        <Filters
          filters={filters}
          changeFilters={updateFilters}
          resetFilters={resetFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </section>
      <div className="flex flex-grow overflow-hidden">
        <section
          className={`lg:w-1/2 w-full 
        overflow-y-auto px-4 py-4 bg-violet-50 dark:bg-violet-950/50 lg:rounded-tr-lg`}
          ref={offersListRef as React.RefObject<HTMLUListElement>}
        >
          <OffersList
            filters={filters}
            changeCurrentOffer={changeCurrentOffer}
            sortOption={sortOption}
          />
        </section>

        <section
          ref={offerDetailsRef}
          className={`w-1/2 
        overflow-y-auto lg:block hidden`}
        >
          <OfferDetails
            isMobile={isMobile}
            selectedOffer={selectedOffer}
            toggleSuccessApplied={toggleSuccessApplied}
            changeSelectedOffer={changeCurrentOffer}
            changeFilters={updateFilters}
          />
        </section>
      </div>
      <Dialog open={isSuccessApplied} onOpenChange={toggleSuccessApplied}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              You have successfully applied for this offer!
            </DialogTitle>
            <DialogDescription>
              All that&apos;s left is to wait for the employer to contact you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"default"} className="mt-2 sm:mt-0 w-full">
                Great!
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
