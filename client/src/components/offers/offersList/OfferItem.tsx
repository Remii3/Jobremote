"use client";

import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import { House, Mail, MailOpen, MapPin, Pin } from "lucide-react";
import Image from "next/image";

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
    companyName,
  } = offerData;
  function showOfferHandler() {
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
        onClick={showOfferHandler}
        className="bg-background relative shadow p-3 hover:shadow-md transition-[box-shadow] rounded-md grid grid-rows-2 sm:grid-rows-1 gap-x-2 gap-y-1 w-full border border-input"
        style={{
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto auto",
        }}
      >
        <div className="col-start-1 row-start-1 row-span-1 relative w-full h-full">
          {logo?.url ? (
            <div className="rounded-full bg-background border border-input relative w-[64px] h-[64px] overflow-hidden">
              <Image
                src={logo.url}
                alt="Company logo"
                fill
                className="object-scale-down object-center aspect-auto w-full h-full"
              />
            </div>
          ) : (
            <div className="overflow-hidden rounded-full bg-background border border-input w-[64px] h-[64px]">
              <div className="h-full w-full bg-muted"></div>
            </div>
          )}
        </div>
        <div
          className="col-start-2 row-start-1 grid gap-2 grid-rows-2"
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <div className="flex items-center gap-1 col-start-1 col-span-1">
            {isApplied !== null && (
              <>
                {isApplied ? (
                  <MailOpen className="text-muted-foreground h-[18px] w-[18px]" />
                ) : (
                  <Mail className="text-muted-foreground h-[18px] w-[18px]" />
                )}
              </>
            )}
            <h3 className="text-lg text-start line-clamp-1">{title}</h3>
          </div>
          <div className="flex gap-2 col-start-2 col-span-1 justify-end items-center">
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
          <div className="flex justify-between items-center col-span-2">
            <div className="hidden sm:flex col-start-1 row-start-2 overflow-hidden">
              <div className="flex gap-2 items-start">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{localization}</span>
                </div>
                <div className="flex items-center gap-1">
                  <House className="h-4 w-4" />
                  <span className="text-sm">{companyName}</span>
                </div>
              </div>
            </div>
            <span className="text-start font-medium text-green-500 inline sm:hidden col-start-1 row-start-2">
              {minSalary === maxSalary ? (
                <span>{formatCurrency(minSalary, currency)}</span>
              ) : (
                <span>
                  <span>{formatCurrency(minSalary, currency)}</span> -{" "}
                  <span>{formatCurrency(maxSalary, currency)}</span>
                </span>
              )}
            </span>
            <div className="col-start-2 row-start-2 flex whitespace-nowrap flex-nowrap justify-end items-end gap-2 ">
              <div className="hidden sm:flex gap-2 ">
                {technologies &&
                  technologies.slice(0, 2).map((technology) => (
                    <Badge key={technology} variant={"outline"}>
                      {technology}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-start-1 col-span-2 row-start-3 flex gap-2 sm:hidden">
          <div className="flex gap-2 flex-wrap">
            <Badge className="text-xs" variant={"outline"}>
              {localization}
            </Badge>
            <Badge variant={"outline"} className="text-xs">
              {experience}
            </Badge>
            <Badge variant={"outline"} className="sm:inline-flex hidden">
              {contractType}
            </Badge>
            <Badge variant={"outline"} className="sm:inline-flex hidden">
              {employmentType}
            </Badge>
          </div>
        </div>
        {isYoungerThan2Days ? (
          <Badge
            variant={"outlinePrimary"}
            className="absolute -top-2.5 -right-2.5"
          >
            New
          </Badge>
        ) : (
          <Badge
            variant={"outline"}
            className="absolute bg-background -top-2.5 -right-2.5"
          >
            {daysOld}d ago
          </Badge>
        )}
      </button>
    </li>
  );
}
