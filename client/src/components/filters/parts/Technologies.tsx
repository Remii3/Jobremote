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
import { OfferFiltersType, OfferFilterType } from "@/types/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface TechnologiesProps {
  technologies: string[];
  avTechnologies: OfferFilterType[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function Technologies({
  technologies,
  changeTextsHandler,
  avTechnologies,
}: TechnologiesProps) {
  const [techOpen, setTechOpen] = useState(false);

  return (
    <>
      <Popover open={techOpen} onOpenChange={setTechOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={techOpen}
            className="justify-between"
          >
            Technology
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search technology..." />
            <CommandList>
              <CommandEmpty>No technology found.</CommandEmpty>
              <CommandGroup>
                {avTechnologies.map((tech) => (
                  <CommandItem
                    key={tech._id}
                    value={tech.name}
                    onSelect={(currentValue) => {
                      changeTextsHandler("technologies", currentValue);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        technologies.includes(tech.name)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {tech.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
