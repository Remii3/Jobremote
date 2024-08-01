"use client";

import { Badge } from "@/components/ui/badge";
import usePriceFormatter from "@/hooks/usePriceFormatter";
import { OfferType } from "@/types/types";

type OfferItemTypes = Pick<
  OfferType,
  | "title"
  | "localization"
  | "experience"
  | "typeOfWork"
  | "_id"
  | "minSalary"
  | "maxSalary"
  | "currency"
  | "technologies"
> & {
  changeCurrentOffer: (newId: string) => void;
};

export default function OfferItem({
  experience,
  localization,
  title,
  typeOfWork,
  changeCurrentOffer,
  maxSalary,
  minSalary,
  currency,
  technologies,
  _id,
}: OfferItemTypes) {
  const { customFormatter } = usePriceFormatter();

  function showOfferHandler() {
    changeCurrentOffer(_id);
  }
  return (
    <li>
      <button
        type="button"
        onClick={showOfferHandler}
        className="shadow p-3 hover:shadow-md transition-shadow rounded flex justify-between items-center gap-2 w-full"
      >
        <div className="w-[80px]">Logo</div>
        <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-1">
          <h3 className="text-lg text-start col-start-1 col-end-2 row-start-1 row-end-2">
            {title}
          </h3>
          <div className="flex gap-2 col-start-1 col-end-3 md:col-end-2 row-start-2 row-end-3 flex-wrap">
            <Badge variant={"outline"}>{localization}</Badge>
            <Badge variant={"outline"}>{typeOfWork}</Badge>
            <Badge variant={"outline"}>{experience}</Badge>
          </div>
          <div className="col-start-2 col-end-3 text-end row-start-1 row-end-2">
            {minSalary === maxSalary ? (
              <span>{customFormatter(minSalary, currency)}</span>
            ) : (
              <div>
                <span>{customFormatter(minSalary, currency)}</span> -{" "}
                <span>{customFormatter(maxSalary, currency)}</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex justify-end col-start-2 col-end-3 row-start-2 row-end-3 gap-2">
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
      </button>
    </li>
  );
}
