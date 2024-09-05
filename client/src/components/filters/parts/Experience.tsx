import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import { OfferFiltersType } from "@/types/types";
import { Loader2 } from "lucide-react";

interface ExperiencePropsType {
  experiences: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}
export default function Experience({
  changeTextsHandler,
  experiences,
}: ExperiencePropsType) {
  const { avExperiences, avExperiencesError, avExperiencesIsLoading } =
    useGetAvailableExperiences();
  return (
    <>
      {avExperiences &&
        avExperiences.body.experiences.length > 0 &&
        avExperiences.body.experiences.map((experience) => {
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
      {avExperiences && avExperiences.body.experiences.length <= 0 && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">No employments</span>
        </div>
      )}
      {avExperiencesIsLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {avExperiencesError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {avExperiencesError.status === 500 && avExperiencesError.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
