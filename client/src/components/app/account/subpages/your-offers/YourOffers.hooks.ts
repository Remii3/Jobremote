import { useToast } from "@/components/ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { client } from "@/lib/utils";
import { UserType } from "@/types/types";
import { loadStripe } from "@stripe/stripe-js";
import { useQueryClient } from "@ts-rest/react-query/tanstack";

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
  const {
    data: userOffersList,
    isPending: userOffersIsPending,
    error: userOffersError,
  } = client.users.getUserOffers.useQuery({
    queryKey: ["userOffersList"],
    queryData: {
      query: { _id: user._id, limit: "3", page: "1", sort: "createdAt" },
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  return {
    userOffersList,
    userOffersIsPending,
    userOffersError,
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
  } = client.offers.getPaymentTypes.useQuery({
    queryKey: ["payment-list"],
  });

  const { mutate: payForOfferHandle, isPending: payForOfferIsPending } =
    client.offers.payForOffer.useMutation({
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.body.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
          toast({
            title: TOAST_TITLES.ERROR,
            description: "An error occurred while redirecting to the payment.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        console.error("Error paying for offer: ", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while paying for the offer.",
          variant: "destructive",
        });
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
    payForOfferHandle({ body: { offerId, currency, pricing, title } });
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
  } = client.offers.extendActiveOffer.useMutation({
    onSuccess: async (param) => {
      fetchUserData();
      const stripe = await stripePromise;
      if (!stripe) return;
      const { error } = await stripe.redirectToCheckout({
        sessionId: param.body.sessionId,
      });
      if (error) {
        console.error("Stripe error:", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while redirecting to the payment.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error extending offer: ", error);
      toast({
        title: TOAST_TITLES.ERROR,
        description: "An error occurred while extending the offer.",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteOfferHandle, isPending: deleteOfferIsPending } =
    client.offers.deleteOffer.useMutation({
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
        console.error("Error deleting offer: ", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while deleting the offer.",
          variant: "destructive",
        });
      },
    });

  const extendOfferDurationHandler = async ({
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
    extendOfferDurationHandle({
      body: {
        offerId,
        currency,
        pricing,
        title,
      },
    });
  };

  const deleteOfferHandler = (offerId: string) => {
    deleteOfferHandle({ body: { _id: offerId } });
  };

  return {
    extendOfferDurationIsPending,
    deleteOfferIsPending,
    extendOfferDurationHandler,
    deleteOfferHandler,
  };
}
