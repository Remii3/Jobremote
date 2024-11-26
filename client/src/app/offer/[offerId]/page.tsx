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
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function OfferPage() {
  const { error, isPending, offerData } = useOffer();

  //   TODO remove console.log
  console.log("Offer:", offerData);
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
      {offerData && (
        <div className="h-full w-full mx-auto p-4">
          <Breadcrumb className="mb-2">
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
          <section className="grid grid-cols-1 lg:grid-cols-2">
            <div>
              <h1>{offerData.offer.title}</h1>
              <p>{offerData.offer.companyName}</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <h2>Related</h2>
                {offerData.relatedOffers.length > 0 ? (
                  <Carousel className="relative">
                    <CarouselContent>
                      {offerData.relatedOffers.map((offer) => (
                        <CarouselItem
                          key={offer._id}
                          className="basis-1/2 md:basis-1/3"
                        >
                          <Link href={`/offer/${offer._id}`}>
                            <Card>
                              <CardHeader>
                                <CardTitle>{offer.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h1>{offer.title}</h1>
                                <p>{offer.companyName}</p>
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-2" />
                    <CarouselNext className="-right-2" />
                  </Carousel>
                ) : (
                  <p className="text-muted-foreground">No related offers</p>
                )}
              </div>
              <div>
                <h2>Similar</h2>
                {offerData.similarOffers.length > 0 ? (
                  <Carousel>
                    <CarouselContent>
                      {offerData.similarOffers.map((offer) => (
                        <CarouselItem
                          key={offer._id}
                          className="basis-1/2 md:basis-1/3"
                        >
                          <Link href={`/offer/${offer._id}`}>
                            <Card>
                              <CardHeader>
                                <CardTitle>{offer.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <h1>{offer.title}</h1>
                                <p>{offer.companyName}</p>
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <p className="text-muted-foreground">No similar offers</p>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
