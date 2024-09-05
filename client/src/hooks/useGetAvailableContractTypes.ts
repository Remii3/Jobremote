import { client } from "@/lib/utils";

function useGetAvailableContractTypes() {
  const {
    data: avContractTypes,
    isLoading: avContractTypesIsLoading,
    error: avContractTypesError,
  } = client.offers.getContractTypes.useQuery(
    ["contract-types"],
    {},
    {
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
