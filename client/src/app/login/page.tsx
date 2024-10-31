"use client";

import { Separator } from "@/components/ui/separator";
import LoginForm from "../../components/app/login/LoginForm";
import { useLoginPageHooks } from "./LoginPage.hooks";

export default function LoginPage() {
  const { form, loginIsPending, submitHandler } = useLoginPageHooks();

  return (
    <div className="flex items-center justify-center h-full ">
      <div className="max-w-xs w-full space-y-2">
        <h2 className="text-3xl">Sign in</h2>
        <Separator />
        <LoginForm
          submitHandler={submitHandler}
          loginIsPending={loginIsPending}
          form={form}
        />
      </div>
    </div>
  );
}
