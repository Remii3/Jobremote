"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import { Mail, MailOpen } from "lucide-react";
import Image from "next/image";
import { MouseEvent } from "react";

type OfferItemTypes = {
  changeCurrentOffer: (newData: OfferType) => void;
  offerData: OfferType;
  isApplied: boolean | null;
};

export default function OfferItem({
  changeCurrentOffer,
  offerData,
  isApplied,
}: OfferItemTypes) {
  const { formatCurrency } = useCurrency();
  const {
    _id,
    title,
    logo,
    localization,
    experience,
    contractType,
    employmentType,
    technologies,
    minSalary,
    maxSalary,
    currency,
    createdAt,
  } = offerData;
  function showOfferHandler(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    changeCurrentOffer(offerData);
  }
  const daysOld = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const isYoungerThan2Days = daysOld < 3;
  return (
    <li>
      <button
        type="button"
        onClick={(e) => showOfferHandler(e)}
        className="bg-background shadow p-3 hover:shadow-md transition-shadow rounded-md flex justify-between items-center gap-2 w-full border border-input"
      >
        {logo?.url ? (
          <div className="overflow-hidden flex-grow rounded-full min-h-16 max-h-16 min-w-16 max-w-16 bg-background border border-input">
            <Image
              src={logo.url}
              alt="Company logo"
              height={62}
              width={62}
              className="object-scale-down object-center aspect-auto h-[62px] w-[62px]"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-full bg-background border border-input min-h-16 min-w-16 max-w-16 max-h-16">
            <div className="h-16 w-16 bg-muted"></div>
          </div>
        )}
        <div className="flex flex-grow flex-col justify-between sm:gap-y-3 gap-y-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {isApplied !== null && (
                <>
                  {isApplied ? (
                    <MailOpen className="text-muted-foreground h-[18px] w-[18px]" />
                  ) : (
                    <Mail className="text-muted-foreground h-[18px] w-[18px]" />
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
            </div>
          </div>
          <div className="flex gap-2 justify-between flex-wrap">
            <div className="flex gap-2 flex-wrap justify-between items-center flex-grow">
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
              <div className="flex gap-2 flex-wrap">
                <Badge variant={"outline"}>{localization}</Badge>
                <Badge variant={"outline"}>{experience}</Badge>
                <Badge variant={"outline"} className="sm:inline-flex hidden">
                  {contractType}
                </Badge>
                <Badge variant={"outline"} className="sm:inline-flex hidden">
                  {employmentType}
                </Badge>
              </div>
            </div>
            <div className="flex justify-end items-start flex-wrap gap-2">
              <div className="hidden sm:flex gap-2">
                {technologies &&
                  technologies.slice(0, 2).map((technology) => (
                    <Badge key={technology} variant={"outline"}>
                      {technology}
                    </Badge>
                  ))}
              </div>
              {isYoungerThan2Days ? (
                <Badge variant={"outlinePrimary"}>New</Badge>
              ) : (
                <Badge variant={"secondary"}>{daysOld}d ago</Badge>
              )}
            </div>
          </div>
        </div>
      </button>
    </li>
  );
}
