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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Control } from "react-hook-form";

interface TechnologySelectionProps {
  availableTechnologies: { _id: string; name: string }[];
  name: string;
  label: string;
  control: Control<any>;
  handleTechnologies: (tech: string) => void;
}

export default function TechnologySelection({
  availableTechnologies,
  control,
  label,
  name,
  handleTechnologies,
}: TechnologySelectionProps) {
  const [techOpen, setTechOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover
              open={techOpen}
              onOpenChange={() => setTechOpen((prev) => !prev)}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={techOpen}
                  className="w-[300px] flex justify-between"
                >
                  Technology
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search technology..." />
                  <CommandList>
                    <CommandEmpty>No technology found.</CommandEmpty>
                    <CommandGroup>
                      {availableTechnologies.map((tech) => (
                        <CommandItem
                          key={tech._id}
                          onSelect={() => handleTechnologies(tech.name)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(tech.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <span className="w-full">{tech.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
          {field.value.length > 0 && (
            <ul className="flex gap-4 pt-2">
              {field.value.map((tech: string) => (
                <li key={tech}>
                  <Badge
                    variant="outline"
                    className="py-1 px-3 cursor-pointer"
                    onClick={() => handleTechnologies(tech)}
                  >
                    {tech}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </FormItem>
      )}
    />
  );
}
