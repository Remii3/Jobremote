import { useUser } from "@/context/UserContext";
import { cleanEmptyData, client } from "@/lib/utils";
import { OfferType } from "@/types/types";
import { SquarePen, Trash2 } from "lucide-react";
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
import { formSchemaTypes } from "@/hooks/useEditOffer";
import { z } from "zod";
import { useQueryClient } from "@ts-rest/react-query/tanstack";

export default function YourOffers() {
  const { user, fetchUserData } = useUser();
  const [editOfferData, setEditOfferData] = useState<OfferType | null>(null);
  const queryClient = useQueryClient();

  if (!user) return null;

  const { data, isLoading, refetch } = client.offers.getUserOffers.useQuery(
    ["clientOffers", user.createdOffers],
    {
      query: { ids: user.createdOffers },
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const { mutate: updateOffer } = client.offers.updateOffer.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(["clientOffers"]);
      setEditOfferData(null);
      queryClient.invalidateQueries(["offersList"]);
    },
  });

  const { mutate: deleteOffer } = client.offers.deleteOffer.useMutation({
    onSuccess: async () => {
      fetchUserData();
    },
  });

  function handleDeleteOffer(offerId: string) {
    deleteOffer({ body: { offerId } });
  }

  function handleUpdateOffer(values: z.infer<typeof formSchemaTypes>) {
    if (!editOfferData) return;
    const cleanValues = cleanEmptyData(values);

    updateOffer({
      body: {
        ...cleanValues,
        offerId: editOfferData._id,
      },
    });
  }

  return (
    <div>
      {editOfferData && (
        <EditOffer
          setEditOfferData={setEditOfferData}
          offerData={editOfferData}
          handleUpdateOffer={handleUpdateOffer}
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
