"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AllowedCurrenciesType } from "@/types/types";
import { allowedCurrencies } from "@/constants/constant";

interface CurrencyContextTypes {
  currency: AllowedCurrenciesType;
  changeCurrency: (newCurrency: AllowedCurrenciesType) => void;
  formatCurrency: (amount: number, currency: AllowedCurrenciesType) => string;
  allowedCurrencies: AllowedCurrenciesType[];
}

const CurrencyContext = createContext<CurrencyContextTypes | undefined>(
  undefined
);

const LOCALES = {
  USD: "en-US",
  EUR: "de-DE",
};

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<AllowedCurrenciesType>("USD");
  const [currencyRates, setCurrencyRates] = useState<{ [key: string]: number }>(
    {}
  );
  const changeCurrency = (newCurrency: AllowedCurrenciesType) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const formatCurrency = (
    amount: number,
    productCurrency: AllowedCurrenciesType
  ) => {
    if (amount < 0 || typeof amount !== "number") return "N/A";

    if (!productCurrency || !currency) return amount.toString();

    const productCurrencyRate = currencyRates[productCurrency.toLowerCase()];
    const targetCurrencyRate = currencyRates[currency.toLowerCase()];
    if (!productCurrencyRate || !targetCurrencyRate) return "N/A";

    let preparedAmount = amount === 0 ? 0 : amount / productCurrencyRate; // Convert to base unit (USD equivalent)

    if (currency === "USD") {
      if (productCurrency !== "USD") {
        preparedAmount *= 12;
      }
    } else {
      if (productCurrency === "USD") {
        preparedAmount /= 12;
      }
      preparedAmount *= targetCurrencyRate;
    }

    const locale = LOCALES[currency] || "en-US";

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

    if (localStorage.getItem("currency") !== currency) {
      setCurrency(localStorage.getItem("currency") as AllowedCurrenciesType);
    }
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
