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
    client.offers.getOffers.useQuery(["offersList"], { query: { filters } });

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
        const newTypeOfWork = filters[newFilterKey] || [];

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
        return setFilters((prev) => prev);
      }
      default:
        return setFilters((prev) => prev);
    }
  };

  console.log(filters);

  const searchOffers = () => {
    refetch();
  };
  return (
    <>
      <div className="h-[10vh]">
        <Filters
          filters={filters}
          changeFilters={changeFilters}
          searchOffers={searchOffers}
        />
      </div>
      <div className="flex h-[80vh]">
        <div className="w-1/2">
          <OffersList
            changeCurrentOffer={changeCurrentOffer}
            data={data}
            error={error}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {selectedOffer && (
          <div className="w-1/2">
            <OfferDetails
              isMobile={isMobile}
              selectedOffer={selectedOffer}
              changeCurrentOffer={changeCurrentOffer}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Offers;
