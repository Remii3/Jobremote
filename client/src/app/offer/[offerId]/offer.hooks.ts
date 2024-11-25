import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { OfferType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";

type OfferResponse = {
  offer: OfferType;
  msg: string;
};

export function useOffer() {
  const { offerId } = useParams();
  const { toast } = useToast();

  const {
    data: offer,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: async () => {
      const res = await axiosInstance.get<OfferResponse>(`/offers/${offerId}`);
      return res.data.offer;
    },
  });

  useEffect(() => {
    if (isError) {
      handleError(error, toast);
    }
  }, [error, isError, toast]);

  return { offer, isPending, error };
}
