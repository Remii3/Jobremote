import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminOfferType, OfferType, UserType } from "@/types/types";
import React from "react";
import OfferAction from "./OfferAction";

type OfferstableProps = {
  userOffers: AdminOfferType[];
  onEditChange: (offerId: OfferType | null) => void;
  deleteOfferHandler: (offerId: string) => void;
  deleteOfferIsPending: boolean;
  extendOfferDurationHandler: ({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) => Promise<void>;
  payForOfferHandler: ({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) => Promise<void>;
  payForOfferIsPending: boolean;
  paymentList: {
    code: string;
    name: string;
    price: number;
    benefits: string[];
    activeMonths: number;
  }[];
};

export default function OffersTable({
  onEditChange,
  userOffers,
  deleteOfferHandler,
  deleteOfferIsPending,
  extendOfferDurationHandler,
  payForOfferHandler,
  payForOfferIsPending,
  paymentList,
}: OfferstableProps) {
  return (
    <section className="md:col-span-4 md:col-start-2 px-2 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[115px]">Title</TableHead>
            <TableHead className="min-w-[115px] text-center">Salary</TableHead>
            <TableHead className="min-w-[115px] text-center">
              Created at
            </TableHead>
            <TableHead className="min-w-[115px] text-center">
              Deadline
            </TableHead>
            <TableHead className="min-w-[115px] text-center">Status</TableHead>
            <TableHead className="min-w-[115px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userOffers &&
            userOffers.map((offer) => (
              <TableRow key={offer._id}>
                <TableCell className="min-w-[260px] max-w-[260px]">
                  <span className="line-clamp-2">{offer.title}</span>
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  <span>{offer.minSalary}</span> -{" "}
                  <span>{offer.maxSalary}</span>
                </TableCell>

                <TableCell className="text-center">
                  {offer.createdAt.slice(0, 10)}
                </TableCell>
                <TableCell className="text-center">
                  {offer.activeUntil ? (
                    offer.activeUntil.slice(0, 10)
                  ) : (
                    <span className="text-muted-foreground">Not paid</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {offer.isPaid ? (
                    <Badge>Paid</Badge>
                  ) : (
                    <Badge variant={"outline"}>Not paid</Badge>
                  )}
                </TableCell>
                <TableCell className="flex gap-2 justify-center">
                  <OfferAction
                    offer={offer}
                    onEditChange={onEditChange}
                    payForOfferHandler={payForOfferHandler}
                    payForOfferIsPending={payForOfferIsPending}
                    deleteOfferIsPending={deleteOfferIsPending}
                    handlerDeleteOffer={deleteOfferHandler}
                    paymentList={paymentList}
                    extendOfferDurationHandler={extendOfferDurationHandler}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {userOffers.length === 0 && (
        <p className="h-full flex justify-center py-4 text-muted-foreground">
          No offers yet!
        </p>
      )}
    </section>
  );
}
