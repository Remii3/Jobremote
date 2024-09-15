import React, { useEffect } from "react";
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
import { useUser } from "@/context/UserContext";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { client } from "@/lib/utils";
import { Loader2 } from "lucide-react";
const userSettingsSchema = z.object({
  commercialConsent: z.boolean().optional(),
});
export default function Settings() {
  const { user, fetchUserData } = useUser();
  const {
    mutate: updateSettings,
    isLoading,
    error,
  } = client.users.updateSetings.useMutation({
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
  const form = useForm<z.infer<typeof userSettingsSchema>>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: { commercialConsent: false },
  });

  useEffect(() => {
    if (user) {
      form.reset({ commercialConsent: user.commercialConsent || false });
    }
  }, [form, user]);
  function handleSubmit(values: z.infer<typeof userSettingsSchema>) {
    if (!user) return;
    updateSettings({ body: { ...values, userId: user._id } });
  }

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
              disabled={!form.formState.isDirty || isLoading}
              className="relative"
              aria-live="polite"
            >
              <Loader2
                className={`h-6 w-6 animate-spin absolute transition-opacity ${
                  isLoading ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={isLoading ? "false" : "true"}
              />
              <span
                className={`transition-opacity ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden={isLoading ? "true" : "false"}
              >
                Save changes
              </span>
            </Button>
            <FormRootError />
          </div>
        </form>
      </Form>
    </div>
  );
}
