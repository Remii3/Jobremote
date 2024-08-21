import { cleanEmptyData, client } from "@/lib/utils";
import { debounce } from "lodash";
import { useEffect, useMemo } from "react";
import OfferItem from "./OfferItem";
import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";
import { Loader2 } from "lucide-react";
import { Span } from "next/dist/trace";
import { useUser } from "@/context/UserContext";

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
        refetchOnMount: false,
      }
    );
  useEffect(() => {
    debounce(refetch, 400);
  }, [filters, refetch, sortOption]);
  return (
    <>
      {isLoading && (
        <div>
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {isError && <p>Error: {error.status}</p>}
      {data && data.body.offers.length > 0 ? (
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
      ) : (
        <div className="text-center">
          <span>No new offers yet!</span>
        </div>
      )}
    </>
  );
}
