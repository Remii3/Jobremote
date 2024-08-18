import { initQueryClient } from "@ts-rest/react-query";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mainContract } from "../../../server/src/contracts/_app";

interface ClientErrorType {
  status: number;
  body: string | unknown;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showError(err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
}

export const client = initQueryClient(mainContract, {
  baseUrl: "http://localhost:5000",
  baseHeaders: {},
  credentials: "include",
});

export const cleanEmptyData = (data: Record<string, any>) => {
  const cleanedData: Record<string, any> = {};

  for (let i = 0; i < Object.keys(data).length; i++) {
    const key = Object.keys(data)[i];
    if (
      (typeof data[key] === "string" && data[key].trim() !== "") ||
      (Array.isArray(data[key]) && data[key].length > 0) ||
      typeof data[key] === "number"
    ) {
      cleanedData[key] = data[key];
    }
  }
  return cleanedData;
};

export const findFocusableElements = (container: HTMLElement | null) => {
  if (!container) return [];

  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
    "#offerContent",
  ];

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors.join(", "))
  );
};

export function checkIsFilterChanged(filter: any) {
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      const value = filter[key];

      // Check based on expected default values
      if (Array.isArray(value) && value.length > 0) {
        return true; // Array is not empty, so filter is changed
      }
      if (typeof value === "string" && value !== "") {
        return true; // String is not empty, so filter is changed
      }
      if (typeof value === "number" && value !== 0) {
        return true; // Number is not 0, so filter is changed
      }
    }
  }
  return false; // No changes detected
}
