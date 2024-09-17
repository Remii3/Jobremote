import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { OfferFiltersType, OfferFilterType } from "@/types/types";

interface EmploymentTypePropsType {
  employments: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
  avEmploymentTypes: OfferFilterType[];
}

export default function EmploymentType({
  changeTextsHandler,
  employments,
  avEmploymentTypes,
}: EmploymentTypePropsType) {
  return (
    <>
      {avEmploymentTypes.map((employmentType) => {
        return (
          <DropdownMenuCheckboxItem
            key={employmentType._id}
            checked={employments.includes(employmentType.name)}
            onCheckedChange={() =>
              changeTextsHandler("employmentType", employmentType.name)
            }
            preventCloseOnSelect
          >
            {employmentType.name}
          </DropdownMenuCheckboxItem>
        );
      })}
    </>
  );
}
