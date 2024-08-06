import { Separator } from "@/components/ui/separator";
import { FilterSwitch, OfferFiltersType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  experience,
  typeOfWork,
} from "../../../../../server/src/schemas/offerSchemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MoreFiltersTypes {
  filters: OfferFiltersType;
  changeFilters: ({
    operation,
    newFilterKey,
    newFilterValue,
  }: FilterSwitch) => void;
}
const MoreFilters = ({ filters, changeFilters }: MoreFiltersTypes) => {
  return (
    <div className="">
      <div>
        <h2>Salary</h2>
        <Separator />
        <div className="flex gap-4">
          <div>
            <Label htmlFor="minSalary">Salary Min</Label>
            <Input
              id="minSalary"
              type="text"
              defaultValue={"0"}
              onChange={(e) =>
                changeFilters({
                  operation: "single-choice",
                  newFilterKey: "minSalary",
                  newFilterValue: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="maxSalary">Salary Max</Label>
            <Input
              id="maxSalary"
              type="text"
              defaultValue={"100000"}
              onChange={(e) =>
                changeFilters({
                  operation: "single-choice",
                  newFilterKey: "maxSalary",
                  newFilterValue: e.target.value,
                })
              }
            />
          </div>
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
      <div>
        <Button variant={"default"} className="mt-4">
          Search offers
        </Button>
      </div>
    </div>
  );
};

export default MoreFilters;
