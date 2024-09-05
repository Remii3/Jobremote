import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import { OfferFiltersType } from "@/types/types";
import { Loader2 } from "lucide-react";
import React from "react";

interface TechnologiesProps {
  technologies: string[];
  changeTextsHandler: (key: keyof OfferFiltersType, value: string) => void;
}

export default function Technologies({
  technologies,
  changeTextsHandler,
}: TechnologiesProps) {
  const { avTechnologies, avTechnologiesError, avTechnologiesIsLoading } =
    useGetAvailableTechnologies();
  return (
    <>
      {avTechnologies &&
        avTechnologies.body.technologies.length > 0 &&
        avTechnologies.body.technologies.map((technology) => {
          return (
            <DropdownMenuCheckboxItem
              key={technology._id}
              checked={technologies.includes(technology.name)}
              onCheckedChange={() =>
                changeTextsHandler("technologies", technology.name)
              }
              preventCloseOnSelect
            >
              {technology.name}
            </DropdownMenuCheckboxItem>
          );
        })}
      {avTechnologies && avTechnologies.body.technologies.length <= 0 && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">No technologies</span>
        </div>
      )}
      {avTechnologiesIsLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {avTechnologiesError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {avTechnologiesError.status === 500 && avTechnologiesError.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
