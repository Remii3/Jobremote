"use client";

import { Separator } from "../../../../ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../../../../ui/form";
import { Input } from "../../../../ui/input";
import { UserType } from "@/types/types";
import { Button } from "../../../../ui/button";
import { Textarea } from "../../../../ui/textarea";
import { useDetails } from "./Details.hooks";

type DetailsType = {
  user: UserType;
  fetchUserData: () => void;
};

export default function Details({ user, fetchUserData }: DetailsType) {
  const { form, handleSubmit, isPending } = useDetails({ user, fetchUserData });
  return (
    <div className="px-2 md:col-span-4">
      <h2 className="text-3xl font-semibold">Account details</h2>
      <span className="text-muted-foreground text-sm">
        Here you can change or add your personal information that are going to
        be used to fill application forms.
      </span>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First and last name:</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your introduction:</FormLabel>
                <Textarea {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isPending}
              showLoader
              isLoading={isPending}
            >
              Save changes
            </Button>
          </div>
          <FormRootError />
        </form>
      </Form>
    </div>
  );
}
