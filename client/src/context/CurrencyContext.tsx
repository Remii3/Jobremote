import { createContext, useContext, useEffect, useState } from "react";
import { CurrencyTypes } from "@/types/types";

interface CurrencyContextTypes {
  currency: CurrencyTypes;
  changeCurrency: (newCurrency: CurrencyTypes) => void;
  formatCurrency: (amount: number, currency: CurrencyTypes) => string;
}

const CurrencyContext = createContext<CurrencyContextTypes | undefined>(
  undefined
);

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyTypes>("USD");
  const [currencyRates, setCurrencyRates] = useState<{ [key: string]: number }>(
    {}
  );

  const changeCurrency = (newCurrency: CurrencyTypes) => {
    setCurrency(newCurrency);
  };

  const formatCurrency = (amount: number, productCurrency: CurrencyTypes) => {
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
      value={{ currency, changeCurrency, formatCurrency }}
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
