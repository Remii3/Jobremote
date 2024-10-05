import { client } from "@/lib/utils";

function useGetAvailableEmploymentTypes() {
  const {
    data: avEmploymentTypes,
    isPending: avEmploymentTypesIsLoading,
    error: avEmploymentTypesError,
  } = client.offers.getEmploymentTypes.useQuery(
    ["employment-types"],
    {},
    {
      queryKey: ["employment-types"],
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return {
    avEmploymentTypes,
    avEmploymentTypesIsLoading,
    avEmploymentTypesError,
  };
}

export default useGetAvailableEmploymentTypes;
