"use client";

import { ClientInferResponses } from "@ts-rest/core";
import { mainContract } from "../../../../../server/src/contracts/_app";

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
        <ul>
          {data.body.offers.map((offer) => (
            <li key={offer._id}>
              <button
                type="button"
                onClick={() => changeCurrentOffer(offer._id)}
              >
                <h3>{offer.title}</h3>
                <p>{offer.content}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OffersList;
