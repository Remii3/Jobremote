"use client";

import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import { Mail, MailOpen } from "lucide-react";
import Image from "next/image";
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
  | "logo"
  | "createdAt"
> & {
  changeCurrentOffer: (
    newId: string,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => void;
  isApplied: boolean | null;
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
  logo,
  createdAt,
  isApplied,
}: OfferItemTypes) {
  const { formatCurrency } = useCurrency();
  function showOfferHandler(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    changeCurrentOffer(_id, e);
  }
  const isYoungerThan2Days =
    new Date(createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  return (
    <li>
      <button
        type="button"
        onClick={(e) => showOfferHandler(e)}
        className="bg-background shadow p-3 hover:shadow-md transition-shadow rounded-md flex justify-between items-center gap-2 w-full border border-input"
      >
        {logo && (
          <div className="overflow-hidden rounded-full bg-background border border-input">
            <Image
              src={logo}
              alt="Company logo"
              height={64}
              width={64}
              className="object-scale-down object-center h-16 w-16"
            />
          </div>
        )}
        <div className="flex flex-grow flex-col justify-between sm:gap-y-3 gap-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {isApplied !== null && (
                <>
                  {isApplied ? (
                    <MailOpen className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <Mail className="text-muted-foreground h-5 w-5" />
                  )}
                </>
              )}
              <h3 className="text-lg text-start">{title}</h3>
            </div>
            <div className="flex gap-2">
              <span className="text-end font-medium text-green-500 hidden sm:inline">
                {minSalary === maxSalary ? (
                  <span>{formatCurrency(minSalary, currency)}</span>
                ) : (
                  <span>
                    <span>{formatCurrency(minSalary, currency)}</span> -{" "}
                    <span>{formatCurrency(maxSalary, currency)}</span>
                  </span>
                )}
              </span>
              {isYoungerThan2Days && (
                <Badge variant={"outlinePrimary"}>New</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 sm:justify-between">
            <div className="flex gap-2 flex-wrap items-center justify-start">
              <span className="flex sm:hidden text-xs sm:text-sm text-green-500 font-medium">
                {minSalary === maxSalary ? (
                  <span>{formatCurrency(minSalary, currency)}</span>
                ) : (
                  <div>
                    <span>{formatCurrency(minSalary, currency)}</span> -{" "}
                    <span>{formatCurrency(maxSalary, currency)}</span>
                  </div>
                )}
              </span>
              <Badge variant={"outline"} className="">
                {localization}
              </Badge>
              <Badge variant={"outline"}>{experience}</Badge>
            </div>
            <div className="sm:flex sm:justify-end sm:items-start sm:flex-wrap sm:gap-2 hidden">
              {technologies &&
                technologies.slice(0, 2).map((technology) => (
                  <Badge key={technology} variant={"outline"}>
                    {technology}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
