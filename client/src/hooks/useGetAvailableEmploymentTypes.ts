import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/utils";
import { isFetchError } from "@ts-rest/react-query/v5";

function useGetAvailableEmploymentTypes() {
  const {
    data: avEmploymentTypes,
    isPending: avEmploymentTypesIsLoading,
    error,
    isError,
  } = client.offers.getEmploymentTypes.useQuery({
    queryKey: ["employment-types"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  if (isError) {
    let errorText;
    if (isFetchError(error)) {
      console.error(error.message);
      errorText = "Error: Failed to fetch employment types.";

      toast({
        title: "Error",
        description:
          "Unable to retrieve the available employment types. Please check your internet connection.",
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
      avEmploymentTypes: null,
      avEmploymentTypesIsLoading,
      avContractTypesError: errorText,
    };
  }

  if (!avEmploymentTypes || avEmploymentTypesIsLoading) {
    return {
      avEmploymentTypes: null,
      avEmploymentTypesIsLoading,
      avEmploymentTypesError: null,
    };
  }

  return {
    avEmploymentTypes: avEmploymentTypes.body,
    avEmploymentTypesIsLoading,
    avEmploymentTypesError: error,
  };
}

export default useGetAvailableEmploymentTypes;
