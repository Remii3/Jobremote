import { handleError, trpc } from "@/lib/utils";
import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "../../../../server/src/routes/_app";
import { useMutation } from "@tanstack/react-query";

const OfferForm = () => {
  const createOffer = async (e: any) => {
    e.preventDefault();
    try {
      const res = await trpc.offers.createOffer.mutate({
        title: "",
        description: "",
      });
      return res;
    } catch (err) {
      throw err;
    }
  };
  const { mutate, error: newOfferError } = useMutation({
    mutationKey: ["createOffer"],
    mutationFn: createOffer,
    onError: (err: TRPCClientError<AppRouter>) => {
      handleError(err);
    },
  });
  return (
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
  );
};

export default OfferForm;
