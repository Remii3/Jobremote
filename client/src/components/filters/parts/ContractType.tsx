import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import { OfferFiltersType } from "@/types/types";
import { Loader2 } from "lucide-react";

interface ContractTypePropsType {
  contractTypes: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function EmploymentType({
  changeTextsHandler,
  contractTypes,
}: ContractTypePropsType) {
  const { avContractTypes, avContractTypesError, avContractTypesIsLoading } =
    useGetAvailableContractTypes();
  return (
    <>
      {avContractTypes &&
        avContractTypes.body.contractTypes.length > 0 &&
        avContractTypes.body.contractTypes.map((contractType) => {
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
      {avContractTypes && avContractTypes.body.contractTypes.length <= 0 && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">No employments</span>
        </div>
      )}
      {avContractTypesIsLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {avContractTypesError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {avContractTypesError.status === 500 &&
              avContractTypesError.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
