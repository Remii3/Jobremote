"use client";

import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/types";
import { useSettings } from "./Settings.hooks";
import withAuth from "@/components/AuthGuard";

type SettingsType = {
  user: UserType;
  fetchUserData: () => void;
};

function DetailsPage({ fetchUserData, user }: SettingsType) {
  const { form, handleSubmit, isPending } = useSettings({
    fetchUserData,
    user,
  });
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
              <FormItem className="flex flex-row items-center justify-between rounded-md border p-4 w-full md:max-w-screen-sm">
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

export default withAuth(DetailsPage);
