"use client";

import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import { MouseEvent } from "react";

type OfferItemTypes = Pick<
  OfferType,
  | "title"
  | "localization"
  | "experience"
  | "_id"
  | "minSalary"
  | "maxSalary"
  | "currency"
  | "technologies"
> & {
  changeCurrentOffer: (
    newId: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
};

export default function OfferItem({
  experience,
  localization,
  title,
  changeCurrentOffer,
  maxSalary,
  minSalary,
  currency,
  technologies,
  _id,
}: OfferItemTypes) {
  const { formatCurrency } = useCurrency();

  function showOfferHandler(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    changeCurrentOffer(_id, e);
  }
  console.log(localization);
  return (
    <li>
      <button
        type="button"
        onClick={(e) => showOfferHandler(e)}
        className="shadow p-3 hover:shadow-md transition-shadow rounded flex justify-between items-center gap-2 w-full"
      >
        <div className="w-[80px]">Logo</div>
        <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
          <h3 className="text-lg text-start col-start-1 col-end-2 row-start-1 row-end-2">
            {title}
          </h3>
          <div className="col-start-2 col-end-3 text-end row-start-1 row-end-2 font-medium text-green-500">
            {minSalary === maxSalary ? (
              <span>{formatCurrency(minSalary, currency)}</span>
            ) : (
              <div>
                <span>{formatCurrency(minSalary, currency)}</span> -{" "}
                <span>{formatCurrency(maxSalary, currency)}</span>
              </div>
            )}
          </div>
          <div className="col-start-1 col-span-2 row-start-2 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <div className="flex gap-2 flex-wrap items-start">
              <Badge variant={"outline"}>{localization}</Badge>
              <Badge variant={"outline"}>{experience}</Badge>
            </div>
            <div className="flex sm:justify-end items-start flex-wrap gap-2">
              {technologies &&
                technologies.slice(0, 2).map((technology) => (
                  <Badge key={technology} variant={"outline"}>
                    {technology}
                  </Badge>
                ))}
              {technologies && technologies.length > 2 && (
                <Badge variant={"outline"}>...</Badge>
              )}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
