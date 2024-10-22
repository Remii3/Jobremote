import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/utils";
import { isFetchError } from "@ts-rest/react-query/v5";

function useGetAvailableExperiences() {
  const {
    data: avExperiences,
    isPending: avExperiencesIsLoading,
    error: avExperiencesError,
    isError,
  } = client.offers.getExperiences.useQuery({
    queryKey: ["experiences"],
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  if (isError) {
    let errorText;
    if (isFetchError(avExperiencesError)) {
      console.error(avExperiencesError.message);
      errorText = "Error: Failed to fetch experience types.";
      toast({
        title: "Error",
        description:
          "Unable to retrieve the available experience types. Please check your internet connection.",
        variant: "destructive",
      });
    } else if (
      avExperiencesError.status === 404 ||
      avExperiencesError.status === 500
    ) {
      console.error(avExperiencesError.body.msg);
      errorText = avExperiencesError.body.msg;

      toast({
        title: "Error",
        description: avExperiencesError.body.msg,
        variant: "destructive",
      });
    }

    return {
      avExperiences: null,
      avExperiencesIsLoading,
      avContractTypesError: errorText,
    };
  }

  if (!avExperiences || avExperiencesIsLoading) {
    return {
      avExperiences: null,
      avExperiencesIsLoading,
      avExperiencesError: null,
    };
  }

  return {
    avExperiences: avExperiences.body,
    avExperiencesIsLoading,
    avExperiencesError: null,
  };
}

export default useGetAvailableExperiences;
