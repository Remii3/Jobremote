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
import { client } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const emailResetSchema = z.object({ email: z.string().email() });

export default function ResetPasswordPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof emailResetSchema>>({
    resolver: zodResolver(emailResetSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = client.users.resetPassword.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      if (error.status === 404) {
        form.setError("email", {
          type: "manual",
          message: error.body.msg,
        });
      } else if (error.status === 500) {
        form.setError("root", {
          type: "manual",
          message: error.body.msg,
        });
      }
    },
  });

  function handleSubmit(data: z.infer<typeof emailResetSchema>) {
    mutate({ body: data });
  }

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
