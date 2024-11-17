"use client";

import { Separator } from "@/components/ui/separator";
import RegisterForm from "../../components/app/register/RegisterForm";
import { useRegisterPage } from "./RegisterPage.hooks";

export default function RegisterPage() {
  const { form, isPending, submitHandler } = useRegisterPage();
  return (
    <div className="flex items-center justify-center h-full px-2">
      <div className="max-w-sm w-full space-y-2">
        <h2 className="text-3xl">Sign up</h2>
        <Separator />
        <RegisterForm
          form={form}
          isPending={isPending}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
}
