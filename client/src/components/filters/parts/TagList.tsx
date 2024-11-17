import { badgeVariants } from "@/components/ui/badge";
import { AllowedCurrenciesType, OfferFiltersType } from "@/types/types";

type TagListProps = {
  filters: OfferFiltersType;
  changeTextsHandler: (filterName: keyof OfferFiltersType, val: any) => void;
  resetFilters: () => void;
  formatCurrency: (value: number, currency: AllowedCurrenciesType) => string;
  currency: AllowedCurrenciesType;
  changeSalaryHandler: (value: number) => void;
};

export default function TagList({
  filters,
  changeTextsHandler,
  resetFilters,
  currency,
  formatCurrency,
  changeSalaryHandler,
}: TagListProps) {
  const checkIsFilterChanged = (filter: any) => {
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];

        if (Array.isArray(value) && value.length > 0) {
          return true;
        }
        if (typeof value === "string" && value !== "") {
          return true;
        }
        if (typeof value === "number" && value !== 0) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <>
      {checkIsFilterChanged(filters) && (
        <ul className="flex gap-2 flex-wrap lg:flex-nowrap lg:overflow-x-auto">
          {filters.keyword.trim() !== "" && (
            <li className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("keyword", "")}
                className="text-nowrap"
              >
                {filters.keyword}
              </button>
            </li>
          )}
          {filters.localization?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("localization", item)}
                className="text-nowrap"
              >
                {item}
              </button>
            </li>
          ))}
          {filters.experience?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("experience", item)}
                className="text-nowrap"
              >
                {item}
              </button>
            </li>
          ))}
          {filters.employmentType?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("employmentType", item)}
                className="text-nowrap"
              >
                {item}
              </button>
            </li>
          ))}
          {filters.contractType?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("contractType", item)}
                className="text-nowrap"
              >
                {item}
              </button>
            </li>
          ))}
          {filters.technologies?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("technologies", item)}
                className="text-nowrap"
              >
                {item}
              </button>
            </li>
          ))}
          {filters.minSalary !== 0 && (
            <li className={badgeVariants({ variant: "outline" })}>
              <button type="button" onClick={() => changeSalaryHandler(0)}>
                &gt;{formatCurrency(filters.minSalary / 1000, currency)}
                k/y
              </button>
            </li>
          )}
          <li
            className={`${badgeVariants({
              variant: "destructive",
            })} bg-red-200/80 border-red-500 text-red-500 hover:text-white`}
          >
            <button
              className="text-nowrap"
              onClick={() => {
                resetFilters();
              }}
            >
              Clear filters x
            </button>
          </li>
        </ul>
      )}
    </>
  );
}
