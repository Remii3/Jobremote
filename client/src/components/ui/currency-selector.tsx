"use client";
import { AllowedCurrenciesType } from "@/types/types";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { useCurrency } from "@/context/CurrencyContext";
import { allowedCurrencies } from "@/data/constant";

export default function CurrencySelector() {
  const { currency, changeCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge variant={"outline"} className="h-6">
          {currency}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={(newCurrency) =>
            changeCurrency(newCurrency as AllowedCurrenciesType)
          }
        >
          {allowedCurrencies.map((currency) => (
            <DropdownMenuRadioItem key={currency} value={currency}>
              {currency}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
