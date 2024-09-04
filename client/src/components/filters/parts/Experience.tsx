import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { client } from "@/lib/utils";
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
  const {
    data: availableExperiences,
    isLoading,
    isError,
    error,
  } = client.offers.getExperiences.useQuery(
    ["experiences"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {availableExperiences &&
        availableExperiences.body.experiences.length > 0 &&
        availableExperiences.body.experiences.map((experience) => {
          return (
            <DropdownMenuCheckboxItem
              key={experience._id}
              checked={experiences.includes(experience.name)}
              onCheckedChange={() =>
                changeTextsHandler("experience", experience.name)
              }
            >
              {experience.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      {availableExperiences &&
        availableExperiences.body.experiences.length <= 0 && (
          <div className="flex p-2 items-center justify-center">
            <span className="text-xs text-slate-500">No employments</span>
          </div>
        )}
      {isLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {error.status === 500 && error.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
