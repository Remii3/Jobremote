import { AllowedCurrenciesType, AllowedSalaryTypes } from "@/types/types";

export const allowedCurrencies = ["USD", "EUR"] as AllowedCurrenciesType[];
export const CONSTANT_SALARY_TYPE = [
  "yearly",
  "monthly",
] as AllowedSalaryTypes[];

export const TOAST_TITLES = {
  SUCCESS: "Success",
  ERROR: "Error",
  WARNING: "Warning",
  INFO: "Info",
};

export const ERROR_MESSAGES = {
  GENERIC_ERROR: "Unexpected error occurred. Please try again later.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  NETWORK_ERROR: "Network error occurred. Please check your connection.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  FORBIDDEN: "You are not allowed to access this resource.",
};
