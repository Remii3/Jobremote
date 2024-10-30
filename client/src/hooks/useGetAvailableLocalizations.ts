import { AV_LOCALIZATIONS } from "@/constants/localizations";

function useGetAvailableLocalizations() {
 





  return {
    avLocalizations: AV_LOCALIZATIONS,
    avLocalizationsIsLoading: false,
    avLocalizationsError: null,
  };
}

export default useGetAvailableLocalizations;
