"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useResetPassword } from "./resetPassword.hooks";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { form, handleSubmit, isPending } = useResetPassword();
  const router = useRouter();

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-sm w-full space-y-2">
        <h2 className="text-3xl">Email reset</h2>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant={"default"}
                disabled={isPending}
                showLoader
                isLoading={isPending}
              >
                Reset password
              </Button>
              <Button
                type="button"
                variant={"link"}
                onClick={() => router.back()}
                aria-label="Go back to previous page"
              >
                Go back
              </Button>
            </div>
            <FormRootError />
          </form>
        </Form>
      </div>
    </div>
  );
}
