import { OfferFiltersType } from "@/types/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import MoreFilters from "./parts/MoreFilters";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  allowedTechnologies,
  experience,
  localizations,
  typeOfWork,
} from "../../../../server/src/schemas/offerSchemas";
import { Search } from "lucide-react";
import { Badge, badgeVariants } from "../ui/badge";
import { FormEvent } from "react";
import { Slider } from "../ui/slider";
import { useCurrency } from "@/context/CurrencyContext";

interface FiltersPropsType {
  filters: Required<OfferFiltersType>;
  changeFilters: (key: keyof OfferFiltersType, value: string) => void;
  searchOffers: (e: FormEvent<HTMLFormElement>) => void;
}

const Filters = ({
  filters,
  changeFilters,
  searchOffers,
}: FiltersPropsType) => {
  const { formatCurrency, currency } = useCurrency();

  function changeTextsHandler(key: keyof OfferFiltersType, text: string) {
    changeFilters(key, text);
  }

  function changeSalaryHandler(salary: number | "") {
    let newSalary;
    if (typeof salary === "number" && salary === 0) {
      newSalary = 0;
    } else if (salary === "") {
      newSalary = "";
    } else {
      newSalary = salary * 1000;
    }
    changeFilters("minSalary", newSalary.toString());
  }
  console.log("filters ", filters);
  return (
    <section className="">
      <div className="flex px-2 py-4 gap-4">
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
            {localizations.map((localization) => {
              return (
                <DropdownMenuCheckboxItem
                  key={localization}
                  checked={filters.localization?.includes(localization)}
                  onCheckedChange={() =>
                    changeTextsHandler("localization", localization)
                  }
                >
                  {localization}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden sm:block">
            <Button variant={"outline"} className="space-x-1">
              <span>Experience</span>
              {filters.experience && filters.experience.length > 0 && (
                <Badge variant={"secondary"}>{filters.experience.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {experience.map((experience) => {
              return (
                <DropdownMenuCheckboxItem
                  key={experience}
                  checked={filters.experience?.includes(experience)}
                  onCheckedChange={() =>
                    changeTextsHandler("experience", experience)
                  }
                >
                  {experience}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:block">
            <Button variant={"outline"} className="space-x-1">
              <span>Type of work</span>
              {filters.typeOfWork && filters.typeOfWork.length > 0 && (
                <Badge variant={"secondary"}>{filters.typeOfWork.length}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {typeOfWork.map((typeOfWork) => {
              return (
                <DropdownMenuCheckboxItem
                  key={typeOfWork}
                  checked={filters.typeOfWork?.includes(typeOfWork)}
                  onCheckedChange={() =>
                    changeTextsHandler("typeOfWork", typeOfWork)
                  }
                >
                  {typeOfWork}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:block">
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
            {allowedTechnologies.map((technology) => {
              return (
                <DropdownMenuCheckboxItem
                  key={technology}
                  checked={filters.technologies?.includes(technology)}
                  onCheckedChange={() =>
                    changeTextsHandler("technologies", technology)
                  }
                >
                  {technology}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hidden md:block">
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
                step={10}
                min={0}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog>
          <DialogTrigger asChild className="block md:hidden">
            <Button variant={"outline"}>More filters</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>More fitlers</DialogTitle>
            {/* <MoreFilters filters={filters} changeFilters={changeFilters} /> */}
          </DialogContent>
        </Dialog>
        {/* sort */}
      </div>
      <ul className="flex gap-2">
        {/* {filters.localization?.map((item) => (
          <li key={item} className={badgeVariants({ variant: "outline" })}>
            <button
              type="button"
              onClick={() => changeLocalizationHandler(item)}
            >
              {item}
            </button>
          </li>
        ))}
        {filters.experience?.map((item) => (
          <li key={item} className={badgeVariants({ variant: "outline" })}>
            <button type="button" onClick={() => changeExperienceHandler(item)}>
              {item}
            </button>
          </li>
        ))}
        {filters.typeOfWork?.map((item) => (
          <li key={item} className={badgeVariants({ variant: "outline" })}>
            <button type="button" onClick={() => changeTypeOfWorkHandler(item)}>
              {item}
            </button>
          </li>
        ))}
        {filters.technologies?.map((item) => (
          <li key={item} className={badgeVariants({ variant: "outline" })}>
            <button
              type="button"
              className={badgeVariants({ variant: "outline" })}
            >
              {item}
            </button>
          </li>
        ))} */}
        {filters.minSalary !== 0 && (
          <li className={badgeVariants({ variant: "outline" })}>
            <button type="button" onClick={() => changeSalaryHandler(0)}>
              &gt;{formatCurrency(Number(filters.minSalary) / 1000, currency)}
              k/y
            </button>
          </li>
        )}
      </ul>
    </section>
  );
};

export default Filters;
