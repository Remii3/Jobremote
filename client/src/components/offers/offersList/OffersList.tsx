import { cleanEmptyData, client } from "@/lib/utils";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef } from "react";
import OfferItem from "./OfferItem";
import {
  OfferFiltersType,
  OfferSortOptionsTypes,
  OfferType,
} from "@/types/types";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

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
  const observerRef = useRef<null | HTMLDivElement>(null);

  const {
    data: offersResponse,
    error: offersError,
    isPending: offersIsPending,
    refetch: offersRefetch,
    isFetchingNextPage: offersIsFetchingNextPage,
    hasNextPage: offersHasNextPage,
    fetchNextPage: offersFetchNextPage,
  } = client.offers.getOffers.useInfiniteQuery(
    [`offersList`],
    ({ pageParam = 1 }: { pageParam?: unknown }) => ({
      query: {
        filters: cleanEmptyData(filters), 
        sort: sortOption,
        limit: "10",
        page: (pageParam as number).toString(),
      },
    }),
    {
      queryKey: ["offers-list"],
      getNextPageParam: (lastPage) => {
        return lastPage.body.offers.length >= 10
          ? lastPage.body.pagination.page + 1
          : undefined;
      },
      initialPageParam: 1,
    }
  );

  const refetchOffersList = useRef(
    debounce(async () => {
      offersRefetch();
    }, 400)
  ).current;

  useEffect(() => {
    refetchOffersList();
  }, [filters, sortOption, refetchOffersList]);

  const handleOffersListObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && offersHasNextPage && !offersIsFetchingNextPage) {
        offersFetchNextPage();
      }
    },
    [offersFetchNextPage, offersHasNextPage, offersIsFetchingNextPage]
  );
  
  useEffect(() => {
    const observerOptions = {
      root: null, 
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleOffersListObserver, observerOptions);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleOffersListObserver]);

  const offersList = offersResponse?.pages.flatMap((page) =>
    page.status === 200 ? page.body.offers : []
  );
console.log(offersResponse);
  return (
    <>
      {offersIsPending && (
        <div className="space-y-2">
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
        </div>
      )}
      {offersError && <p>Error: {offersError.status}</p>}
      {offersList && offersList.length > 0 && (
        <ul className="space-y-3">
          {offersList.map((offer) => (
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
      {offersList && offersList.length <= 0 && (
        <div className="text-center">
          <span className="text-muted-foreground">No offers</span>
        </div>
      )}
    </>
  );
}
