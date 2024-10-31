import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { useEffect } from "react";
import { isFetchError } from "@ts-rest/react-query/v5";
import { UserType } from "@/types/types";

const UserDataSchema = UpdateUserSchema.omit({ _id: true });

type UseDetialsProps = {
  user: UserType;
  fetchUserData: () => void;
};

export function useDetails({ fetchUserData, user }: UseDetialsProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof UserDataSchema>>({
    resolver: zodResolver(UserDataSchema),
    defaultValues: {
      name: user.name,
      description: user.description,
    },
  });

  const { mutate: updateUser, isPending } = client.users.updateUser.useMutation(
    {
      onSuccess: () => {
        fetchUserData();
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Account details have been updated successfully.",
        });
      },
      onError: (error) => {
        if (isFetchError(error)) {
          toast({
            title: TOAST_TITLES.ERROR,
            description:
              "Failed to change the password. Please check your internet connection.",
            variant: "destructive",
          });
        } else if (error.status == 404 || error.status == 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description: error.body.msg,
            variant: "destructive",
          });
        } else {
          console.error("error", error);
          form.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description:
              "An error occurred while updating the account details.",
            variant: "destructive",
          });
        }
      },
    }
  );

  function handleSubmit(values: z.infer<typeof UserDataSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    updateUser({ body: { ...updatedFieldsValues, _id: user._id } });
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ name: user.name, description: user.description });
    }
  }, [form, user.name, user.description]);

  return {
    form,
    handleSubmit,
    isPending,
  };
}
