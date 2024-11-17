import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import MoreFilters from "./parts/MoreFilters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ArrowUpDown, Search, Settings2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Slider } from "../ui/slider";
import { useCurrency } from "@/context/CurrencyContext";
import Technologies from "./parts/Technologies";
import Localizations from "./parts/Localizations";
import { useGetAvailableTechnologies } from "@/hooks/useGetAvailableTechnologies";

import TagList from "./parts/TagList";
import { LOCALIZATIONS } from "@/constants/localizations";

interface FiltersPropsType {
  filters: Required<OfferFiltersType>;
  changeFilters: (key: keyof OfferFiltersType, value: string | number) => void;
  resetFilters: () => void;
  sortOption: OfferSortOptionsTypes;
  setSortOption: (value: OfferSortOptionsTypes) => void;
}

const SORT_OPTIONS: Record<OfferSortOptionsTypes, string> = {
  latest: "Latest",
  salary_highest: "Highest salary",
  salary_lowest: "Lowest salary",
};
const SORT_OPTIONS_ARRAY = Object.keys(SORT_OPTIONS).map((key) => ({
  key: key as OfferSortOptionsTypes,
  value: SORT_OPTIONS[key as OfferSortOptionsTypes],
}));

export default function Filters({
  filters,
  changeFilters,
  resetFilters,
  setSortOption,
  sortOption,
}: FiltersPropsType) {
  const { formatCurrency, currency } = useCurrency();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { avTechnologies, avTechnologiesError, avTechnologiesIsLoading } =
    useGetAvailableTechnologies();

  function changeTextsHandler(key: keyof OfferFiltersType, text: string) {
    changeFilters(key, text);
  }

  function changeSalaryHandler(salary: number) {
    changeFilters("minSalary", salary * 1000);
  }

  function searchOffers(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <>
      <div className="flex gap-4 justify-between">
        <div className="flex gap-4 flex-grow">
          <form
            onSubmit={searchOffers}
            className="relative w-full focus-within:w-full max-w-[600px] md:w-64 transition-[width] ease-in-out duration-500"
          >
            <Input
              name="keyword"
              placeholder="Keyword..."
              value={filters.keyword}
              className="pr-10"
              onChange={(e) => changeTextsHandler("keyword", e.target.value)}
            />
            <button
              className="absolute top-0.5 p-2 right-1 rounded-full"
              type="submit"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
          <div className="hidden md:block">
            <Localizations
              avLocalizations={LOCALIZATIONS}
              changeTextsHandler={changeTextsHandler}
              localizations={filters.localization}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Salary</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="px-2 pt-1.5 pb-3 space-y-3">
                <div className="flex justify-between gap-3">
                  <span className="text-sm">Minimum</span>
                  <span className="text-sm">
                    {formatCurrency(
                      filters.minSalary === 0 ? 0 : filters.minSalary / 1000,
                      currency
                    )}
                    k/year
                  </span>
                </div>
                <Slider
                  defaultValue={[0]}
                  onValueChange={(e) => changeSalaryHandler(e[0])}
                  max={250}
                  step={5}
                  min={0}
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {avTechnologies && (
            <div className="hidden lg:block">
              <Technologies
                technologies={filters.technologies}
                changeTextsHandler={changeTextsHandler}
                avTechnologies={avTechnologies.technologies}
              />
            </div>
          )}
          <Dialog open={showMoreFilters} onOpenChange={setShowMoreFilters}>
            <DialogTrigger asChild className="block">
              <Button variant={"outline"} className="flex ">
                <span className="hidden sm:inline mr-1">More filters</span>
                <Settings2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="overflow-hidden p-0">
              <DialogHeader className="px-4 pt-4">
                <DialogTitle>Fitlers</DialogTitle>
                <DialogDescription className="sr-only">
                  Options for filters
                </DialogDescription>
              </DialogHeader>
              <MoreFilters
                filters={filters}
                changeSalaryHandler={changeSalaryHandler}
                changeTextHandler={changeTextsHandler}
              />
              <DialogFooter>
                <div className="px-4 pb-4">
                  <Button onClick={() => setShowMoreFilters(false)}>
                    Show results
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <span className="mr-1 sm:inline hidden">Sort</span>
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={sortOption}
              onValueChange={(option) =>
                setSortOption(option as OfferSortOptionsTypes)
              }
            >
              {SORT_OPTIONS_ARRAY.map((option) => (
                <DropdownMenuRadioItem key={option.key} value={option.key}>
                  {option.value}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <TagList
        filters={filters}
        changeTextsHandler={changeTextsHandler}
        resetFilters={resetFilters}
        formatCurrency={formatCurrency}
        currency={currency}
        changeSalaryHandler={changeSalaryHandler}
      />
    </>
  );
}
