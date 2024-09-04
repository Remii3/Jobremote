import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { client } from "@/lib/utils";
import { OfferFiltersType } from "@/types/types";
import { Loader2 } from "lucide-react";

interface LocalizationsProps {
  localizations: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function Localizations({
  localizations,
  changeTextsHandler,
}: LocalizationsProps) {
  const {
    data: availableLocalizations,
    isLoading,
    isError,
    error,
  } = client.offers.getLocalizations.useQuery(
    ["localizations"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {availableLocalizations &&
        availableLocalizations.body.localizations.length > 0 &&
        availableLocalizations.body.localizations.map((localization) => {
          return (
            <DropdownMenuCheckboxItem
              key={localization._id}
              checked={localizations.includes(localization.name)}
              onCheckedChange={() =>
                changeTextsHandler("localization", localization.name)
              }
            >
              {localization.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      {availableLocalizations &&
        availableLocalizations.body.localizations.length <= 0 && (
          <div className="flex p-2 items-center justify-center">
            <span className="text-xs text-slate-500">No localizations</span>
          </div>
        )}
      {isLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {error.status === 500 && error.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
