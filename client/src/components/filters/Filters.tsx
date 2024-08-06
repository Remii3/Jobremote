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
import { localizations } from "../../../../server/src/schemas/offerSchemas";
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
  return (
    <section className="flex px-2 py-4 gap-4">
      <form onSubmit={searchOffers} className="relative">
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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
                    changeLocalizationHandler(localization)
                  }
                >
                  {localization}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog>
        <DialogTrigger asChild>
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
