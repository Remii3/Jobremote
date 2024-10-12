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
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSettingsSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { UserType } from "@/types/types";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";

const UserSettingsSchema = UpdateUserSettingsSchema.omit({ _id: true });

type SettingsType = {
  user: UserType;
  fetchUserData: () => Promise<void>;
};

export default function Settings({ user, fetchUserData }: SettingsType) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof UserSettingsSchema>>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: { commercialConsent: user.commercialConsent },
  });

  const { mutate: updateSettings, isPending } =
    client.users.updateUserSettings.useMutation({
      onSuccess: async () => {
        await fetchUserData();
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Settings have been updated successfully.",
        });
      },
      onError: (error) => {
        if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        } else {
          console.log("error", error);
          form.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description: "An error occurred while updating settings.",
          });
        }
      },
    });

  function handleSubmit(values: z.infer<typeof UserSettingsSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);

    updateSettings({ body: { ...updatedFieldsValues, _id: user._id } });
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ commercialConsent: user.commercialConsent });
    }
  }, [user.commercialConsent, form]);

  return (
    <div className="px-2 md:col-span-4">
      <h2 className="text-3xl font-semibold">Settings</h2>
      <span className="text-muted-foreground text-sm">
        Manage your account settings
      </span>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
