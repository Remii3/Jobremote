"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import useCancel from "./cancel.hooks";
import { StaticBody, StaticBodyCenter } from "@/components/layout/StaticBody";

export default function CancelOrderPage({
  params,
}: {
  params: { offer_id: string };
}) {
  const { handleDeleteOffer } = useCancel();
  return (
    <StaticBody>
      <div className="w-full">
        <MultiStepProgressBar currentStep={3} />
        <div className="flex flex-col items-center relative top-20 mx-auto max-w-2xl">
          <div className="w-full md:w-[600px] h-[332px] relative">
            <Image
              src="/canceled_man.webp"
              alt="Order canceled icon"
              className="rounded-3xl object-contain"
              priority
              quality={100}
              fill
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Order payment has been canceled
          </h2>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={"/"}
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Go back to homepage
            </Link>

            {
              <Button
                variant={"outline"}
                size={"lg"}
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteOffer(params.offer_id)}
              >
                Remove draft
              </Button>
            }
          </div>
        </div>
      </div>
    </StaticBody>
  );
}
