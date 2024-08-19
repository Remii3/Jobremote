import { cleanEmptyData, client } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import OfferItem from "./OfferItem";
import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";

interface OffersListProps {
  filters: OfferFiltersType;
  sortOption: OfferSortOptionsTypes;
  changeCurrentOffer: (newId: string | null) => void;
}

export default function OffersList({
  filters,
  changeCurrentOffer,
  sortOption,
}: OffersListProps) {
  const { data, error, isLoading, isError, refetch } =
    client.offers.getOffers.useQuery(
      ["offersList", sortOption],
      {
        query: {
          filters: cleanEmptyData(filters),
          sortOption,
          limit: "100",
        },
      },
      {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchInterval: false,
        refetchOnMount: false,
      }
    );
  const debouncedFilters = useMemo(() => debounce(refetch, 400), [refetch]);
  useEffect(() => {
    debouncedFilters();
  }, [filters, debouncedFilters]);
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.status}</p>}
      {data && (
        <ul className="space-y-2">
          {data.body.offers.map((offer) => (
            <OfferItem
              key={offer._id}
              _id={offer._id}
              title={offer.title}
              typeOfWork={offer.typeOfWork}
              experience={offer.experience}
              localization={offer.localization}
              changeCurrentOffer={changeCurrentOffer}
              maxSalary={offer.maxSalary}
              minSalary={offer.minSalary}
              currency={offer.currency}
              technologies={offer.technologies}
            />
          ))}
        </ul>
      )}
    </>
  );
}
