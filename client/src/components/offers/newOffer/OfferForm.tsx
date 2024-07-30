import { client } from "@/lib/utils";

const OfferForm = () => {
  const { mutate } = client.offers.createOffer.useMutation();
  const dane = client.offers.createOffer.useMutation();

  return (
    <form
      action=""
      onSubmit={() =>
        mutate({ body: { title: "test title1", content: "test content 1" } })
      }
    >
      <input type="text" />
      <input type="text" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default OfferForm;
