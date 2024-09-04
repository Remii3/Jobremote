import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { client } from "@/lib/utils";
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
  const {
    data: avTechnologies,
    isLoading,
    error,
    isError,
  } = client.offers.getTechnologies.useQuery(
    ["technologies"],
    {},
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
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
      {isLoading && (
        <div className="flex p-2 items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      )}
      {isError && (
        <div className="flex p-2 items-center justify-center">
          <span className="text-xs text-slate-500">
            {error.status === 500 && error.body.msg}
          </span>
        </div>
      )}
    </>
  );
}
