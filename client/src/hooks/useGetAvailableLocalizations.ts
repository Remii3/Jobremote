import { client } from "@/lib/utils";

function useGetAvailableLocalizations() {
  const {
    data: avLocalizations,
    isPending: avLocalizationsIsLoading,
    error: avLocalizationsError,
  } = client.offers.getLocalizations.useQuery(
    ["localizations"],
    {},
    {
      queryKey: ["localizations"],
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return { avLocalizations, avLocalizationsIsLoading, avLocalizationsError };
}

export default useGetAvailableLocalizations;
