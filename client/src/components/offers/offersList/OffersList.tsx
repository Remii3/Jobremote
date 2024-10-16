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
    data: offers,
    error,
    isLoading,
    isError,
    refetch,isFetchingNextPage,hasNextPage,fetchNextPage
  } = client.offers.getOffers.useInfiniteQuery(
    ["offersList"],
    
     ({pageParam})=>({
        query: {
          filters: cleanEmptyData(filters), // Cleaning the filters
          sort: sortOption,
          limit: "10", // Number of offers per page
          page: pageParam!.toString() as string, // Initial page
        }
      }),
      {
        queryKey: ["offersList", filters, sortOption],
        getNextPageParam: (lastPage) => {
          if (lastPage.body.offers.length === 0) return undefined;
          return lastPage.body.pagination.page + 1;
        },
        initialPageParam: 1,
      }
  );

  // const debouncedSearch = useRef(
  //   debounce(async () => {
  //     refetch();
  //   }, 400)
  // ).current;

  // useEffect(() => {
  //   debouncedSearch();
  // }, [filters, sortOption, debouncedSearch]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const option = {
      root: null, // Observing viewport
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleObserver]);

  const offersData = offers?.pages.map((page) => page.body.offers).flat();

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
      {offersData && offersData.length > 0 && (
        <ul className="space-y-3">
          {offersData.map((offer) => (
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
      {offersData && offersData.length <=0 && (
        <div className="text-center">
          <span className="text-muted-foreground">No offers</span>
        </div>
      )}
    </>
  );
}
