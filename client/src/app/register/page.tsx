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
import {
  BaseUserFormSchema,
  testSchema,
  UserFormSchema,
  UserSchema,
} from "../../../../server/src/schemas/userSchemas";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const form = useForm<z.infer<typeof testSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      email: "",
      password: "",
      // passwordRepeat: "",
      // commercialConsent: false,
      // privacyPolicyConsent: false,
    },
  });
  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  function toggleShowRepeatPassword() {
    setShowRepeatPassword((prev) => !prev);
  }
  function submitHandler(data: z.infer<typeof testSchema>) {
    console.log(data);
  }
  return (
    <div className="flex items-center justify-center h-full">
      <div>
        <h2>Sign up</h2>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
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
                        type={showRepeatPassword ? "text" : "password"}
                      />
                      {!showRepeatPassword ? (
                        <button
                          type="button"
                          onClick={toggleShowRepeatPassword}
                        >
                          <Eye className={`absolute top-2 right-4 h-6 w-6`} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={toggleShowRepeatPassword}
                        >
                          <EyeOff
                            className={`absolute right-4 top-2 h-6 w-6`}
                          />
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
              name="commercialConsent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Commercial consent
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacyPolicyConsent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Privacy policy consent
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2">
              <Button type="submit">Create an account</Button>
              <Link
                href={"/login"}
                className={buttonVariants({ variant: "ghost" })}
              >
                Already have an account?
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
