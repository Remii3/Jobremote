"use client";

import React, { useEffect } from "react";
import { Separator } from "../ui/separator";
import { useUser } from "@/context/UserContext";
import { Skeleton } from "../ui/skeleton";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { client } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const userSchema = z
  .object({
    email: z.string().email().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    password: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 6, {
        message: "Password must be at least 6 characters long or empty.",
      }),
    passwordConfirmation: z
      .string()
      .optional()
      .refine((value) => !value || value.length >= 6),
  })
  .refine(
    (data) => {
      if (data.password && !data.passwordConfirmation) {
        return false;
      }
      return true;
    },
    {
      message: "Password confirmation is required",
      path: ["passwordConfirmation"],
    }
  )
  .refine(
    (data) => {
      if (data.passwordConfirmation && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.password && data.passwordConfirmation) {
        return data.password === data.passwordConfirmation;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }
  );

export default function Account() {
  const { user, userDataIsLoading, fetchUserData } = useUser();

  const {
    mutate: updateUser,
    error,
    isLoading,
  } = client.users.updateUser.useMutation({
    onSuccess: () => {
      fetchUserData();
    },
  });

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user ? user.email : "",
      name: user ? user.name : "",
      description: user ? user.description : "",
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        name: user.name,
        description: user.description,
        password: "",
        passwordConfirmation: "",
      });
    }
  }, [user, form]);

  function handleSubmit(values: z.infer<typeof userSchema>) {
    if (!user) return;
    const dirtyFields = Object.keys(form.formState.dirtyFields);
    const updatedFieldsValues = dirtyFields.reduce((acc, key) => {
      const typedKey = key as keyof typeof values;
      if (values[typedKey] !== undefined) {
        acc[typedKey] = values[typedKey];
      }
      return acc;
    }, {} as Partial<z.infer<typeof userSchema>>);

    updateUser({ body: { _id: user._id, ...updatedFieldsValues } });
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold">Account details</h2>
      <span className="text-muted-foreground text-sm">
        Here you can change or add your personal information that are going to
        be used to fill application forms.
      </span>
      <Separator className="my-4" />
      {userDataIsLoading && <Skeleton className="h-5 w-32" />}
      {!userDataIsLoading && user && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <Input disabled {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First and last name:</FormLabel>
                  <Input
                    {...field}
                    onChange={(data) => {
                      field.onChange(data);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your introduction:</FormLabel>
                  <Textarea {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <Input {...field} />
                  {form.formState.touchedFields.password &&
                    form.formState.errors.password && <FormMessage />}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation:</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isLoading}
                className="mt-2"
              >
                {!isLoading && <span>Save changes</span>}
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
              </Button>
              {error && (error.status === 404 || error.status === 500) && (
                <p className="text-red-500">{error.body.msg}</p>
              )}
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
