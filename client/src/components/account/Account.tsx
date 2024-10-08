"use client";

import { Separator } from "../ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { UserType } from "@/types/types";
import { useEffect } from "react";

const UserDataSchema = UpdateUserSchema.omit({ _id: true });

type AccountType = {
  user: UserType;
  fetchUserData: () => void;
};

export default function Account({ user, fetchUserData }: AccountType) {
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
      },
      onError: (error) => {
        if (error.status == 404 || error.status == 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        }
      },
    }
  );

  function handleSubmit(values: z.infer<typeof UserDataSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    updateUser({ body: { ...updatedFieldsValues, _id: user._id } });
  }

  // Update the defaults of the form when the user changes
  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ name: user.name, description: user.description });
    }
  }, [user, form]);

  return (
    <div>
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
                <Input
                  {...field}
                  onChange={(data) => {
                    field.onChange(data);
                  }}
                />
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
              className="mt-2"
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
