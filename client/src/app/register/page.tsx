"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { client } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreateUserSchemaRefined } from "@/schema/UserSchemas";

export default function RegisterPage() {
  const router = useRouter();
  const {
    mutate: register,
    isPending,
    isError,
    error,
  } = client.users.createUser.useMutation({
    onSuccess: () => router.push("/login"),
    onError: (error) => {
      if (error.status === 400 || error.status === 409) {
        form.setError(error.body.field, {
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

  const [showPasswords, setShowPasswords] = useState({
    password: false,
    passwordRepeat: false,
  });

  const form = useForm<z.infer<typeof CreateUserSchemaRefined>>({
    resolver: zodResolver(CreateUserSchemaRefined),
    defaultValues: {
      email: "",
      password: "",
      passwordRepeat: "",
      commercialConsent: false,
      privacyPolicyConsent: false,
    },
  });

  function toggleShowPasswords(name: "password" | "passwordRepeat") {
    setShowPasswords((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function submitHandler(data: z.infer<typeof CreateUserSchemaRefined>) {
    register({ body: data });
  }
  return (
    <div className="flex items-center justify-center h-full px-2">
      <div className="max-w-sm w-full space-y-2">
        <h2 className="text-3xl">Sign up</h2>
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
                          type={showPasswords.password ? "text" : "password"}
                        />
                        {!showPasswords.password ? (
                          <button
                            type="button"
                            onClick={() => toggleShowPasswords(field.name)}
                            className="absolute top-2 right-4"
                          >
                            <Eye className="h-6 w-6" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleShowPasswords(field.name)}
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
                    <FormLabel>Repeat Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={
                            showPasswords.passwordRepeat ? "text" : "password"
                          }
                        />
                        {!showPasswords.passwordRepeat ? (
                          <button
                            type="button"
                            onClick={() => toggleShowPasswords(field.name)}
                            className="absolute top-2 right-4"
                          >
                            <Eye className="h-6 w-6" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleShowPasswords(field.name)}
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
              <div className="space-y-2 mt-2">
                <FormField
                  control={form.control}
                  name="commercialConsent"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer">
                          Commercial consent
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="privacyPolicyConsent"
                  render={({ field }) => (
                    <FormItem className="">
                      <div className="flex items-center gap-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                        </FormControl>
                        <FormLabel className="cursor-pointer text-sm">
                          Privacy policy consent
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button
                type="submit"
                disabled={isPending}
                variant={"default"}
                size={"lg"}
              >
                {isPending ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "outline" })}
              >
                Already have an account?
              </Link>
            </div>
            {isError && error.status === 500 && (
              <p className="text-sm font-medium text-destructive">
                {error.body.msg}
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
