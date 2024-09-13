import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { OfferFiltersType, OfferFilterType } from "@/types/types";

interface ExperiencePropsType {
  experiences: string[];
  avExperiences: OfferFilterType[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}
export default function Experience({
  changeTextsHandler,
  experiences,
  avExperiences,
}: ExperiencePropsType) {
  return (
    <>
      {avExperiences.map((experience) => {
        return (
          <DropdownMenuCheckboxItem
            key={experience._id}
            checked={experiences.includes(experience.name)}
            onCheckedChange={() =>
              changeTextsHandler("experience", experience.name)
            }
            preventCloseOnSelect
          >
            {experience.name}
          </DropdownMenuCheckboxItem>
        );
      })}
    </>
  );
}
