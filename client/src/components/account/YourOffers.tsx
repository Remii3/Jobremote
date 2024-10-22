"use client";

import { client } from "@/lib/utils";
import { UserType } from "@/types/types";
import { ArrowLeft, SquarePen, Trash2, Wallet } from "lucide-react";
import React, { useMemo, useState } from "react";
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
import { useToast } from "../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type YourOffersProps = {
  user: UserType;
  fetchUserData: () => Promise<void>;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

export default function YourOffers({ user, fetchUserData }: YourOffersProps) {
  const [editOfferDataId, setEditOfferDataId] = useState<string | null>(null);
  const [selectedExtendOfferPricing, setSelectedExtendOfferPricing] = useState<
    string | null
  >(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: userOffers,
    isPending: isPendingUserOffers,
    error: userOffersError,
  } = client.users.getUserOffers.useQuery({
    queryKey: ["userOffersList"],
    queryData: {
      query: { _id: user._id, limit: "3", page: "1", sort: "createdAt" },
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const {
    mutate: extendOfferDuration,
    isPending: extendOfferDurationIsPending,
  } = client.offers.extendActiveOffer.useMutation({
    onSuccess: async (param) => {
      await fetchUserData();
      const stripe = await stripePromise;
      if (!stripe) return;
      const { error } = await stripe.redirectToCheckout({
        sessionId: param.body.sessionId,
      });
      if (error) {
        console.error("Stripe error:", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while redirecting to the payment.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error extending offer: ", error);
      toast({
        title: TOAST_TITLES.ERROR,
        description: "An error occurred while extending the offer.",
        variant: "destructive",
      });
    },
  });

  const { mutate: payForOffer, isPending: payForOfferIsPending } =
    client.offers.payForOffer.useMutation({
      onSuccess: async (param) => {
        await fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.body.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
          toast({
            title: TOAST_TITLES.ERROR,
            description: "An error occurred while redirecting to the payment.",
            variant: "destructive",
          });
        }
      },
      onError: (error) => {
        console.error("Error paying for offer: ", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while paying for the offer.",
          variant: "destructive",
        });
      },
    });

  const { mutate: handleDeleteOffer, isPending: deleteOfferIsPending } =
    client.offers.deleteOffer.useMutation({
      onSuccess: async () => {
        await fetchUserData();
        queryClient.invalidateQueries({ queryKey: ["offers-list"] });
        queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Offer deleted successfully.",
        });
      },
      onError: (error) => {
        console.error("Error deleting offer: ", error);
        toast({
          title: TOAST_TITLES.ERROR,
          description: "An error occurred while deleting the offer.",
          variant: "destructive",
        });
      },
    });

  const { data: paymentTypes } = client.offers.getPaymentTypes.useQuery({
    queryKey: ["payment-types"],
  });

  function handlerDeleteOffer(offerId: string) {
    handleDeleteOffer({ body: { _id: offerId } });
  }

  function handleChangeCurrentEditOffer(offerId: string | null) {
    setEditOfferDataId(offerId);
  }

  const handleExtendOfferDuration = async ({
    offerId,
    currency,
    pricing,
    title,
  }: {
    offerId: string;
    currency: string;
    pricing: string;
    title: string;
  }) => {
    extendOfferDuration({
      body: {
        offerId,
        currency,
        pricing,
        title,
      },
    });
  };

  const currentOffer = useMemo(
    () =>
      userOffers?.body.offers.find((offer) => offer._id === editOfferDataId),
    [editOfferDataId, userOffers]
  );

  if (userOffersError) {
    console.error("Error fetching user offers: ", userOffersError);
    toast({
      title: TOAST_TITLES.ERROR,
      description: "An error occurred while fetching your offers.",
      variant: "destructive",
    });
  }

  return (
    <>
      {editOfferDataId && currentOffer && (
        <>
          <div className="px-2 md:col-span-4">
            <div className="flex gap-4 items-center">
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => handleChangeCurrentEditOffer(null)}
                className={`rounded-full h-auto w-auto p-2`}
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Button>

              <h2 className="text-3xl font-semibold">{currentOffer.title}</h2>
            </div>
            <Separator className="my-2" />
          </div>

          <EditOffer
            offerData={currentOffer}
            handleChangeCurrentEditOffer={handleChangeCurrentEditOffer}
            queryClient={queryClient}
          />
        </>
      )}
      {!editOfferDataId && (
        <>
          <div className="md:col-span-4 px-2">
            <h2 className="text-3xl font-semibold">Your offers</h2>
            <span className="text-muted-foreground text-sm">
              Manage your offers
            </span>
            <Separator className="my-4" />
          </div>
          {!isPendingUserOffers && (
            <section className="md:col-span-4 md:col-start-2 px-2 overflow-y-auto">
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
                  {userOffers &&
                    userOffers.body.offers.map((offer) => (
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
                              handleChangeCurrentEditOffer(offer._id);
                            }}
                            variant={"outline"}
                            size={"icon"}
                          >
                            <SquarePen className="h-5 w-5" />
                          </Button>
                          {offer.isPaid ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant={"outline"} size={"icon"}>
                                  <Wallet className="h-5 w-5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Extend offer</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to extend this offer?
                                  </DialogDescription>
                                </DialogHeader>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (!selectedExtendOfferPricing) return;

                                    handleExtendOfferDuration({
                                      currency: offer.currency,
                                      offerId: offer._id,
                                      title: offer.title,
                                      pricing: selectedExtendOfferPricing,
                                    });
                                  }}
                                >
                                  <select
                                    name="pricing"
                                    onChange={(value) => {
                                      setSelectedExtendOfferPricing(
                                        value.target.value
                                      );
                                    }}
                                    defaultValue={""}
                                  >
                                    <option value={""} disabled>
                                      Select payment type
                                    </option>
                                    {paymentTypes &&
                                      paymentTypes.body.paymentTypes.map(
                                        (paymentType) => (
                                          <option
                                            key={paymentType.code}
                                            value={paymentType.code}
                                          >
                                            {paymentType.name}
                                          </option>
                                        )
                                      )}
                                  </select>
                                  <DialogFooter>
                                    <DialogClose>Cancel</DialogClose>
                                    <Button
                                      type="submit"
                                      disabled={
                                        !selectedExtendOfferPricing ||
                                        extendOfferDurationIsPending
                                      }
                                    >
                                      Extend
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Button
                              variant={"outline"}
                              size={"icon"}
                              disabled={payForOfferIsPending}
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
                          )}
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
                                  onClick={() => handlerDeleteOffer(offer._id)}
                                  disabled={deleteOfferIsPending}
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
              {userOffers && userOffers.body.offers.length === 0 && (
                <div className="h-full">
                  <div className="flex justify-center py-4">
                    <span className="text-muted-foreground">
                      No offers yet!
                    </span>
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </>
  );
}
