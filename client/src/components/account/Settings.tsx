"use client";

import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { client } from "@/lib/utils";
import { UpdateUserSettingsSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { UserType } from "@/types/types";
import { useEffect } from "react";

const UserSettingsSchema = UpdateUserSettingsSchema.omit({ _id: true });

type SettingsType = {
  user: UserType;
  fetchUserData: () => void;
};

export default function Settings({ user, fetchUserData }: SettingsType) {
  const { mutate: updateSettings, isPending } =
    client.users.updateUserSettings.useMutation({
      onSuccess: () => fetchUserData(),
      onError: (error) => {
        if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        }
      },
    });

  const form = useForm<z.infer<typeof UserSettingsSchema>>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: { commercialConsent: user.commercialConsent },
  });

  function handleSubmit(values: z.infer<typeof UserSettingsSchema>) {
    updateSettings({ body: { ...values, _id: user._id } });
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ commercialConsent: user.commercialConsent });
    }
  }, [user, form]);

  return (
    <div>
      <h2 className="text-3xl font-semibold">Settings</h2>
      <span className="text-muted-foreground text-sm">
        Manage your account settings
      </span>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="commercialConsent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4 max-w-screen-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Commercial consent
                  </FormLabel>
                  <FormDescription>
                    Receive commercial offers from our partners
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-6">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isPending}
              showLoader
              isLoading={isPending}
            >
              Save changes
            </Button>
            <FormRootError />
          </div>
        </form>
      </Form>
    </div>
  );
}
