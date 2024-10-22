import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/utils";
import { isFetchError } from "@ts-rest/react-query/v5";

function useGetAvailableLocalizations() {
  const {
    data: avLocalizations,
    isPending: avLocalizationsIsLoading,
    error,
    isError,
  } = client.offers.getLocalizations.useQuery({
    queryKey: ["localizations"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  if (isError) {
    let errorText;
    if (isFetchError(error)) {
      console.error(error.message);
      errorText = "Error: Failed to fetch localizations.";

      toast({
        title: "Error",
        description:
          "Unable to retrieve the available localizations. Please check your internet connection.",
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
      avLocalizations: null,
      avLocalizationsIsLoading,
      avContractTypesError: errorText,
    };
  }

  if (!avLocalizations || avLocalizationsIsLoading) {
    return {
      avLocalizations: null,
      avLocalizationsIsLoading,
      avLocalizationsError: null,
    };
  }

  return {
    avLocalizations: avLocalizations.body,
    avLocalizationsIsLoading,
    avLocalizationsError: null,
  };
}

export default useGetAvailableLocalizations;
