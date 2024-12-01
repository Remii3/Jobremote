import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { OfferFiltersType } from "@/types/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface LocalizationsProps {
  avLocalizations: {
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
  const [localizationOpen, setLocalizationOpen] = useState(false);

  return (
    <>
      <Popover open={localizationOpen} onOpenChange={setLocalizationOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={localizationOpen}
            className="justify-between"
          >
            Localizations
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            filter={(value, search) => {
              if (
                value.toLocaleLowerCase().includes(search.toLocaleLowerCase())
              )
                return 1;
              return 0;
            }}
          >
            <CommandInput placeholder="Search localization..." />
            <CommandList>
              <CommandEmpty>No localization found.</CommandEmpty>
              <CommandGroup>
                {avLocalizations.map((localization) => {
                  return (
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
                      <span className="w-full">{localization.name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
