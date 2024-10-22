import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/utils";
import { isFetchError } from "@ts-rest/react-query/v5";

function useGetAvailableContractTypes() {
  const {
    data: avContractTypes,
    isPending: avContractTypesIsLoading,
    error,
    isError,
  } = client.offers.getContractTypes.useQuery({
    queryKey: ["contract-types"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });
  const { toast } = useToast();
  if (isError) {
    let errorText;
    if (isFetchError(error)) {
      console.error(error.message);
      errorText = "Error: Failed to fetch contract types.";

      toast({
        title: "Error",
        description:
          "Unable to retrieve the available contract types. Please check your internet connection.",
        variant: "destructive",
      });
    } else if (error.status === 404 || error.status === 500) {
      console.error(error.body.msg);
      errorText = error.body.msg;

      toast({
        title: "Error",
        description: error.body.msg,
        variant: "destructive",
      });
    }

    return {
      avContractTypes: null,
      avContractTypesIsLoading,
      avContractTypesError: errorText,
    };
  }

  if (!avContractTypes || avContractTypesIsLoading) {
    return {
      avContractTypes: null,
      avContractTypesIsLoading,
      avContractTypesError: null,
    };
  }

  return {
    avContractTypes: avContractTypes.body,
    avContractTypesIsLoading,
    avContractTypesError: error,
  };
}

export default useGetAvailableContractTypes;
