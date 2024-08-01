"use client";

import { ClientInferResponses } from "@ts-rest/core";
import { mainContract } from "../../../../../server/src/contracts/_app";
import OfferItem from "./OfferItem";

type OffersDataType = ClientInferResponses<
  typeof mainContract.offers.getOffers,
  200
>;

interface OffersListPropsType {
  changeCurrentOffer: (newId: string) => void;
  data?: OffersDataType;
  isError: boolean;
  error: any;
  isLoading: boolean;
}

const OffersList = ({
  changeCurrentOffer,
  data,
  isError,
  error,
  isLoading,
}: OffersListPropsType) => {
  return (
    <section>
      <h2>Offers</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.status}</p>}
      {data && (
        <ul className="space-y-2">
          {data.body.offers.map((offer) => (
            <OfferItem
              key={offer._id}
              _id={offer._id}
              title={offer.title}
              typeOfWork={offer.typeOfWork}
              experience={offer.experience}
              localization={offer.localization}
              changeCurrentOffer={changeCurrentOffer}
              maxSalary={offer.maxSalary}
              minSalary={offer.minSalary}
              currency={offer.currency}
              technologies={offer.technologies}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default OffersList;
