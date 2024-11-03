import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormField } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Control } from "react-hook-form";

type LocalizationPopoverProps = {
  control: Control<any>;
};

export default function LocalizationPopover({
  control,
}: LocalizationPopoverProps) {
  const { avLocalizations } = useGetAvailableLocalizations();

  return (
    <FormField
      name="localization"
      control={control}
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between"
            >
              Localizations
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search localization..." />
              <CommandList>
                <CommandEmpty>No localization found.</CommandEmpty>
                <CommandGroup>
                  {avLocalizations.map((localization) => (
                    <CommandItem
                      key={localization._id}
                      onSelect={() => field.onChange(localization.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === localization.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {localization.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}