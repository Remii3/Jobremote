import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateUserSchemaRefined } from "@/schema/UserSchemas";
import PasswordRepeatField from "@/components/app/register/PasswordRepeatField";
import PasswordField from "@/components/app/register/PasswordField";

type RegisterFormProps = {
  form: UseFormReturn<z.infer<typeof CreateUserSchemaRefined>>;
  submitHandler: (data: z.infer<typeof CreateUserSchemaRefined>) => void;
  isPending: boolean;
};

export const RegisterForm = ({
  form,
  isPending,
  submitHandler,
}: RegisterFormProps) => {
  return (
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
          <PasswordField form={form} />
          <PasswordRepeatField form={form} />
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
                        onCheckedChange={(checked) => field.onChange(checked)}
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
                        onCheckedChange={(checked) => field.onChange(checked)}
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
        <FormRootError />
      </form>
    </Form>
  );
};
