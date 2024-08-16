"use client";

import OfferDetails from "./offerDetails/OfferDetails";
import OffersList from "./offersList/OffersList";
import { FormEvent, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Filters from "../filters/Filters";
import { client } from "@/lib/utils";
import useSearchFilters from "@/hooks/useSearchFilters";

const Offers = () => {
  const [selectedOffer, setSelectedOffer] = useState<null | string>(null);

  const { filters, updateFilters } = useSearchFilters();
  console.log("first", filters);
  const { data, error, isLoading, isError, refetch } =
    client.offers.getOffers.useQuery(["offersList", filters], {
      query: { filters, limit: "100" },
    });

  const isMobile = useIsMobile();

  const changeCurrentOffer = (newId: string | null) => {
    setSelectedOffer(newId);
  };

  const searchOffers = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  return (
    <>
      <div>
        <Filters
          filters={filters}
          changeFilters={updateFilters}
          searchOffers={searchOffers}
        />
      </div>
      <div className="flex">
        <div className="md:w-1/2 w-full">
          <OffersList
            changeCurrentOffer={changeCurrentOffer}
            data={data}
            error={error}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {selectedOffer && (
          <OfferDetails
            isMobile={isMobile}
            selectedOffer={selectedOffer}
            changeCurrentOffer={changeCurrentOffer}
          />
        )}
      </div>
    </>
  );
};

export default Offers;
