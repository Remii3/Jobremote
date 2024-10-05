import { client } from "@/lib/utils";
import { UserType } from "@/types/types";
import { SquarePen, Trash2, Wallet } from "lucide-react";
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
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { Badge } from "../ui/badge";
import { loadStripe } from "@stripe/stripe-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);
export default function YourOffers({
  user,
  fetchUserData,
}: {
  user: UserType;
  fetchUserData: () => void;
}) {
  const [editOfferDataId, setEditOfferDataId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = client.users.getUserOffers.useQuery(
    ["userOffersList"],
    {
      query: { _id: user._id, limit: "3", page: "1", sort: "createdAt" },
    },
    {
      queryKey: ["userOffersList"],
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchInterval: false,
    }
  );

  const { mutate: payForOffer, isPending } =
    client.offers.payForOffer.useMutation({
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.body.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
        }
        queryClient.invalidateQueries({ queryKey: ["offersList"] });
      },
    });

  const { mutate: deleteOffer } = client.offers.deleteOffer.useMutation({
    onSuccess: async () => {
      fetchUserData();
      queryClient.invalidateQueries({ queryKey: ["offersList"] });
      queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
    },
    onError: (error) => {
      console.error("Error deleting offer", error);
    },
  });

  function handleDeleteOffer(offerId: string) {
    deleteOffer({ body: { _id: offerId } });
  }

  function handleChangeCurrentEditOffer(offerId: string | null) {
    setEditOfferDataId(offerId);
  }

  return (
    <div>
      {editOfferDataId && (
        <EditOffer
          handleChangeCurrentEditOffer={handleChangeCurrentEditOffer}
          offerDataId={editOfferDataId}
        />
      )}
      {!editOfferDataId && (
        <div>
          <div>
            <h2 className="text-3xl font-semibold">Your offers</h2>
            <span className="text-muted-foreground text-sm">
              Manage your offers
            </span>
            <Separator className="my-4" />
          </div>
          {!isLoading && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[115px]">Title</TableHead>
                    <TableHead className="min-w-[115px] text-center">
                      Salary
                    </TableHead>
                    <TableHead className="min-w-[115px] text-center">
                      Created at
                    </TableHead>
                    <TableHead className="min-w-[115px] text-center">
                      Deadline
                    </TableHead>
                    <TableHead className="min-w-[115px] text-center">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[115px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.body.offers.map((offer) => (
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
                            <span className="text-muted-foreground">
                              Not paid
                            </span>
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
                          <Button
                            onClick={() => {
                              setEditOfferDataId(offer._id);
                            }}
                            variant={"outline"}
                            size={"icon"}
                          >
                            <SquarePen className="h-5 w-5" />
                          </Button>
                          <Button
                            variant={"outline"}
                            size={"icon"}
                            disabled={offer.isPaid || isPending}
                            onClick={() =>
                              payForOffer({
                                body: {
                                  offerId: offer._id,
                                  title: offer.title,
                                  currency: offer.currency,
                                  pricing: offer.pricing,
                                },
                              })
                            }
                          >
                            <Wallet className="h-5 w-5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant={"outline"} size={"icon"}>
                                <Trash2 className="text-destructive h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to delete this offer?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteOffer(offer._id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {data && data.body.offers.length === 0 && (
                <div className="flex justify-center py-4">
                  <span className="text-muted-foreground">No offers yet!</span>
                </div>
              )}
            </>
          )}{" "}
        </div>
      )}
    </div>
  );
}
