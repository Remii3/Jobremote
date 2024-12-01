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

type SimilarOffersProps = {
  similarOffers: OfferType[];
};

export default function SimilarOffers({ similarOffers }: SimilarOffersProps) {
  return (
    <div>
      <h2>Similar</h2>
      {similarOffers.length > 0 ? (
        <Carousel>
          <CarouselContent>
            {similarOffers.map((offer) => (
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
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-muted-foreground">No similar offers</p>
      )}
    </div>
  );
}
