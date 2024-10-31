import { Badge } from "@/components/ui/badge";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface TechnologySelectionProps {
  availableTechnologies: { _id: string; name: string }[];
}

export default function TechnologySelection({
  availableTechnologies,
}: TechnologySelectionProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    []
  );
  const [techOpen, setTechOpen] = useState(false);

  const handleSelectTechnology = (techName: string) => {
    if (selectedTechnologies.includes(techName)) {
      setSelectedTechnologies(
        selectedTechnologies.filter((tech) => tech !== techName)
      );
    } else {
      setSelectedTechnologies([...selectedTechnologies, techName]);
    }
  };

  return (
    <div className="space-y-3">
      <Popover
        open={techOpen}
        onOpenChange={() => setTechOpen((prev) => !prev)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={techOpen}
            className="w-[200px] justify-between"
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
                {availableTechnologies.map((tech) => (
                  <CommandItem
                    key={tech._id}
                    onSelect={() => handleSelectTechnology(tech.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTechnologies.includes(tech.name)
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
      {selectedTechnologies.length > 0 && (
        <ul className="flex gap-3">
          {selectedTechnologies.map((tech) => (
            <li key={tech}>
              <Badge
                variant="outline"
                className="py-1 px-3 cursor-pointer"
                onClick={() => handleSelectTechnology(tech)}
              >
                {tech}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
