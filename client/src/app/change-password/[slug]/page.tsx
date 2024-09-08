"use client";

import { client } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { ChangeUserPasswordSchemaRefined } from "@/schemas/userSchemas";

interface ChangePasswordPageProps {
  params: { slug: string };
}

export default function ChangePasswordPage({
  params: { slug: resetToken },
}: ChangePasswordPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const { mutate, isLoading, isError, error } =
    client.users.changePassword.useMutation({
      onSuccess: () => router.push("/login"),
    });
  const router = useRouter();
  const form = useForm<z.infer<typeof ChangeUserPasswordSchemaRefined>>({
    resolver: zodResolver(ChangeUserPasswordSchemaRefined),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });
  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function toggleShowRepeatPassword() {
    setShowRepeatPassword((prev) => !prev);
  }
  function handleSubmit(data: z.infer<typeof ChangeUserPasswordSchemaRefined>) {
    if (!resetToken) {
      form.setError("root", {
        type: "manual",
        message: "Reset token is invalid or has expired.",
      });
      return;
    }
    mutate({
      body: {
        password: data.password,
        passwordRepeat: data.password,
        resetToken,
      },
    });
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
                    <FormLabel>Password</FormLabel>
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
                    <FormLabel>Repeat password</FormLabel>
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Change password"
                )}
              </Button>
              <Button
                variant={"link"}
                type="button"
                onClick={() => router.back()}
              >
                Go back
              </Button>
            </div>
            {isError && (error.status === 400 || error.status === 500) && (
              <p className="text-sm font-medium text-destructive">
                {error.body.msg}
              </p>
            )}
            <FormRootError />
          </form>
        </Form>
      </div>
    </div>
  );
}
