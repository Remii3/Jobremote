"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useCancel from "./cancel.hooks";

export default function CancelOrderPage({
  params,
}: {
  params: { offer_id: string };
}) {
  const { handleDeleteOffer } = useCancel();
  return (
    <div>
      <MultiStepProgressBar currentStep={3} />
      <div className="flex flex-col items-center relative top-20 mx-auto max-w-2xl">
        <Image
          src={"/canceled_man.webp"}
          alt="Order canceled icon"
          width={400}
          height={400}
          className="rounded-3xl aspect-auto"
        />
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Order payment has been canceled
        </h2>
        <div className="flex flex-col items-center gap-2">
          <Link
            href={"/"}
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Save offer as draft
          </Link>

          {
            <Button
              variant={"outline"}
              size={"lg"}
              className="text-destructive hover:text-destructive"
              onClick={() => handleDeleteOffer(params.offer_id)}
            >
              Go back to main page
            </Button>
          }
        </div>
      </div>
    </div>
  );
}
