import { client } from "@/lib/utils";
import { UserType } from "@/types/types";
import { ArrowLeft, Loader2, SquarePen, Trash2, Wallet } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { getOnlyDirtyFormFields } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

const editOfferSchema = UpdateOfferSchema.omit({ _id: true }).extend({
  logo: z.array(z.instanceof(File)).optional().nullable(),
  technologies: z.array(z.string()).optional(),
});

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

  const {
    data: offerData,
    isPending: userOfferIsLoading,
    refetch: refetchOfferData,
  } = client.users.getUserOffer.useQuery(
    ["userOffer"],
    { query: { _id: editOfferDataId || "" } },
    {
      queryKey: ["userOffer"],
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!editOfferDataId,
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

  const form = useForm<z.infer<typeof editOfferSchema>>({
    resolver: zodResolver(editOfferSchema),
    defaultValues: {
      title: "",
      content: "",
      experience: "",
      employmentType: "",
      companyName: "",
      contractType: "",
      localization: "",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
      technologies: [],
      logo: [],
    },
  });

  const { mutate: updateOffer, isPending: updateOfferIsLoading } =
    client.offers.updateOffer.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
        resetOfferData();
        queryClient.invalidateQueries({ queryKey: ["offersList"] });
      },
      onError: (error) => {
        if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        }
      },
    });

  function resetOfferData() {
    handleChangeCurrentEditOffer(null);
    form.reset({
      title: "",
      content: "",
      experience: "",
      employmentType: "",
      companyName: "",
      contractType: "",
      localization: "",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
      technologies: [],
      logo: [],
    });
  }

  function handleSubmit(values: z.infer<typeof editOfferSchema>) {
    if (!offerData) return;
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);

    const formData = new FormData();
    Object.entries(updatedFieldsValues).forEach(([key, value]) => {
      if (key === "logo" && value) {
        if (Array.isArray(value) && value.length > 0) {
          formData.append("logo", value[0]);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("_id", offerData.body.offer._id);
    updateOffer({ body: formData });
  }

  function handleTechnologies(technology: string) {
    const currentTechnologies = form.getValues("technologies") || [];
    const updatedTechnologies = currentTechnologies.includes(technology)
      ? currentTechnologies.filter((tech) => tech !== technology)
      : [...currentTechnologies, technology];

    form.setValue("technologies", updatedTechnologies);
  }

  useEffect(() => {
    if (offerData) {
      form.reset({
        // title: offerData.body.offer.title,
        // content: offerData.body.offer.content,
        // experience: offerData.body.offer.experience,
        // employmentType: offerData.body.offer.employmentType,
        // companyName: offerData.body.offer.companyName,
        // contractType: offerData.body.offer.contractType,
        // localization: offerData.body.offer.localization,
        // minSalary: offerData.body.offer.minSalary,
        // maxSalary: offerData.body.offer.maxSalary,
        // currency: offerData.body.offer.currency,
        // technologies: offerData.body.offer.technologies,
        logo: [],
      });
    }
  }, [form, offerData]);

  useEffect(() => {
    if (editOfferDataId) {
      refetchOfferData();
    }
  }, [editOfferDataId, refetchOfferData]);

  console.log(form.getValues());
  return (
    <div>
      {editOfferDataId && (
        <div>
          <div>
            <div className="flex gap-4 items-center">
              <Button
                variant={"outline"}
                size={"icon"}
                type="button"
                onClick={() => {
                  resetOfferData();
                }}
                className={`rounded-full h-auto w-auto p-2`}
              >
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Button>
              {offerData ? (
                <h2 className="text-3xl font-semibold">
                  {offerData.body.offer.title}
                </h2>
              ) : (
                <Skeleton className="w-1/2" />
              )}
            </div>
            <Separator className="my-2" />
          </div>
          {offerData ? (
            <EditOffer
              offerData={offerData}
              form={form}
              handleSubmit={handleSubmit}
              handleTechnologies={handleTechnologies}
              resetOfferData={resetOfferData}
              updateOfferIsLoading={updateOfferIsLoading}
            />
          ) : (
            <div>
              <Loader2 />
            </div>
          )}
        </div>
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
