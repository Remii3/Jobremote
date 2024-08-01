import { CurrencyTypes } from "@/types/types";

export default function usePriceFormatter() {
  const customFormatter = (value: number, currentCurrency: CurrencyTypes) => {
    console.log(currentCurrency);
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: currentCurrency || "PLN",
    }).format(value);
  };
  return { customFormatter };
}
