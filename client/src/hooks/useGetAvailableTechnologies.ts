import { client } from "@/lib/utils";

function useGetAvailableTechnologies() {
  const {
    data: avTechnologies,
    isPending: avTechnologiesIsLoading,
    error: avTechnologiesError,
  } = client.offers.getTechnologies.useQuery(
    ["technologies"],
    {},
    {
      queryKey: ["technologies"],
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return { avTechnologies, avTechnologiesIsLoading, avTechnologiesError };
}

export default useGetAvailableTechnologies;
