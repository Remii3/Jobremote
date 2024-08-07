import { FilterSwitch, OfferFiltersType } from "@/types/types";
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
import { Badge } from "../ui/badge";
import { FormEvent } from "react";

interface FiltersPropsType {
  filters: OfferFiltersType;
  changeFilters: ({
    operation,
    newFilterKey,
    newFilterValue,
  }: FilterSwitch) => void;
  searchOffers: (e: FormEvent<HTMLFormElement>) => void;
}

const Filters = ({
  filters,
  changeFilters,
  searchOffers,
}: FiltersPropsType) => {
  function changeLocalizationHandler(localization: string) {
    changeFilters({
      operation: "multi-choice",
      newFilterKey: "localization",
      newFilterValue: localization,
    });
  }
  function changeExperienceHandler(experience: string) {
    changeFilters({
      operation: "multi-choice",
      newFilterKey: "experience",
      newFilterValue: experience,
    });
  }
  function changeTypeOfWorkHandler(typeOfWork: string) {
    changeFilters({
      operation: "multi-choice",
      newFilterKey: "typeOfWork",
      newFilterValue: typeOfWork,
    });
  }
  function changeTechnologyHandler(technology: string) {
    changeFilters({
      operation: "multi-choice",
      newFilterKey: "technologies",
      newFilterValue: technology,
    });
  }
  return (
    <section className="flex px-2 py-4 gap-4">
      <form
        onSubmit={searchOffers}
        className="relative flex-grow md:flex-grow-0"
      >
        <Input
          name="keyword"
          placeholder="Keyword..."
          value={filters.keyword}
          className="pr-10"
          onChange={(e) =>
            changeFilters({
              operation: "single-choice",
              newFilterKey: "keyword",
              newFilterValue: e.target.value,
            })
          }
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
              <Badge variant={"secondary"}>{filters.localization.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {localizations.map((localization) => {
            return (
              <DropdownMenuCheckboxItem
                key={localization}
                checked={filters.localization?.includes(localization)}
                onCheckedChange={() => changeLocalizationHandler(localization)}
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
                onCheckedChange={() => changeExperienceHandler(experience)}
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
                onCheckedChange={() => changeTypeOfWorkHandler(typeOfWork)}
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
              <Badge variant={"secondary"}>{filters.technologies.length}</Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {allowedTechnologies.map((technology) => {
            return (
              <DropdownMenuCheckboxItem
                key={technology}
                checked={filters.technologies?.includes(technology)}
                onCheckedChange={() => changeTechnologyHandler(technology)}
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
            {/* {filters.technologies && filters.technologies.length > 0 && ( */}
            {/* <Badge variant={"secondary"}>{filters.technologies.length}</Badge> */}
            {/* )} */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Slider />
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog>
        <DialogTrigger asChild className="block md:hidden">
          <Button variant={"outline"}>More filters</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>More fitlers</DialogTitle>
          <MoreFilters filters={filters} changeFilters={changeFilters} />
        </DialogContent>
      </Dialog>
      {/* sort */}
    </section>
  );
};

export default Filters;
