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
      <h2 className="text-2xl font-medium mb-2">Similar</h2>
      {similarOffers.length > 0 ? (
        <Carousel className="relative">
          <CarouselContent>
            {similarOffers.map((offer) => (
              <CarouselItem
                key={offer._id}
                className="basis-full sm:basis-1/3 xl:basis-1/5"
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
        <p className="text-muted-foreground">No similar offers</p>
      )}
    </div>
  );
}
