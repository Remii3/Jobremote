import { useToast } from "@/components/ui/use-toast";
import { TOAST_TITLES } from "@/constants/constant";
import { handleError } from "@/lib/errorHandler";
import fetchWithAuth from "@/lib/fetchWithAuth";
import { axiosInstance } from "@/lib/utils";
import { UserType } from "@/types/types";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

type UseYourOffersProps = {
  user: UserType;
  fetchUserData: () => void;
  queryClient: ReturnType<typeof useQueryClient>;
};

export function useYourOffers({
  user,
  fetchUserData,
  queryClient,
}: UseYourOffersProps) {
  const userOffers = useUserOffers({ user });
  const payments = usePayments({ fetchUserData });
  const offerActions = useOfferActions({ fetchUserData, queryClient });

  return {
    ...userOffers,
    ...payments,
    ...offerActions,
  };
}

type UseUserOffersProps = {
  user: UserType;
};

export function useUserOffers({ user }: UseUserOffersProps) {
  const { toast } = useToast();

  const {
    data: userOffersList,
    isPending: userOffersIsPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["userOffersList"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/users/offers`, {
        params: {
          _id: user._id,
          limit: "3",
          page: "1",
          sort: "createdAt",
        },
      });
      return data;
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  useEffect(() => {
    if (isError) {
      handleError(error, toast);
    }
  }, [error, isError, toast]);

  return {
    userOffersList,
    userOffersIsPending,
    userOffersError: error,
  };
}

type UsePaymentsProps = {
  fetchUserData: () => void;
};

export function usePayments({ fetchUserData }: UsePaymentsProps) {
  const { toast } = useToast();
  const {
    data: paymentList,
    error: paymentListError,
    isPending: paymentListIsPending,
  } = useQuery({
    queryKey: ["payment-list"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/offers/metadata/payments`);
      return data;
    },
  });

  const { mutate: payForOfferHandle, isPending: payForOfferIsPending } =
    useMutation({
      mutationFn: async (data: any) => {
        const res = await axiosInstance.post(
          `/offers/${data.offerId}/payment`,
          data
        );
        return res.data;
      },
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.sessionId,
        });

        if (error) {
          handleError(error, toast);
        }
      },
      onError: (error) => {
        handleError(error, toast);
      },
    });

  const payForOfferHandler = async ({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) => {
    payForOfferHandle({ offerId, currency, pricing, title });
  };

  return {
    paymentList,
    paymentListError,
    paymentListIsPending,
    payForOfferIsPending,
    payForOfferHandler,
  };
}

type UseOfferActionProps = {
  fetchUserData: () => void;
  queryClient: ReturnType<typeof useQueryClient>;
};

export function useOfferActions({
  fetchUserData,
  queryClient,
}: UseOfferActionProps) {
  const { toast } = useToast();

  const {
    mutate: extendOfferDurationHandle,
    isPending: extendOfferDurationIsPending,
  } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post(
        `/offers/${data.offerId}/extend`,
        data
      );
      return res.data;
    },
    onSuccess: async (param) => {
      fetchUserData();
      const stripe = await stripePromise;
      if (!stripe) return;
      const { error } = await stripe.redirectToCheckout({
        sessionId: param.sessionId,
      });
      if (error) {
        handleError(error, toast);
      }
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  const { mutate: deleteOfferHandle, isPending: deleteOfferIsPending } =
    useMutation({
      mutationFn: async (data: any) => {
        const res = await fetchWithAuth.patch(
          `/offers/${data._id}/mark-deleted`,
          data
        );
        return res.data;
      },
      onSuccess: () => {
        fetchUserData();
        queryClient.invalidateQueries({ queryKey: ["offers-list"] });
        queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Offer deleted successfully.",
        });
      },
      onError: (error) => {
        handleError(error, toast);
      },
    });

  async function extendOfferDurationHandler({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) {
    extendOfferDurationHandle({
      offerId,
      currency,
      pricing,
      title,
    });
  }

  function deleteOfferHandler(offerId: string) {
    deleteOfferHandle({ _id: offerId });
  }

  return {
    extendOfferDurationIsPending,
    deleteOfferIsPending,
    extendOfferDurationHandler,
    deleteOfferHandler,
  };
}
