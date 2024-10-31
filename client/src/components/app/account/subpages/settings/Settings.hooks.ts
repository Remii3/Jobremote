import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSettingsSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useEffect } from "react";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { isFetchError } from "@ts-rest/react-query/v5";
import { UserType } from "@/types/types";

const UserSettingsSchema = UpdateUserSettingsSchema.omit({ _id: true });

type UseSettingsProps = {
  user: UserType;
  fetchUserData: () => void;
};

export function useSettings({ fetchUserData, user }: UseSettingsProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof UserSettingsSchema>>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: { commercialConsent: user.commercialConsent },
  });

  const { mutate: updateSettings, isPending } =
    client.users.updateUserSettings.useMutation({
      onSuccess: () => {
        fetchUserData();
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Settings have been updated successfully.",
        });
      },
      onError: (error) => {
        if (isFetchError(error)) {
          form.setError("root", {
            type: "manual",
            message: error.message,
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description:
              "An error occurred while updating settings. Please check your internet connection.",
          });
        } else if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description: error.body.msg,
          });
        } else {
          console.error("error", error);
          form.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
          toast({
            title: TOAST_TITLES.ERROR,
            description: "An error occurred while updating settings.",
          });
        }
      },
    });

  function handleSubmit(values: z.infer<typeof UserSettingsSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);

    updateSettings({ body: { ...updatedFieldsValues, _id: user._id } });
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({ commercialConsent: user.commercialConsent });
    }
  }, [user.commercialConsent, form]);
  return {
    form,
    isPending,
    handleSubmit,
  };
}
