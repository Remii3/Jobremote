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

import Offer from "@/components/offer/Offer";
import RelatedOffers from "@/components/offer/RelatedOffers";
import SimilarOffers from "@/components/offer/SimilarOffers";
import { StaticBodyCenter } from "@/components/layout/StaticBody";

export default function OfferPage() {
  const { error, isPending, offerData } = useOffer();

  return (
    <>
      {isPending && (
        <StaticBodyCenter>
          <Loader2 className="w-6 h-6 animate-spin" />
        </StaticBodyCenter>
      )}
      {error && <StaticBodyCenter>{error.message}</StaticBodyCenter>}
      {offerData && (
        <div className="h-full w-full mx-auto p-4 pb-16">
          <Breadcrumb className="mb-2 mx-auto max-w-screen-2xl">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{offerData.offer.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <section className="mx-auto max-w-screen-lg">
            <Offer offer={offerData.offer} />
          </section>
          <div className="space-y-8 max-w-screen-2xl mx-auto my-8 md:px-12">
            <RelatedOffers relatedOffers={offerData.relatedOffers} />
            <SimilarOffers similarOffers={offerData.similarOffers} />
          </div>
        </div>
      )}
    </>
  );
}
