import { OfferFiltersType } from "@/types/types";
import { useCallback, useState } from "react";

const initialFilters: Required<OfferFiltersType> = {
  categories: [],
  minSalary: 0,
  typeOfWork: [],
  experience: [],
  keyword: "",
  localization: [],
  technologies: [],
};

export default function useSearchFilters() {
  const [filters, setFilters] =
    useState<Required<OfferFiltersType>>(initialFilters);

  const updateFilters = useCallback(
    (key: keyof OfferFiltersType, value: any) => {
      setFilters((prevState) => {
        if (Array.isArray(prevState[key])) {
          if (prevState[key]?.includes(value)) {
            return {
              ...prevState,
              [key]: prevState[key].filter((item) => item !== value),
            };
          } else {
            return {
              ...prevState,
              [key]: [...prevState[key], value],
            };
          }
        } else {
          return {
            ...prevState,
            [key]: value,
          };
        }
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return { filters, updateFilters, resetFilters };
}
