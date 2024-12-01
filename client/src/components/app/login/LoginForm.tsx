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
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginUserSchema } from "@/schema/UserSchemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import PasswordField from "@/components/app/login/PasswordField";

type LoginFormProps = {
  submitHandler: (data: z.infer<typeof LoginUserSchema>) => void;
  loginIsPending: boolean;
  form: UseFormReturn<z.infer<typeof LoginUserSchema>>;
};

export default function LoginForm({
  form,
  loginIsPending,
  submitHandler,
}: LoginFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)}>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Email <span className="text-red-400">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <PasswordField form={form} />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant={"default"}
            type="submit"
            size={"lg"}
            disabled={loginIsPending}
            showLoader
            isLoading={loginIsPending}
          >
            Sign in
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
  );
}
