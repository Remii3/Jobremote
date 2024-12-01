"use client";

import { Separator } from "@/components/ui/separator";
import LoginForm from "../../components/app/login/LoginForm";
import { useLoginPageHooks } from "./LoginPage.hooks";
import { StaticBodyCenter } from "@/components/layout/StaticBody";

export default function LoginPage() {
  const { form, loginIsPending, submitHandler } = useLoginPageHooks();

  return (
    <StaticBodyCenter>
      <div className="max-w-xs w-full space-y-2">
        <h2 className="text-3xl">Sign in</h2>
        <Separator />
        <LoginForm
          submitHandler={submitHandler}
          loginIsPending={loginIsPending}
          form={form}
        />
      </div>
    </StaticBodyCenter>
  );
}
