import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";

async function getAvailableTechnologies() {
  try {
    const response = await axiosInstance.get("/offers/metadata/technologies");
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        throw new Error("An error occurred while fetching technologies.");
      }
    } else {
      throw new Error(
        "An unexpected error occurred while fetching technologies."
      );
    }
  }
}

function useGetAvailableTechnologies() {
  const {
    data: avTechnologies,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["technologies"],
    queryFn: getAvailableTechnologies,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isError && error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);

  return {
    avTechnologies,
    avTechnologiesIsLoading: isPending,
    avTechnologiesError: error,
  };
}

export default useGetAvailableTechnologies;
