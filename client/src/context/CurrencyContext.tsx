"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AllowedCurrenciesType } from "@/types/types";
import { allowedCurrencies } from "@/constants/constant";
import { formatDate } from "@/lib/utils";

interface CurrencyContextTypes {
  currency: AllowedCurrenciesType;
  changeCurrency: (newCurrency: AllowedCurrenciesType) => void;
  formatCurrency: (
    amount: number,
    currency: AllowedCurrenciesType,
    convert?: boolean
  ) => string;
  allowedCurrencies: AllowedCurrenciesType[];
  salaryType: string;
  changeSalaryType: (newSalaryType: string) => void;
  convertCurrency: ({
    amount,
    customCurrency,
  }: {
    amount: number;
    customCurrency: string;
  }) => number;
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
  const [salaryType, setSalaryType] = useState<string>("yearly");
  const [currencyRates, setCurrencyRates] = useState<any>(null);

  const changeSalaryType = (newSalaryType: string) => {
    setSalaryType(newSalaryType);
    localStorage.setItem("salaryType", newSalaryType);
  };

  const changeCurrency = (newCurrency: AllowedCurrenciesType) => {
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  const convertCurrency = ({
    amount,
    customCurrency,
  }: {
    amount: number;
    customCurrency: string;
  }) => {
    const productCurrencyRate =
      currencyRates[customCurrency.toLowerCase()][currency.toLowerCase()];
    return parseFloat((amount * productCurrencyRate).toFixed(4));
  };

  const formatCurrency = (
    amount: number,
    productCurrency: AllowedCurrenciesType,
    convert: boolean = true
  ) => {
    if (amount < 0 || typeof amount !== "number") return "N/A";

    if (!productCurrency || !currency || !currencyRates)
      return amount.toString();

    let preparedAmount = amount === 0 ? 0 : amount;
    const locale = LOCALES[currency] || "en-US";

    if (convert && productCurrency !== currency) {
      preparedAmount = convertCurrency({
        amount: preparedAmount,
        customCurrency: productCurrency,
      });
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(preparedAmount);
    } else {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: productCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(preparedAmount);
    }
  };

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      const urls = [
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formatDate(
          new Date()
        )}/v1/currencies/usd.json`,
        `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${formatDate(
          new Date()
        )}/v1/currencies/eur.json`,
      ];
      const responses = await Promise.all(urls.map((url) => fetch(url)));

      if (responses.some((res) => !res.ok)) {
        throw new Error("Failed to fetch one or more currency rates");
      }

      const data = await Promise.all(responses.map((res) => res.json()));

      const rates = data.reduce((acc, item) => {
        const keys = Object.keys(item).filter((key) => key !== "date");

        keys.forEach((key) => {
          acc[key] = item[key];
        });

        return acc;
      }, {});

      setCurrencyRates(rates);
    };
    fetchCurrencyRates();

    if (
      localStorage.getItem("currency") &&
      localStorage.getItem("currency") !== currency
    ) {
      setCurrency(localStorage.getItem("currency") as AllowedCurrenciesType);
    }
    if (
      localStorage.getItem("salaryType") &&
      localStorage.getItem("salaryType") !== salaryType
    ) {
      setSalaryType(localStorage.getItem("salaryType") as string);
    }
  }, [currency, salaryType]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        changeCurrency,
        formatCurrency,
        allowedCurrencies,
        changeSalaryType,
        salaryType,
        convertCurrency,
      }}
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
