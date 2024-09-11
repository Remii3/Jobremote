import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <span>Successfully added new offer</span>
      <Link href={"/"} className={buttonVariants({ variant: "default" })}>
        Go back
      </Link>
    </div>
  );
}
