import { CommandItem } from "@/components/ui/command";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OfferFiltersType, OfferFilterType } from "@/types/types";
import { Check } from "lucide-react";

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
  return (
    <>
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
              technologies.includes(tech.name) ? "opacity-100" : "opacity-0"
            )}
          />
          {tech.name}
        </CommandItem>
      ))}
    </>
  );
}
