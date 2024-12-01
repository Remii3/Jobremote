"use client";
import { useCurrency } from "@/context/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Badge } from "./badge";
import { CONSTANT_SALARY_TYPE } from "@/constants/constant";
import { AllowedSalaryTypes } from "@/types/types";

export default function SalaryTypeSelector() {
  const { salaryType, changeSalaryType } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge variant={"outline"} className="h-6">
          {salaryType}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={salaryType}
          onValueChange={(newCurrency) =>
            changeSalaryType(newCurrency as AllowedSalaryTypes)
          }
        >
          {CONSTANT_SALARY_TYPE.map((currency) => (
            <DropdownMenuRadioItem
              key={currency}
              value={currency}
              className="flex justify-between gap-4"
            >
              <span>{currency}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
