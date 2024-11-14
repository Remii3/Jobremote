import { axiosInstance, cleanEmptyData } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useOffersList = ({ sortOption, filters }: any) => {
  const {
    data: offersResponse,
    error: offersError,
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

  const offersList = offersResponse?.pages.flatMap((page) =>
    page.offers ? page.offers : []
  );

  return {
    offers: offersList,
    offersError,
    offersIsPending,
    offersIsFetchingNextPage,
    offersHasNextPage,
    offersFetchNextPage,
    offersRefetch,
  };
};
