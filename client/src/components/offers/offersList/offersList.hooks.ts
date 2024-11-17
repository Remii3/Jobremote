import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance, cleanEmptyData } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";

export const useOffersList = ({ sortOption, filters }: any) => {
  const { toast } = useToast();
  const observerRef = useRef<null | HTMLDivElement>(null);

  const {
    data,
    error,
    isError,
    isPending: offersIsPending,
    isFetchingNextPage: offersIsFetchingNextPage,
    hasNextPage: offersHasNextPage,
    fetchNextPage: offersFetchNextPage,
    refetch: offersRefetch,
  } = useInfiniteQuery({
    queryKey: ["offers-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/offers`, {
        params: {
          filters: cleanEmptyData(filters),
          sort: sortOption,
          limit: "10",
          page: pageParam.toString(),
        },
      });

      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.offers.length >= 10
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  const offersList = data?.pages.flatMap((page) =>
    page.offers ? page.offers : []
  );

  useEffect(() => {
    if (isError) {
      handleError(error, toast);
    }
  }, [error, isError, toast]);

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
    const currentObserver = observerRef.current;
    const observerOptions = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver(
      handleOffersListObserver,
      observerOptions
    );
    if (currentObserver) observer.observe(currentObserver);
    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [handleOffersListObserver]);

  return {
    offers: offersList,
    offersError: error,
    offersIsFetchingNextPage,
    offersIsPending,
    observerRef,
  };
};
