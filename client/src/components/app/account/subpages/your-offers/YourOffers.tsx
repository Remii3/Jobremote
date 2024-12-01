import { AdminOfferType, OfferType, UserType } from "@/types/types";
import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import EditOffer from "../edit-offer/EditOffer";

import { Separator } from "../../../../ui/separator";
import { useQueryClient } from "@tanstack/react-query";

import { useYourOffers } from "./YourOffers.hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "./table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import OfferAction from "./OfferAction";
import { useCurrency } from "@/context/CurrencyContext";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  minSalary: number;
  maxSalary: number;
};
type YourOffersProps = {
  user: UserType;
  fetchUserData: () => void;
};

export default function YourOffers({ user, fetchUserData }: YourOffersProps) {
  const queryClient = useQueryClient();
  const { formatCurrency, currency, salaryType } = useCurrency();

  const {
    userOffersList,
    deleteOfferHandler,
    deleteOfferIsPending,
    extendOfferDurationHandler,
    payForOfferHandler,
    payForOfferIsPending,
    paymentList,
    userOffersIsPending,
  } = useYourOffers({
    user,
    fetchUserData,
    queryClient,
  });

  const [selectedOffer, setSelectedOfferId] = useState<OfferType | null>(null);

  function handleEditOfferChange(offerId: OfferType | null) {
    setSelectedOfferId(offerId);
  }

  const columns: ColumnDef<AdminOfferType>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "salary",
      header: () => <div className="text-right">Salary</div>,
      cell: ({ row }) => {
        const minSalary =
          salaryType === "yearly"
            ? row.original.minSalaryYear
            : row.original.minSalary;
        const maxSalary =
          salaryType === "yearly"
            ? row.original.maxSalaryYear
            : row.original.maxSalary;
        const formattedMin = formatCurrency(minSalary, currency);
        const formattedMax = formatCurrency(maxSalary, currency);
        return (
          <div className="text-right">
            {formattedMin} - {formattedMax}
          </div>
        );
      },
    },

    {
      accessorKey: "isPaid",
      header: ({ column }) => {
        return (
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Status
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const isPaid = row.getValue("isPaid");

        return isPaid ? "Paid" : "Not paid";
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="text-center space-x-3">
            <OfferAction
              offer={row.original}
              onEditChange={handleEditOfferChange}
              payForOfferHandler={payForOfferHandler}
              payForOfferIsPending={payForOfferIsPending}
              deleteOfferIsPending={deleteOfferIsPending}
              handlerDeleteOffer={deleteOfferHandler}
              paymentList={paymentList}
              extendOfferDurationHandler={extendOfferDurationHandler}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {selectedOffer && (
        <>
          <div className="px-2 md:col-span-4">
            <div className="flex gap-4 items-center">
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => handleEditOfferChange(null)}
                className={`rounded-full h-auto w-auto p-2`}
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Button>

              <h2 className="text-3xl font-semibold">{selectedOffer.title}</h2>
            </div>
            <Separator className="my-2" />
          </div>

          <EditOffer
            offerData={selectedOffer}
            handleChangeCurrentEditOffer={handleEditOfferChange}
            queryClient={queryClient}
          />
        </>
      )}
      {!selectedOffer && (
        <>
          <div className="md:col-span-4 px-2">
            <h2 className="text-3xl font-semibold">Your offers</h2>
            <span className="text-muted-foreground text-sm">
              Manage your offers
            </span>
            <Separator className="my-4" />
          </div>
          {userOffersIsPending && (
            <div className="md:col-span-4 md:col-start-2 px-2 space-y-4">
              <Skeleton className="w-full h-[70px] bg-muted/50" />
              <Skeleton className="w-full h-[70px] bg-muted/50" />
              <Skeleton className="w-full h-[70px] bg-muted/50" />
            </div>
          )}
          {userOffersList && paymentList && (
            <DataTable columns={columns} data={userOffersList.offers} />
          )}
        </>
      )}
    </>
  );
}
