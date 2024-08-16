import { Separator } from "@/components/ui/separator";
import { FilterSwitch, OfferFiltersType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  experience,
  typeOfWork,
} from "../../../../../server/src/schemas/offerSchemas";
import { useCurrency } from "@/context/CurrencyContext";
import { Slider } from "@/components/ui/slider";

interface MoreFiltersTypes {
  filters: OfferFiltersType;
  changeFilters: ({
    operation,
    newFilterKey,
    newFilterValue,
  }: FilterSwitch) => void;
}
const MoreFilters = ({ filters, changeFilters }: MoreFiltersTypes) => {
  const { formatCurrency, currency } = useCurrency();
  function changeSalaryHandler(salary: number) {
    changeFilters({
      operation: "single-choice",
      newFilterKey: "minSalary",
      newFilterValue: salary * 1000,
    });
  }

  return (
    <div className="">
      <div>
        <h2>Salary</h2>
        <Separator />
        <div className="px-2 pb-2 pt-1">
          <div className="flex justify-between gap-3 mb-3">
            <span className="text-sm">Minimum</span>
            <span className="text-sm">
              {formatCurrency(
                filters.minSalary ? Number(filters.minSalary) / 1000 : 0,
                currency
              )}
              k/year
            </span>
          </div>
          <Slider
            defaultValue={[0]}
            onValueChange={(e) => changeSalaryHandler(e[0])}
            max={250}
            step={10}
            min={0}
          />
        </div>
      </div>
      <div>
        <h2>Experience</h2>
        <Separator />
        <div className="space-y-2 mt-2">
          {experience.map((experience) => {
            return (
              <div key={experience} className="flex items-center">
                <Checkbox
                  onClick={() =>
                    changeFilters({
                      operation: "multi-choice",
                      newFilterKey: "experience",
                      newFilterValue: experience,
                    })
                  }
                  id={experience}
                  checked={filters.experience?.includes(experience)}
                  className="h-5 w-5"
                />

                <Label
                  htmlFor={experience}
                  className="text-base cursor-pointer pl-2"
                >
                  {experience}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2>Type of work</h2>
        <Separator />
        <div className="space-y-2 mt-2">
          {typeOfWork.map((type) => {
            return (
              <div key={type} className="flex items-center">
                <Checkbox
                  onClick={() =>
                    changeFilters({
                      operation: "multi-choice",
                      newFilterKey: "typeOfWork",
                      newFilterValue: type,
                    })
                  }
                  id={type}
                  checked={filters.typeOfWork?.includes(type)}
                  className="h-5 w-5"
                />
                <Label htmlFor={type} className="text-base cursor-pointer pl-2">
                  {type}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreFilters;
