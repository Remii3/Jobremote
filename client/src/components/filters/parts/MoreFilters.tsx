import { Separator } from "@/components/ui/separator";
import { OfferFiltersType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/context/CurrencyContext";
import { Slider } from "@/components/ui/slider";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import { EXPERIENCES } from "@/constants/experiences";
import { CONTRACTS } from "@/constants/contracts";
import { EMPLOYMENTS } from "@/constants/employments";
import React from "react";
import Localizations from "./Localizations";
import Technologies from "./Technologies";
import { cn } from "@/lib/utils";
import { LOCALIZATIONS } from "@/constants/localizations";

interface MoreFiltersTypes {
  filters: OfferFiltersType;
  changeSalaryHandler: (salary: number) => void;
  changeTextHandler: (key: keyof OfferFiltersType, text: string) => void;
}

const FilterComponent = ({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
}) => {
  return (
    <div className={cn(`space-y-2`, className)}>
      <h2>{label}</h2>
      <Separator />
      {children}
    </div>
  );
};

const MoreFilters = ({
  filters,
  changeSalaryHandler,
  changeTextHandler,
}: MoreFiltersTypes) => {
  const { formatCurrency, currency } = useCurrency();
  const { avTechnologies } = useGetAvailableTechnologies();
  return (
    <div className="space-y-4 overflow-y-auto px-4 py-2 border-t flex flex-col">
      <div className="space-y-2">
        <h2>Salary</h2>
        <Separator />
        <div className="space-y-2">
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
            onValueChange={(e) => changeSalaryHandler(e[0])}
            max={250}
            step={5}
            min={0}
            value={[filters.minSalary ? filters.minSalary / 1000 : 0]}
          />
        </div>
      </div>
      <FilterComponent
        label="Localizations & Technologies"
        className="block lg:hidden"
      >
        <div className="grid grid-cols-2 gap-2">
          <Localizations
            localizations={filters.localization}
            changeTextsHandler={changeTextHandler}
            avLocalizations={LOCALIZATIONS}
          />
          {avTechnologies && (
            <Technologies
              technologies={filters.technologies}
              changeTextsHandler={changeTextHandler}
              avTechnologies={avTechnologies.technologies}
            />
          )}
        </div>
      </FilterComponent>
      <FilterComponent label="Experience">
        <div className="space-y-2 grid grid-cols-2 gap-2">
          {EXPERIENCES.map((experience) => {
            return (
              <div key={experience._id} className="flex items-center">
                <Checkbox
                  onClick={() =>
                    changeTextHandler("experience", experience.name)
                  }
                  id={experience._id}
                  checked={filters.experience?.includes(experience.name)}
                  className="h-5 w-5"
                />

                <Label
                  htmlFor={experience._id}
                  className="text-base cursor-pointer pl-2"
                >
                  {experience.name}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterComponent>
      <FilterComponent label="Contracts">
        <div className="space-y-2 grid grid-cols-2 gap-2">
          {CONTRACTS.map((type) => {
            return (
              <div key={type._id} className="flex items-center">
                <Checkbox
                  onClick={() => changeTextHandler("contractType", type.name)}
                  id={type._id}
                  checked={filters.contractType.includes(type.name)}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor={type._id}
                  className="text-base cursor-pointer pl-2"
                >
                  {type.name}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterComponent>
      <FilterComponent label="Employments">
        <div className="space-y-2 grid grid-cols-2 gap-2">
          {EMPLOYMENTS.map((type) => {
            return (
              <div key={type._id} className="flex items-center">
                <Checkbox
                  onClick={() => changeTextHandler("employmentType", type.name)}
                  id={type._id}
                  checked={filters.employmentType.includes(type.name)}
                  className="h-5 w-5"
                />
                <Label
                  htmlFor={type._id}
                  className="text-base cursor-pointer pl-2"
                >
                  {type.name}
                </Label>
              </div>
            );
          })}
        </div>
      </FilterComponent>
    </div>
  );
};

export default MoreFilters;
