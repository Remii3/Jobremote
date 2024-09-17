import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { OfferFiltersType, OfferFilterType } from "@/types/types";

interface LocalizationsProps {
  localizations: string[];
  avLocalizations: OfferFilterType[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function Localizations({
  localizations,
  changeTextsHandler,
  avLocalizations,
}: LocalizationsProps) {
  return (
    <>
      {avLocalizations.map((localization) => {
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
    </>
  );
}
