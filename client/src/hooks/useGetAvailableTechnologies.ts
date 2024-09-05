import { client } from "@/lib/utils";

function useGetAvailableTechnologies() {
  const {
    data: avTechnologies,
    isLoading: avTechnologiesIsLoading,
    error: avTechnologiesError,
  } = client.offers.getTechnologies.useQuery(
    ["technologies"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return { avTechnologies, avTechnologiesIsLoading, avTechnologiesError };
}

export default useGetAvailableTechnologies;
