import { useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { findFocusableElements } from "@/lib/utils";
import {
  OfferFiltersType,
  OfferSortOptionsTypes,
  OfferType,
} from "@/types/types";

const initialFilters: OfferFiltersType = {
  minSalary: 0,
  contractType: [],
  employmentType: [],
  experience: [],
  keyword: [],
  localization: [],
  technologies: [],
};

export function useHome() {
  const offerDetailsRef = useRef<HTMLElement | null>(null);
  const offersListRef = useRef<HTMLElement | null>(null);
  const lastOfferRef = useRef<HTMLElement | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<null | OfferType>(null);
  const [sortOption, setSortOption] = useState<OfferSortOptionsTypes>("latest");
  const [isSuccessApplied, setIsSuccessApplied] = useState<boolean>(false);
  const [filters, setFilters] =
    useState<Required<OfferFiltersType>>(initialFilters);
  const isMobile = useIsMobile();

  const updateFilters = useCallback(
    (key: keyof OfferFiltersType, value: any) => {
      setFilters((prevFilters) => {
        const currentValue = prevFilters[key];
        if (Array.isArray(currentValue)) {
          const updatedArray = currentValue.includes(value)
            ? currentValue.filter((item) => {
                return item !== value;
              })
            : [...currentValue, value];

          return { ...prevFilters, [key]: updatedArray };
        } else {
          return { ...prevFilters, [key]: value };
        }
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  function toggleSuccessApplied() {
    setIsSuccessApplied((prev) => !prev);
  }

  function changeCurrentOffer(newOfferData: OfferType | null) {
    setSelectedOffer(newOfferData);
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const activeElement = document.activeElement;
    const focusableElements = findFocusableElements(offerDetailsRef.current);
    const isChildOfOffersList = offersListRef.current?.contains(activeElement);
    const isChildOfOfferDetails =
      offerDetailsRef.current?.contains(activeElement);

    if (isChildOfOffersList && event.key === "ArrowRight") {
      if (offerDetailsRef.current) {
        lastOfferRef.current = activeElement as HTMLElement;
        focusableElements[0].focus();
        focusableElements.forEach((el) => el.setAttribute("tabindex", "0"));
        event.preventDefault();
      }
    } else if (isChildOfOfferDetails && event.key === "ArrowLeft") {
      if (lastOfferRef.current) {
        lastOfferRef.current.focus();

        focusableElements.forEach((el) => el.setAttribute("tabindex", "-1"));
        event.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => handleKeyDown(event);
    window.addEventListener("keyup", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [handleKeyDown]);

  return {
    sortOption,
    setSortOption,
    changeCurrentOffer,
    offerDetailsRef,
    offersListRef,
    selectedOffer,
    isMobile,
    toggleSuccessApplied,
    isSuccessApplied,
    resetFilters,
    filters,
    updateFilters,
  };
}
