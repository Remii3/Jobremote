"use client";

import OfferDetails from "./offerDetails/OfferDetails";
import OffersList from "./offersList/OffersList";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Filters from "../filters/Filters";
import { FilterSwitch, OfferFiltersType } from "@/types/types";
import { client } from "@/lib/utils";

const Offers = () => {
  const [selectedOffer, setSelectedOffer] = useState<null | string>(null);

  const [filters, setFilters] = useState<OfferFiltersType>({});

  const { data, error, isLoading, isError, refetch } =
    client.offers.getOffers.useQuery(["offersList", filters.localization], {
      query: { filters, limit: "100" },
    });

  const isMobile = useIsMobile();

  const changeCurrentOffer = (newId: string | null) => {
    setSelectedOffer(newId);
  };

  const changeFilters = ({
    operation,
    newFilterKey,
    newFilterValue,
  }: FilterSwitch) => {
    switch (operation) {
      case "multi-choice": {
        const newTypeOfWork = filters[newFilterKey] || ([] as string[]);

        if (!Array.isArray(newTypeOfWork)) {
          return setFilters((prev) => prev);
        }

        const valueIndex = newTypeOfWork.indexOf(newFilterValue);
        if (valueIndex > -1) {
          newTypeOfWork.splice(valueIndex, 1);
        } else {
          newTypeOfWork.push(newFilterValue);
        }
        return setFilters((prev) => ({
          ...prev,
          [newFilterKey]: newTypeOfWork,
        }));
      }
      case "single-choice": {
        return setFilters((prev) => ({
          ...prev,
          [newFilterKey]: newFilterValue,
        }));
      }
      default:
        return setFilters((prev) => prev);
    }
  };

  const searchOffers = () => {
    refetch();
  };
  return (
    <>
      <div>
        <Filters
          filters={filters}
          changeFilters={changeFilters}
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
