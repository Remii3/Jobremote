import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import { OfferFiltersType } from "@/types/types";
import { Loader2 } from "lucide-react";

interface EmploymentTypePropsType {
  employments: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function EmploymentType({
  changeTextsHandler,
  employments,
}: EmploymentTypePropsType) {
  const {
    avEmploymentTypes,
    avEmploymentTypesError,
    avEmploymentTypesIsLoading,
  } = useGetAvailableEmploymentTypes();
  return (
    <>
      {avEmploymentTypes &&
        avEmploymentTypes.body.employmentTypes.length > 0 &&
        avEmploymentTypes.body.employmentTypes.map((employmentType) => {
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
      {avEmploymentTypes &&
        avEmploymentTypes.body.employmentTypes.length <= 0 && (
          <div className="flex p-2 items-center justify-center">
            <span className="text-xs text-slate-500">No employments</span>
          </div>
        )}
      {avEmploymentTypesIsLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {avEmploymentTypesError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {avEmploymentTypesError.status === 500 &&
              avEmploymentTypesError.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
