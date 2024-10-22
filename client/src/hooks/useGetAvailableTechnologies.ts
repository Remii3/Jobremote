import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/utils";
import { isFetchError } from "@ts-rest/react-query/v5";

function useGetAvailableTechnologies() {
  const {
    data: avTechnologies,
    isPending: avTechnologiesIsLoading,
    error,
    isError,
  } = client.offers.getTechnologies.useQuery({
    queryKey: ["technologies"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  if (isError) {
    let errorText;
    if (isFetchError(error)) {
      console.error(error.message);
      errorText = "Error: Failed to fetch technologies.";

      toast({
        title: "Error",
        description:
          "Unable to retrieve the available technologies. Please check your internet connection.",
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
      avTechnologies: null,
      avTechnologiesIsLoading,
      avContractTypesError: errorText,
    };
  }

  if (!avTechnologies || avTechnologiesIsLoading) {
    return {
      avTechnologies: null,
      avTechnologiesIsLoading,
      avTechnologiesError: null,
    };
  }

  return {
    avTechnologies: avTechnologies.body,
    avTechnologiesIsLoading,
    avTechnologiesError: null,
  };
}

export default useGetAvailableTechnologies;
