"use client";

import OfferDetails from "./offerDetails/OfferDetails";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import Filters from "../filters/Filters";
import { findFocusableElements } from "@/lib/utils";
import OffersList from "./offersList/OffersList";
import { OfferFiltersType, OfferSortOptionsTypes } from "@/types/types";

const initialFilters: Required<OfferFiltersType> = {
  minSalary: 0,
  typeOfWork: [],
  experience: [],
  keyword: "",
  localization: [],
  technologies: [],
};

const Offers = () => {
  const [selectedOffer, setSelectedOffer] = useState<null | string>(null);
  const offerDetailsRef = useRef<HTMLElement | null>(null);
  const offersListRef = useRef<HTMLElement | null>(null);
  const lastOfferRef = useRef<HTMLElement | null>(null);
  const [sortOption, setSortOption] = useState<OfferSortOptionsTypes>("latest");
  const isMobile = useIsMobile();
  const [filters, setFilters] =
    useState<Required<OfferFiltersType>>(initialFilters);

  const updateFilters = useCallback(
    (key: keyof OfferFiltersType, value: any) => {
      setFilters((prevState) => {
        if (Array.isArray(prevState[key])) {
          if (prevState[key]?.includes(value)) {
            return {
              ...prevState,
              [key]: prevState[key].filter((item) => item !== value),
            };
          } else {
            return {
              ...prevState,
              [key]: [...prevState[key], value],
            };
          }
        } else {
          return {
            ...prevState,
            [key]: value,
          };
        }
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const changeCurrentOffer = (newId: string | null) => {
    setSelectedOffer(newId);
  };

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
    window.addEventListener("keyup", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="flex flex-col h-full">
      <section className="px-2 py-3 space-y-3">
        <Filters
          filters={filters}
          changeFilters={updateFilters}
          resetFilters={resetFilters}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </section>
      <div className="flex flex-grow overflow-hidden">
        <section
          className={`lg:w-1/2 w-full 
          overflow-y-auto px-2 pb-2 pt-1`}
          ref={offersListRef as React.RefObject<HTMLUListElement>}
        >
          <OffersList
            filters={filters}
            changeCurrentOffer={changeCurrentOffer}
            sortOption={sortOption}
          />
        </section>

        <section
          ref={offerDetailsRef}
          className={`w-1/2 
          overflow-y-auto px-2 lg:block hidden pt-1`}
        >
          {selectedOffer && (
            <OfferDetails
              isMobile={isMobile}
              selectedOffer={selectedOffer}
              changeCurrentOffer={changeCurrentOffer}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Offers;
