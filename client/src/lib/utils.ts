import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
