"use client";
import { handleError } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, TRPCClientError } from "@trpc/client";
import { AppRouter } from "../../../../server/src/routes/_app";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:5000/trpc",
    }),
  ],
});

const fetchOffers = async () => {
  const res = await trpc.offers.getOffers.query({});
  console.log("ers", res);
  return res;
};

const createOffer = async (e) => {
  e.preventDefault();
  try {
    const res = await trpc.offers.createOffer.mutate({});
    return res;
  } catch (err) {
    throw err;
  }
};

const OffersList = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["data"],
    queryFn: fetchOffers,
  });
  const { mutate, error: newOfferError } = useMutation({
    mutationKey: ["createOffer"],
    mutationFn: createOffer,
    onError: (err: TRPCClientError<AppRouter>) => {
      handleError(err);
    },
  });

  return (
    <section>
      <h2>Offers</h2>
      <form action="" onSubmit={mutate}>
        <input type="text" />
        {newOfferError?.data?.zodError?.fieldErrors.title && (
          <p className="text-red-500">
            {newOfferError.data.zodError.fieldErrors.title}
          </p>
        )}
        <input type="text" />
        <button type="submit">Submit</button>
      </form>
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
