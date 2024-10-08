import { cleanEmptyData, client } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";
import OfferItem from "./OfferItem";
import {
  OfferFiltersType,
  OfferSortOptionsTypes,
  OfferType,
} from "@/types/types";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

interface OffersListProps {
  filters: OfferFiltersType;
  sortOption: OfferSortOptionsTypes;
  changeCurrentOffer: (newId: OfferType | null) => void;
}

export default function OffersList({
  filters,
  changeCurrentOffer,
  sortOption,
}: OffersListProps) {
  const { user } = useUser();

  const {
    data: offers,
    error,
    isLoading,
    isError,
    refetch,
  } = client.offers.getOffers.useQuery(
    ["offersList"],
    {
      query: {
        filters: cleanEmptyData(filters),
        sort: sortOption,
        limit: "100",
        page: "1",
      },
    },
    {
      queryKey: ["offersList"],
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
    }
  );

  const debouncedSearch = useRef(
    debounce(async () => {
      refetch();
    }, 400)
  ).current;

  useEffect(() => {
    debouncedSearch();
  }, [filters, sortOption, debouncedSearch]);

  return (
    <>
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
        </div>
      )}
      {isError && <p>Error: {error.status}</p>}
      {offers && offers.body.offers.length > 0 && (
        <ul className="space-y-3">
          {offers.body.offers.map((offer) => (
            <OfferItem
              key={offer._id}
              offerData={offer}
              changeCurrentOffer={changeCurrentOffer}
              isApplied={user ? user.appliedToOffers.includes(offer._id) : null}
            />
          ))}
        </ul>
      )}
      {offers && offers.body.offers.length === 0 && (
        <div className="text-center">
          <span className="text-muted-foreground">No offers</span>
        </div>
      )}
    </>
  );
}
