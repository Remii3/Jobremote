import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  ArrowUpDown,
  ChevronsUpDown,
  Loader2,
  Search,
  Settings2,
} from "lucide-react";
import { Badge, badgeVariants } from "../ui/badge";
import { FormEvent, useState } from "react";
import { Slider } from "../ui/slider";
import { useCurrency } from "@/context/CurrencyContext";
import { checkIsFilterChanged } from "@/lib/utils";
import Technologies from "./parts/Technologies";
import EmploymentType from "./parts/EmploymentType";
import Localizations from "./parts/Localizations";
import Experience from "./parts/Experience";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import ContractType from "./parts/ContractType";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "../ui/command";

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

const ServerErrorMessage = ({
  message,
  status,
}: {
  message: string;
  status: number;
}) => (
  <div className="flex p-2 items-center justify-center">
    <span className="text-xs text-slate-500">{status === 500 && message}</span>
  </div>
);

const LoadingComponent = () => (
  <div className="flex p-2 items-center justify-center">
    <Loader2 className="w-4 h-4 animate-spin" />
  </div>
);

const EmptyFilterComponent = ({ message }: { message: string }) => (
  <div className="flex p-2 items-center justify-center">
    <span className="text-xs text-slate-500">{message}</span>
  </div>
);

const Filters = ({
  filters,
  changeFilters,
  resetFilters,
  setSortOption,
  sortOption,
}: FiltersPropsType) => {
  const { formatCurrency, currency } = useCurrency();
  const [techOpen, setTechOpen] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { avContractTypes, avContractTypesError, avContractTypesIsLoading } =
    useGetAvailableContractTypes();
  const { avLocalizations, avLocalizationsError, avLocalizationsIsLoading } =
    useGetAvailableLocalizations();
  const {
    avEmploymentTypes,
    avEmploymentTypesError,
    avEmploymentTypesIsLoading,
  } = useGetAvailableEmploymentTypes();
  const { avExperiences, avExperiencesError, avExperiencesIsLoading } =
    useGetAvailableExperiences();
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
              {avLocalizations &&
                avLocalizations.body.localizations.length > 0 && (
                  <Localizations
                    localizations={filters.localization}
                    changeTextsHandler={changeTextsHandler}
                    avLocalizations={avLocalizations.body.localizations}
                  />
                )}
              {avLocalizations &&
                avLocalizations.body.localizations.length <= 0 && (
                  <EmptyFilterComponent message="No localizations" />
                )}
              {avLocalizationsIsLoading && <LoadingComponent />}
              {avLocalizationsError && avLocalizationsError.status === 500 && (
                <ServerErrorMessage
                  message={avLocalizationsError.body.msg}
                  status={avLocalizationsError.status}
                />
              )}
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
              {avExperiences && avExperiences.body.experiences.length > 0 && (
                <Experience
                  experiences={filters.experience}
                  changeTextsHandler={changeTextsHandler}
                  avExperiences={avExperiences.body.experiences}
                />
              )}
              {avExperiences && avExperiences.body.experiences.length <= 0 && (
                <EmptyFilterComponent message="No experiences" />
              )}
              {avExperiencesIsLoading && <LoadingComponent />}
              {avExperiencesError && avExperiencesError.status === 500 && (
                <ServerErrorMessage
                  message={avExperiencesError.body.msg}
                  status={avExperiencesError.status}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Employmnet type</span>
                {filters.employmentType &&
                  filters.employmentType.length > 0 && (
                    <Badge variant={"secondary"}>
                      {filters.employmentType.length}
                    </Badge>
                  )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {avEmploymentTypes &&
                avEmploymentTypes.body.employmentTypes.length > 0 && (
                  <EmploymentType
                    changeTextsHandler={changeTextsHandler}
                    employments={filters.employmentType}
                    avEmploymentTypes={avEmploymentTypes.body.employmentTypes}
                  />
                )}
              {avEmploymentTypes &&
                avEmploymentTypes.body.employmentTypes.length <= 0 && (
                  <EmptyFilterComponent message="No employments" />
                )}
              {avEmploymentTypesIsLoading && <LoadingComponent />}
              {avEmploymentTypesError &&
                avEmploymentTypesError.status === 500 && (
                  <ServerErrorMessage
                    message={avEmploymentTypesError.body.msg}
                    status={avEmploymentTypesError.status}
                  />
                )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hidden lg:block">
              <Button variant={"outline"} className="space-x-1">
                <span>Contract type</span>
                {filters.contractType && filters.contractType.length > 0 && (
                  <Badge variant={"secondary"}>
                    {filters.contractType.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {avContractTypes &&
                avContractTypes.body.contractTypes.length > 0 && (
                  <ContractType
                    changeTextsHandler={changeTextsHandler}
                    contractTypes={filters.contractType}
                    avContractTypes={avContractTypes?.body.contractTypes}
                  />
                )}
              {avContractTypes &&
                avContractTypes.body.contractTypes.length <= 0 && (
                  <EmptyFilterComponent message="No contracts" />
                )}
              {avContractTypesIsLoading && <LoadingComponent />}
              {avContractTypesError && avContractTypesError.status === 500 && (
                <ServerErrorMessage
                  message={avContractTypesError.body.msg}
                  status={avContractTypesError.status}
                />
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover open={techOpen} onOpenChange={setTechOpen}>
              <PopoverTrigger asChild className="hidden lg:flex">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={techOpen}
                  className="w-[200px] justify-between"
                >
                  Technology
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search technology..." />
                  <CommandList>
                    <CommandEmpty>No technology found.</CommandEmpty>
                    <CommandGroup>
                      {avTechnologies &&
                        avTechnologies.body.technologies.length > 0 && (
                          <Technologies
                            technologies={filters.technologies}
                            changeTextsHandler={changeTextsHandler}
                            avTechnologies={avTechnologies.body.technologies}
                          />
                        )}
                      {avTechnologies &&
                        avTechnologies.body.technologies.length <= 0 && (
                          <EmptyFilterComponent message="No technologies" />
                        )}
                      {avTechnologiesIsLoading && <LoadingComponent />}
                      {avTechnologiesError &&
                        avTechnologiesError.status === 500 && (
                          <ServerErrorMessage
                            message={avTechnologiesError.body.msg}
                            status={avTechnologiesError.status}
                          />
                        )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
          </Popover>
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
          <Dialog open={showMoreFilters} onOpenChange={setShowMoreFilters}>
            <DialogTrigger asChild className="block lg:hidden">
              <Button variant={"outline"} className="flex ">
                <span className="hidden sm:inline mr-1">More filters</span>
                <Settings2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full overflow-hidden p-0">
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
              <div className="px-4 pb-4">
                <Button onClick={() => setShowMoreFilters(false)}>
                  Show results
                </Button>
              </div>
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
