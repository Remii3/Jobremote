"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { client } from "@/lib/utils";
import { ClientModelFormSchema } from "@/app/hire-remotely/page";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

type ModelFormPropsTypes = {
  form: UseFormReturn<z.infer<typeof ClientModelFormSchema>>;
  handleSubmit: () => void;
  changeStepPrev: (step: number) => void;
};

export default function ModelForm({
  form,
  handleSubmit,
  changeStepPrev,
}: ModelFormPropsTypes) {
  const {
    data: paymentTypes,
    isPending,
    error,
  } = client.offers.getPaymentTypes.useQuery(["paymentTypes"]);
  return (
    <div>
      <Button onClick={() => changeStepPrev(1)}>Edit offer data</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    {paymentTypes?.body.paymentTypes.map((option) => (
                      <FormItem key={option.name} className="relative">
                        <FormControl>
                          <RadioGroupItem
                            value={option.code}
                            className="absolute top-2 left-2"
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          <Card
                            className={`${
                              field.value === option.name &&
                              "ring-2 ring-ring ring-offset-2"
                            }`}
                          >
                            <CardHeader>
                              <CardTitle>{option.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {option.description}
                              <div className="mt-4">{option.price} USD</div>
                            </CardContent>
                          </Card>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button
              type="submit"
              disabled={isPending || !form.getValues("pricing")}
            >
              Pay for new offer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
