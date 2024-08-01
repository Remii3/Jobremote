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

interface FiltersPropsType {
  filters: OfferFiltersType;
  changeFilters: ({
    operation,
    newFilterKey,
    newFilterValue,
  }: FilterSwitch) => void;
  searchOffers: () => void;
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
    <section className="flex">
      <div>
        <Input
          name="keyword"
          placeholder="Search..."
          value={filters.keyword}
          onChange={(e) =>
            changeFilters({
              operation: "single-choice",
              newFilterKey: "keyword",
              newFilterValue: e.target.value,
            })
          }
        />
        <Button variant={"default"} type="button" onClick={searchOffers}>
          Find
        </Button>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>Localization</DropdownMenuTrigger>
          <DropdownMenuContent onSelect={(e) => console.log(e)}>
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
        <DialogTrigger>More filters</DialogTrigger>
        <DialogContent>
          <DialogTitle>More fitlers</DialogTitle>
          <MoreFilters filters={filters} changeFilters={changeFilters} />
        </DialogContent>
      </Dialog>
      {/* location */}
      {/* sort */}
    </section>
  );
};

export default Filters;
