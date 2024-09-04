import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { OfferSortOptionsSchema } from "../../../../server/src/schemas/offerSchemas";
import { Search, Settings2 } from "lucide-react";
import { Badge, badgeVariants } from "../ui/badge";
import { FormEvent, useState } from "react";
import { Slider } from "../ui/slider";
import { useCurrency } from "@/context/CurrencyContext";
import { checkIsFilterChanged, client } from "@/lib/utils";
import Technologies from "./parts/Technologies";
import EmploymentType from "./parts/EmploymentType";
import Localizations from "./parts/Localizations";
import Experience from "./parts/Experience";

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

const Filters = ({
  filters,
  changeFilters,
  resetFilters,
  setSortOption,
  sortOption,
}: FiltersPropsType) => {
  const { formatCurrency, currency } = useCurrency();
  const [showMoreFilters, setShowMoreFilters] = useState(false);
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
        <div className="flex gap-4">
          <form
            onSubmit={searchOffers}
            className="relative flex-grow md:flex-grow-0"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden sm:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Localization</span>
                {filters.localization && filters.localization.length > 0 && (
                  <Badge variant={"secondary"}>
                    {filters.localization.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Localizations
                localizations={filters.localization}
                changeTextsHandler={changeTextsHandler}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden md:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Experience</span>
                {filters.experience && filters.experience.length > 0 && (
                  <Badge variant={"secondary"}>
                    {filters.experience.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Experience
                experiences={filters.experience}
                changeTextsHandler={changeTextsHandler}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Type of work</span>
                {filters.typeOfWork && filters.typeOfWork.length > 0 && (
                  <Badge variant={"secondary"}>
                    {filters.typeOfWork.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EmploymentType
                changeTextsHandler={changeTextsHandler}
                employments={filters.typeOfWork}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Technologies</span>
                {filters.technologies && filters.technologies.length > 0 && (
                  <Badge variant={"secondary"}>
                    {filters.technologies.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <Technologies
                technologies={filters.technologies}
                changeTextsHandler={changeTextsHandler}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Salary</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="px-2 pb-2 pt-1">
                <div className="flex justify-between gap-3 mb-3">
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
                <div>
                  <div className="flex items-center justify-between text-sm mt-2 gap-4">
                    <span>Minimum</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Input
                        type="number"
                        max={250}
                        min={0}
                        step={5}
                        className=""
                        onChange={(e) =>
                          changeSalaryHandler(Number(e.target.value))
                        }
                        value={
                          filters.minSalary === 0 ? 0 : filters.minSalary / 1000
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={showMoreFilters} onOpenChange={setShowMoreFilters}>
            <DialogTrigger asChild className="block lg:hidden">
              <Button variant={"outline"}>More filters</Button>
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <DialogTitle>More fitlers</DialogTitle>
                <DialogDescription className="sr-only">
                  Options for filters
                </DialogDescription>
                <div className="py-4 space-y-4">
                  <MoreFilters
                    filters={filters}
                    changeSalaryHandler={changeSalaryHandler}
                    changeTextHandler={changeTextsHandler}
                  />
                </div>
                <div>
                  <Button
                    onClick={() => setShowMoreFilters(false)}
                    className="mt-2"
                  >
                    Show results
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <span className="mr-1">Sort</span>
              <Settings2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={sortOption}
              onValueChange={(option) =>
                setSortOption(option as OfferSortOptionsTypes)
              }
            >
              {OfferSortOptionsSchema.options.map((option) => (
                <DropdownMenuRadioItem key={option} value={option}>
                  {SORT_OPTIONS[option]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
          {filters.typeOfWork?.map((item) => (
            <li key={item} className={badgeVariants({ variant: "outline" })}>
              <button
                type="button"
                onClick={() => changeTextsHandler("typeOfWork", item)}
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
          {checkIsFilterChanged(filters) && (
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
          )}
        </ul>
      )}
    </>
  );
};

export default Filters;
