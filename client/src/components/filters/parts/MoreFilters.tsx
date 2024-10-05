import { Separator } from "@/components/ui/separator";
import { OfferFiltersType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/context/CurrencyContext";
import { Slider } from "@/components/ui/slider";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";

interface MoreFiltersTypes {
  filters: OfferFiltersType;
  changeSalaryHandler: (salary: number) => void;
  changeTextHandler: (key: keyof OfferFiltersType, text: string) => void;
}
const MoreFilters = ({
  filters,
  changeSalaryHandler,
  changeTextHandler,
}: MoreFiltersTypes) => {
  const { formatCurrency, currency } = useCurrency();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { avLocalizations } = useGetAvailableLocalizations();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avTechnologies } = useGetAvailableTechnologies();
  return (
    <div className="space-y-4 overflow-y-auto px-4 py-2 border-t">
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
      <div className="space-y-2">
        <h2>Experience</h2>
        <Separator />
        <div className="space-y-2">
          {avExperiences &&
            avExperiences.body.experiences.map((experience) => {
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
                    htmlFor={experience.name}
                    className="text-base cursor-pointer pl-2"
                  >
                    {experience.name}
                  </Label>
                </div>
              );
            })}
        </div>
      </div>
      <div className="space-y-2">
        <h2>Contract types</h2>
        <Separator />
        <div className="space-y-2">
          {avContractTypes &&
            avContractTypes.body.contractTypes.map((type) => {
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
      </div>
      <div className="space-y-2">
        <h2>Localizations</h2>
        <Separator />
        <div className="space-y-2">
          {avLocalizations &&
            avLocalizations.body.localizations.map((type) => {
              return (
                <div key={type._id} className="flex items-center">
                  <Checkbox
                    onClick={() => changeTextHandler("localization", type.name)}
                    id={type._id}
                    checked={filters.localization.includes(type.name)}
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
      </div>
      <div className="space-y-2">
        <h2>Emploment types</h2>
        <Separator />
        <div className="space-y-2">
          {avEmploymentTypes &&
            avEmploymentTypes.body.employmentTypes.map((type) => {
              return (
                <div key={type._id} className="flex items-center">
                  <Checkbox
                    onClick={() =>
                      changeTextHandler("employmentType", type.name)
                    }
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
      </div>
      <div className="space-y-2">
        <h2>Technologies</h2>
        <Separator />
        <div className="space-y-2">
          {avTechnologies &&
            avTechnologies.body.technologies.map((type) => {
              return (
                <div key={type._id} className="flex items-center">
                  <Checkbox
                    onClick={() => changeTextHandler("technologies", type.name)}
                    id={type._id}
                    checked={filters.technologies.includes(type.name)}
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
      </div>
    </div>
  );
};

export default MoreFilters;
