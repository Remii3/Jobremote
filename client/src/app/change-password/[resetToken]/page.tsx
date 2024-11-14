"use client";

import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useChangePassword } from "./changePassword.hooks";

interface ChangePasswordPageProps {
  params: { resetToken: string };
}

export default function ChangePasswordPage({
  params: { resetToken },
}: ChangePasswordPageProps) {
  const { form, handleSubmit, isPending } = useChangePassword({ resetToken });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  function toggleShowRepeatPassword() {
    setShowRepeatPassword((prev) => !prev);
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-sm w-full space-y-2">
        <h2 className="text-3xl">Password change</h2>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                        />
                        {!showPassword ? (
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute top-2 right-4"
                          >
                            <Eye className="h-6 w-6" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={toggleShowPassword}
                            className="absolute right-4 top-2 "
                          >
                            <EyeOff className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordRepeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat new password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showRepeatPassword ? "text" : "password"}
                        />
                        {!showRepeatPassword ? (
                          <button
                            type="button"
                            onClick={toggleShowRepeatPassword}
                            className="absolute top-2 right-4"
                          >
                            <Eye className="h-6 w-6" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={toggleShowRepeatPassword}
                            className="absolute right-4 top-2"
                          >
                            <EyeOff className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant={"default"}
                type="submit"
                size={"lg"}
                disabled={isPending}
                showLoader
                isLoading={isPending}
              >
                Change password
              </Button>
              <Link
                className={buttonVariants({ variant: "link" })}
                href={"/"}
                replace
              >
                Go back to homepage
              </Link>
            </div>
            <FormRootError />
          </form>
        </Form>
      </div>
    </div>
  );
}
