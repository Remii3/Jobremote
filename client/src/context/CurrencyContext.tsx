import { createContext, useContext, useEffect, useState } from "react";
import { AllowedCurrenciesType } from "@/types/types";

interface CurrencyContextTypes {
  currency: AllowedCurrenciesType;
  changeCurrency: (newCurrency: AllowedCurrenciesType) => void;
  formatCurrency: (amount: number, currency: AllowedCurrenciesType) => string;
  allowedCurrencies: AllowedCurrenciesType[];
}

const CurrencyContext = createContext<CurrencyContextTypes | undefined>(
  undefined
);

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<AllowedCurrenciesType>("USD");
  const [currencyRates, setCurrencyRates] = useState<{ [key: string]: number }>(
    {}
  );
  const allowedCurrencies: AllowedCurrenciesType[] = ["USD", "EUR"];
  const changeCurrency = (newCurrency: AllowedCurrenciesType) => {
    setCurrency(newCurrency);
  };

  const formatCurrency = (
    amount: number,
    productCurrency: AllowedCurrenciesType
  ) => {
    if (amount < 0 || typeof amount !== "number") return "N/A";
    if (!productCurrency) return amount.toString();
    const preparedAmount =
      amount === 0
        ? "0"
        : amount / currencyRates[productCurrency.toLowerCase()];

    const locale =
      currency === "USD" ? "en-US" : currency === "EUR" ? "de-DE" : "pl-PL";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(preparedAmount);
  };

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      const response = await fetch(
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency.toLowerCase()}.json`
      );
      const data = await response.json();
      setCurrencyRates(data[currency.toLowerCase()]);
    };
    fetchCurrencyRates();
  }, [currency]);

  return (
    <CurrencyContext.Provider
      value={{ currency, changeCurrency, formatCurrency, allowedCurrencies }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export { CurrencyProvider, useCurrency };
