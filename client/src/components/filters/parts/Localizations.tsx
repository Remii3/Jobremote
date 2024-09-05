import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
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
  const { avLocalizations, avLocalizationsError, avLocalizationsIsLoading } =
    useGetAvailableLocalizations();

  return (
    <>
      {avLocalizations &&
        avLocalizations.body.localizations.length > 0 &&
        avLocalizations.body.localizations.map((localization) => {
          return (
            <DropdownMenuCheckboxItem
              key={localization._id}
              checked={localizations.includes(localization.name)}
              onCheckedChange={() =>
                changeTextsHandler("localization", localization.name)
              }
              preventCloseOnSelect
            >
              {localization.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      {avLocalizations && avLocalizations.body.localizations.length <= 0 && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">No localizations</span>
        </div>
      )}
      {avLocalizationsIsLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {avLocalizationsError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {avLocalizationsError.status === 500 &&
              avLocalizationsError.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
