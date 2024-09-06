import { client } from "@/lib/utils";

function useGetAvailableExperiences() {
  const {
    data: avExperiences,
    isLoading: avExperiencesIsLoading,
    error: avExperiencesError,
  } = client.offers.getExperiences.useQuery(
    ["experiences"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return { avExperiences, avExperiencesIsLoading, avExperiencesError };
}

export default useGetAvailableExperiences;