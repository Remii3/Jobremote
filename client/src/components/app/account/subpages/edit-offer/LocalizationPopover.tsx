import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LOCALIZATIONS } from "@/constants/localizations";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

type LocalizationPopoverProps = {
  control: Control<any>;
};

export default function LocalizationPopover({
  control,
}: LocalizationPopoverProps) {
  const [showLocalizationPopup, setShowLocalizationPopup] = useState(false);

  return (
    <FormField
      name="localization"
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Localization</FormLabel>
          <Popover
            open={showLocalizationPopup}
            onOpenChange={setShowLocalizationPopup}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full flex justify-between font-normal"
              >
                {field.value ? field.value : "Localizations"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command
                filter={(value, search) => {
                  if (
                    value
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
                  )
                    return 1;
                  return 0;
                }}
              >
                <CommandInput placeholder="Search localization..." />
                <CommandList>
                  <CommandEmpty>No localization found.</CommandEmpty>
                  <CommandGroup>
                    {LOCALIZATIONS.map((localization) => (
                      <CommandItem
                        key={localization._id}
                        onSelect={() => {
                          field.onChange(localization.name);
                          setShowLocalizationPopup(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === localization.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="w-full">{localization.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
