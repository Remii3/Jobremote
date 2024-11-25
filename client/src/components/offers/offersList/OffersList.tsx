import OfferItem from "./OfferItem";
import {
  OfferFiltersType,
  OfferSortOptionsTypes,
  OfferType,
} from "@/types/types";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useOffersList } from "./offersList.hooks";
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
    offers,
    offersError,
    offersIsFetchingNextPage,
    offersIsPending,
    observerRef,
  } = useOffersList({ sortOption, filters });

  return (
    <>
      {offersIsPending && (
        <div className="space-y-4">
          <Skeleton className="w-full h-[88px] bg-white dark:bg-muted/50" />
          <Skeleton className="w-full h-[88px] bg-white dark:bg-muted/50" />
          <Skeleton className="w-full h-[88px] bg-white dark:bg-muted/50" />
        </div>
      )}
      {offersError && <p>Error</p>}
      {offers && offers.length > 0 && (
        <ul className="space-y-4">
          {offers.map((offer) => (
            <OfferItem
              key={offer._id}
              offerData={offer}
              changeCurrentOffer={changeCurrentOffer}
              isApplied={user ? user.appliedToOffers.includes(offer._id) : null}
            />
          ))}
          <div ref={observerRef} />
        </ul>
      )}
      {offersIsFetchingNextPage && (
        <div className="flex items-center justify-center w-full">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      {offers && offers.length <= 0 && (
        <div className="text-center">
          <span className="text-muted-foreground">No offers</span>
        </div>
      )}
    </>
  );
}
