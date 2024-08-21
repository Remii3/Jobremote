import { useUser } from "@/context/UserContext";
import useAddNewOffer from "@/hooks/useAddNewOffer";
import { client } from "@/lib/utils";
import { OfferType } from "@/types/types";
import { ArrowLeft, ArrowLeftCircle, SquarePen, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import EditOffer from "./EditOffer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Separator } from "../ui/separator";

export default function YourOffers() {
  const { user, fetchUserData } = useUser();
  const [editOfferData, setEditOfferData] = useState<OfferType | null>(null);

  if (!user) return null;
  const { data, isLoading } = client.offers.getUserOffers.useQuery(
    ["clientOffers", user.createdOffers],
    {
      query: { ids: user.createdOffers },
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchOnMount: false,
    }
  );
  const { mutate } = client.offers.deleteOffer.useMutation({
    onSuccess: async () => {
      fetchUserData();
    },
  });

  function handleDeleteOffer(offerId: string) {
    mutate({ body: { offerId } });
  }

  return (
    <div>
      {editOfferData && (
        <EditOffer
          setEditOfferData={setEditOfferData}
          offerData={editOfferData}
        />
      )}
      {!editOfferData && (
        <div>
          <div>
            <h2 className="text-3xl font-semibold">Your offers</h2>
            <Separator className="my-2" />
          </div>
          {!isLoading && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-40">Title</TableHead>
                    <TableHead className="min-w-[115px]">Min salary</TableHead>
                    <TableHead className="min-w-[115px]">Created at</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.body.offers.map((offer) => (
                    <TableRow key={offer._id}>
                      <TableCell>{offer.title}</TableCell>
                      <TableCell>
                        <span>{offer.minSalary}</span>
                      </TableCell>
                      <TableCell>{offer.createdAt.slice(0, 10)}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditOfferData(offer);
                          }}
                          variant={"outline"}
                          size={"icon"}
                        >
                          <SquarePen className="h-5 w-5" />
                        </Button>
                        <Button
                          variant={"outline"}
                          size={"icon"}
                          onClick={() => handleDeleteOffer(offer._id)}
                        >
                          <Trash2 className="text-red-400 h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data && data.body.offers.length === 0 && (
                <div className="flex justify-center py-4">
                  <span>No offers yet!</span>
                </div>
              )}
            </>
          )}{" "}
        </div>
      )}
    </div>
  );
}
