import { OfferType } from "@/types/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type RelatedOffersProps = {
  relatedOffers: OfferType[];
};

export default function RelatedOffers({ relatedOffers }: RelatedOffersProps) {
  return (
    <div>
      <h2>Related</h2>
      {relatedOffers.length > 0 ? (
        <Carousel className="relative">
          <CarouselContent>
            {relatedOffers.map((offer) => (
              <CarouselItem key={offer._id} className="basis-1/2 md:basis-1/3">
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
  );
}
