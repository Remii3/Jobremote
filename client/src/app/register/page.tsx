"use client";

import { Separator } from "@/components/ui/separator";
import RegisterForm from "../../components/app/register/RegisterForm";
import { useRegisterPage } from "./RegisterPage.hooks";
import { StaticBodyCenter } from "@/components/layout/StaticBody";

export default function RegisterPage() {
  const { form, isPending, submitHandler } = useRegisterPage();
  return (
    <StaticBodyCenter>
      <div className="max-w-sm w-full space-y-2">
        <h2 className="text-3xl">Sign up</h2>
        <Separator />
        <RegisterForm
          form={form}
          isPending={isPending}
          submitHandler={submitHandler}
        />
      </div>
    </StaticBodyCenter>
  );
}
