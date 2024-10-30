import {
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { OfferFiltersType } from "@/types/types";
import { Check } from "lucide-react";

interface LocalizationsProps {
  avLocalizations: 
     {
      _id: string;
      name: string;
      region: string;
    }[];
  localizations: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function Localizations({
  localizations,
  changeTextsHandler,
  avLocalizations,
}: LocalizationsProps) {
  const sortedLocalizations = avLocalizations.sort((a, b) => a.region.localeCompare(b.region));
  return (
    <>
      {sortedLocalizations.map((localization) => (
        // <div key={region}>
          // <h3 className="py-1.5 pl-4 pr-2 text-sm font-medium">{region}</h3>
          // {avLocalizations[region].map((localization, i) => (
            <CommandItem
              key={localization._id}
              value={localization.name}
              onSelect={(currentValue) => {
                changeTextsHandler("localization", currentValue);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  localizations.includes(localization.name)
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              {localization.name}
            </CommandItem>
          // ))}
        // </div>
      ))}
    </>
  );
}
