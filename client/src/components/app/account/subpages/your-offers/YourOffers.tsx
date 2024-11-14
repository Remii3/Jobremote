"use client";

import { OfferType, UserType } from "@/types/types";
import { ArrowLeft } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "../../../../ui/button";
import EditOffer from "../edit-offer/EditOffer";

import { Separator } from "../../../../ui/separator";
import { useQueryClient } from "@tanstack/react-query";

import { useYourOffers } from "./YourOffers.hooks";
import OffersTable from "./OffersTable";

type YourOffersProps = {
  user: UserType;
  fetchUserData: () => void;
};

export default function YourOffers({ user, fetchUserData }: YourOffersProps) {
  const queryClient = useQueryClient();
  const {
    userOffersList,
    deleteOfferHandler,
    deleteOfferIsPending,
    extendOfferDurationHandler,
    extendOfferDurationIsPending,
    payForOfferHandler,
    payForOfferIsPending,
    paymentList,
    paymentListError,
    paymentListIsPending,
    userOffersError,
    userOffersIsPending,
  } = useYourOffers({
    user,
    fetchUserData,
    queryClient,
  });

  const [selectedOffer, setSelectedOfferId] = useState<OfferType | null>(null);

  const handleEditOfferChange = (offerId: OfferType | null) => {
    setSelectedOfferId(offerId);
  };

  return (
    <>
      {selectedOffer && (
        <>
          <div className="px-2 md:col-span-4">
            <div className="flex gap-4 items-center">
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => handleEditOfferChange(null)}
                className={`rounded-full h-auto w-auto p-2`}
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Button>

              <h2 className="text-3xl font-semibold">{selectedOffer.title}</h2>
            </div>
            <Separator className="my-2" />
          </div>

          <EditOffer
            offerData={selectedOffer}
            handleChangeCurrentEditOffer={handleEditOfferChange}
            queryClient={queryClient}
          />
        </>
      )}
      {!selectedOffer && (
        <>
          <div className="md:col-span-4 px-2">
            <h2 className="text-3xl font-semibold">Your offers</h2>
            <span className="text-muted-foreground text-sm">
              Manage your offers
            </span>
            <Separator className="my-4" />
          </div>
          {userOffersList && paymentList && (
            <OffersTable
              userOffers={userOffersList.offers}
              onEditChange={handleEditOfferChange}
              deleteOfferHandler={deleteOfferHandler}
              deleteOfferIsPending={deleteOfferIsPending}
              extendOfferDurationHandler={extendOfferDurationHandler}
              payForOfferHandler={payForOfferHandler}
              payForOfferIsPending={payForOfferIsPending}
              paymentList={paymentList.paymentTypes}
            />
          )}
        </>
      )}
    </>
  );
}
