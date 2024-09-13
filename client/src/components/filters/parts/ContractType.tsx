import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { OfferFiltersType, OfferFilterType } from "@/types/types";

interface ContractTypePropsType {
  contractTypes: string[];
  avContractTypes: OfferFilterType[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function ContractType({
  changeTextsHandler,
  contractTypes,
  avContractTypes,
}: ContractTypePropsType) {
  return (
    <>
      {avContractTypes.map((contractType) => {
        return (
          <DropdownMenuCheckboxItem
            key={contractType._id}
            checked={contractTypes.includes(contractType.name)}
            onCheckedChange={() =>
              changeTextsHandler("contractType", contractType.name)
            }
            preventCloseOnSelect
          >
            {contractType.name}
          </DropdownMenuCheckboxItem>
        );
      })}
    </>
  );
}
