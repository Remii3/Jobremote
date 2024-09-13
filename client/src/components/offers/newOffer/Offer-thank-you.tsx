import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function OfferThankYou() {
  return (
    <div className="flex h-full flex-col items-center relative">
      <div className="flex flex-col relative top-40 items-center">
        <Image
          src={"Businessman Success Trophy.svg"}
          alt="Successfuly posted new offer icon"
          width={300}
          height={200}
          className="rounded-3xl aspect-auto mb-6"
        />
        <h2 className="text-2xl font-semibold mb-4">
          Your offer has been posted successfully!
        </h2>
        <div className="flex flex-col items-center gap-2">
          <Link
            href={"/hire-remotely"}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Add another
          </Link>
          <Link
            href={"/"}
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Back to main page
          </Link>
        </div>
      </div>
    </div>
  );
}
