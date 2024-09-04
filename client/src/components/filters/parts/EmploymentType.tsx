import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { client } from "@/lib/utils";
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
    data: availableEmploymentTypes,
    isLoading,
    isError,
    error,
  } = client.offers.getEmploymentTypes.useQuery(
    ["employment-types"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <>
      {availableEmploymentTypes &&
        availableEmploymentTypes.body.employmentTypes.length > 0 &&
        availableEmploymentTypes.body.employmentTypes.map((employmentType) => {
          return (
            <DropdownMenuCheckboxItem
              key={employmentType._id}
              checked={employments.includes(employmentType.name)}
              onCheckedChange={() =>
                changeTextsHandler("typeOfWork", employmentType.name)
              }
            >
              {employmentType.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      {availableEmploymentTypes &&
        availableEmploymentTypes.body.employmentTypes.length <= 0 && (
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
