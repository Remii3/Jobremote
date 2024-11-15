import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useModelForm() {
  const { toast } = useToast();
  const {
    data: paymentTypes,
    isPending: isPendingPaymentTypes,
    error,
    isError,
  } = useQuery({
    queryKey: ["payment-types"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/offers/metadata/payments");
      return data;
    },
  });

  useEffect(() => {
    if (isError) {
      handleError(error, toast);
    }
  }, [error, isError, toast]);

  return {
    paymentTypes,
    isPendingPaymentTypes,
  };
}
