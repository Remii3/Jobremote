"use client";
import { trpc } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const fetchOffers = async () => {
  const res = await trpc.offers.getOffers.query({});
  console.log("ers", res);
  return res;
};

const OffersList = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: fetchOffers,
  });

  return (
    <section>
      <h2>Offers</h2>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.offers.map((offer) => (
            <li key={offer._id}>
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default OffersList;
