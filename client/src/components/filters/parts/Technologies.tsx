import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { OfferFiltersType, OfferFilterType } from "@/types/types";

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
      {avTechnologies.map((technology) => {
        return (
          <DropdownMenuCheckboxItem
            key={technology._id}
            checked={technologies.includes(technology.name)}
            onCheckedChange={() =>
              changeTextsHandler("technologies", technology.name)
            }
            preventCloseOnSelect
          >
            {technology.name}
          </DropdownMenuCheckboxItem>
        );
      })}
    </>
  );
}
