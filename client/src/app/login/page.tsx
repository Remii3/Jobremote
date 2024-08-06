"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginUserSchema } from "../../../../server/src/schemas/userSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isLoading } = client.users.loginUser.useMutation({
    onSuccess: () => {
      fetchUserData();
      router.push("/");
    },
    onError: (error) => {
      switch (error.status) {
        case 401:
        case 403:
        case 404: {
          return form.setError(error.body.field, {
            type: "manual",
            message: error.body.msg,
          });
        }
        case 500: {
          return form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        }
      }
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const { fetchUserData } = useUser();

  const form = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function submitHandler(data: z.infer<typeof LoginUserSchema>) {
    login({ body: data });
  }
  return (
    <div className="flex items-center justify-center h-full ">
      <div className="max-w-xs w-full space-y-2">
        <h2 className="text-3xl">Sign in</h2>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            <div className="space-y-2">
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
                  "Sign in"
                )}
              </Button>
              <Link
                href={"/register"}
                className={buttonVariants({ variant: "outline" })}
              >
                Need a new account?
              </Link>
              <Link
                href={"/reset-password"}
                className={buttonVariants({ variant: "link" })}
              >
                Forgot password?
              </Link>
            </div>
            <FormRootError />
          </form>
        </Form>
      </div>
    </div>
  );
}
