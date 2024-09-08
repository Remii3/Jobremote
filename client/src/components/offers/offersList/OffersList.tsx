import { cleanEmptyData, client } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useRef } from "react";
import OfferItem from "./OfferItem";
import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { user } = useUser();

  const { data, error, isLoading, isError, refetch } =
    client.offers.getOffers.useQuery(
      ["offersList", user?.createdOffers],
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
      {data && data.body.offers.length > 0 && (
        <ul className="space-y-2">
          {data.body.offers.map((offer) => (
            <OfferItem
              key={offer._id.toString()}
              _id={offer._id.toString()}
              title={offer.title}
              experience={offer.experience}
              localization={offer.localization}
              changeCurrentOffer={changeCurrentOffer}
              maxSalary={offer.maxSalary}
              minSalary={offer.minSalary}
              currency={offer.currency}
              technologies={offer.technologies}
              logo={offer.logo}
            />
          ))}
        </ul>
      )}
      {data && data.body.offers.length === 0 && (
        <div className="text-center">
          <span>No new offers yet!</span>
        </div>
      )}
    </>
  );
}
