import { axiosInstance, cleanEmptyData, client } from "@/lib/utils";
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
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_SERVER_URI || "";
interface OffersListProps {
  filters: OfferFiltersType;
  sortOption: OfferSortOptionsTypes;
  changeCurrentOffer: (newId: OfferType | null) => void;
}
const fetchOffers = async ({ pageParam = 1, queryKey }) => {
  const [_key, { filters, sortOption }] = queryKey;
  
  const data = await axiosInstance.get(`/offers`, {
params: {
        filters: cleanEmptyData(filters),
        sort: sortOption,
        limit: "10",
        page: (pageParam as number).toString(),
      }
   
  });

console.log('data',data)
  return data.data;
};
export function useOffersInfiniteQuery(filters, sortOption) {
  return useInfiniteQuery({
    queryKey: ["offers-list", { filters, sortOption }],
    queryFn: fetchOffers,
    getNextPageParam: (lastPage) => {
      console.log('lastPage',lastPage)
      return lastPage.offers.length >= 10
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
}

export default function OffersList({
  filters,
  changeCurrentOffer,
  sortOption,
}: OffersListProps) {
  const { user } = useUser();
  const observerRef = useRef<null | HTMLDivElement>(null);

  // const {
  //   data: offersResponse,
  //   error: offersError,
  //   isPending: offersIsPending,
  //   refetch: offersRefetch,
  //   isFetchingNextPage: offersIsFetchingNextPage,
  //   hasNextPage: offersHasNextPage,
  //   fetchNextPage: offersFetchNextPage,
  // } = client.offers.getOffers.useInfiniteQuery({
  //   queryKey: ["offers-list"],
  //   queryData: ({ pageParam }) => ({
  //     query: {
  //       filters: cleanEmptyData(filters),
  //       sort: sortOption,
  //       limit: "10",
  //       page: (pageParam as number).toString(),
  //     },
  //   }),
  //   getNextPageParam: (lastPage) => {
  //     return lastPage.body.offers.length >= 10
  //       ? lastPage.body.pagination.page + 1
  //       : undefined;
  //   },
  //   initialPageParam: 1,
  // });

  const {
    data: offersResponse,
    error: offersError,
    isPending: offersIsPending,
    isFetchingNextPage: offersIsFetchingNextPage,
    hasNextPage: offersHasNextPage,
    fetchNextPage: offersFetchNextPage,refetch: offersRefetch,
  } = useOffersInfiniteQuery(filters, sortOption);
console.log('offersResponse',offersResponse)
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
      if (
        target.isIntersecting &&
        offersHasNextPage &&
        !offersIsFetchingNextPage
      ) {
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
    const observer = new IntersectionObserver(
      handleOffersListObserver,
      observerOptions
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [handleOffersListObserver]);
console.log('offerResponse', offersResponse);
  const offersList = offersResponse?.pages.flatMap((page) =>
    page.offers ? page.offers : []
  );
console.log('offersList',offersList)
  return (
    <>
      {offersIsPending && (
        <div className="space-y-2">
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
          <Skeleton className="w-full h-[88px] bg-slate-100" />
        </div>
      )}
      {offersError && <p>Error</p>}
      {offersList && offersList.length > 0 && (
        <ul className="space-y-4">
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
