import { client } from "@/lib/utils";

function useGetAvailableContractTypes() {
  const {
    data: avContractTypes,
    isPending: avContractTypesIsLoading,
    error: avContractTypesError,
  } = client.offers.getContractTypes.useQuery(
    ["contract-types"],
    {},
    {
      queryKey: ["contract-types"],
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return {
    avContractTypes,
    avContractTypesIsLoading,
    avContractTypesError,
  };
}

export default useGetAvailableContractTypes;
