import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import axios from 'axios'
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { mainContract } from "jobremotecontracts";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const client = initTsrReactQuery(mainContract, {
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI || "",
  baseHeaders: {},
  credentials: "include",
});

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI || "",
  withCredentials: true,
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

export function getOnlyDirtyFormFields<T extends z.ZodTypeAny>(
  values: z.infer<T>,
  form: any
) {
  const dirtyFields = Object.keys(form.formState.dirtyFields);
  return dirtyFields.reduce((acc, key) => {
    if (key in values && values[key as keyof typeof values] !== undefined) {
      acc[key as keyof typeof values] = values[key as keyof typeof values];
    }
    return acc;
  }, {} as Partial<z.infer<T>>);
}
