"use client";

import { Loader2 } from "lucide-react";
import { useOffer } from "./offer.hooks";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function OfferPage() {
  const { error, isPending, offer } = useOffer();

  //   TODO remove console.log
  console.log("Offer:", offer);
  return (
    <>
      {isPending && (
        <div className="flex items-center justify-center h-full px-2">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center h-full px-2">
          {error.message}
        </div>
      )}
      {offer && (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{offer.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <h1>{offer.title}</h1>
            <p>{offer.companyName}</p>
            <p>{offer.redirectLink}</p>
            <p>{offer.priceType}</p>
          </div>
        </>
      )}
    </>
  );
}
