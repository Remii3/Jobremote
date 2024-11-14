"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { axiosInstance } from "@/lib/utils";
import { ClientModelFormSchema } from "@/schema/OfferSchema";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

type ModelFormPropsTypes = {
  form: UseFormReturn<z.infer<typeof ClientModelFormSchema>>;
  handleSubmit: () => void;
  isPendingCreateOffer: boolean;
  changeCurrentStep: (step: number) => void;
};

export default function ModelForm({
  form,
  handleSubmit,
  changeCurrentStep,
  isPendingCreateOffer,
}: ModelFormPropsTypes) {
  const {
    data: paymentTypes,
    isPending: isPendingPaymentTypes,
    error: errorPaymentTypes,
    isError: isErrorPaymentTypes,
  } = useQuery({
    queryKey: ["payment-types"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/offers/metadata/payments");
      return data;
    },
  });
  const { toast } = useToast();

  if (isErrorPaymentTypes) {
    if (isAxiosError(errorPaymentTypes)) {
      console.error(errorPaymentTypes.message);
      toast({
        title: "Error",
        description:
          "Unable to retrieve the available payment types. Please check your internet connection.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description:
          "An error occurred while fetching the payment types. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-8">
        Choose the model you wish to use
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="px-2 pb-4">
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Model</FormLabel>
                {!isPendingPaymentTypes && paymentTypes && (
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-8 px-4 lg:flex-row flex-col"
                    >
                      {paymentTypes.paymentTypes
                        .sort((a, b) => {
                          return a.price > b.price ? 1 : -1;
                        })
                        .map((option) => (
                          <FormItem
                            key={option.name}
                            className="relative basis-[33%]"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={option.code}
                                className="absolute top-2 left-2"
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">
                              <Card
                                className={`${
                                  field.value === option.code &&
                                  "ring-2 ring-ring ring-offset-2"
                                }`}
                              >
                                <CardHeader>
                                  <CardTitle className="text-center">
                                    {option.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-3 list-disc text-base pl-4 font-normal">
                                    {option.benefits.map((benefit, i) => {
                                      return <li key={i}>{benefit}</li>;
                                    })}
                                  </ul>
                                </CardContent>
                                <CardFooter>
                                  <div className="text-xl text-primary font-semibold">
                                    {option.price} USD
                                  </div>
                                </CardFooter>
                              </Card>
                            </FormLabel>
                          </FormItem>
                        ))}
                    </RadioGroup>
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormRootError />
          <div className="flex mt-8 gap-4 justify-end lg:justify-start">
            <Button
              onClick={() => changeCurrentStep(1)}
              size={"lg"}
              variant={"outline"}
            >
              Back to edit data
            </Button>
            <Button
              type="submit"
              disabled={isPendingCreateOffer || !form.getValues("pricing")}
              size={"lg"}
              isLoading={isPendingCreateOffer}
              showLoader
            >
              Pay for new offer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
