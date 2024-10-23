"use client";

import { Separator } from "../../ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { UserType } from "@/types/types";
import { useToast } from "../../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { useEffect } from "react";
import { isFetchError } from "@ts-rest/react-query/v5";

const UserDataSchema = UpdateUserSchema.omit({ _id: true });

type DetailsType = {
  user: UserType;
  fetchUserData: () => void;
};

export default function Details({ user, fetchUserData }: DetailsType) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof UserDataSchema>>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      name: user.name,
      description: user.description,
    },
  });

  const { mutate: updateUser, isPending } = client.users.updateUser.useMutation(
    {
      onSuccess: () => {
        fetchUserData();
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Account details have been updated successfully.",
        });
      },
      onError: (error) => {
        if (isFetchError(error)) {
          toast({
            title: TOAST_TITLES.ERROR,
            description:
              "Failed to change the password. Please check your internet connection.",
            variant: "destructive",
          });
        } else if (error.status == 404 || error.status == 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description: error.body.msg,
            variant: "destructive",
          });
        } else {
          console.error("error", error);
          form.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description:
              "An error occurred while updating the account details.",
            variant: "destructive",
          });
        }
      },
    }
  );

  function handleSubmit(values: z.infer<typeof UserDataSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    updateUser({ body: { ...updatedFieldsValues, _id: user._id } });
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ name: user.name, description: user.description });
    }
  }, [form, user.name, user.description]);

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
