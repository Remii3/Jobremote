import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useGetAvailableTechnologies() {
  const { toast } = useToast();

  const {
    data: avTechnologies,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const response = await axiosInstance.get("/offers/metadata/technologies");
      return response.data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) {
      handleError(error, toast);
    }
  }, [error, isError, toast]);

  return {
    avTechnologies,
    avTechnologiesIsLoading: isPending,
    avTechnologiesError: error,
  };
}
