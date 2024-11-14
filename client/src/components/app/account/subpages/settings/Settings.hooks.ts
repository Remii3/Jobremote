import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { axiosInstance, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateUserSettingsSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useEffect } from "react";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { UserType } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

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

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.patch(
        `/users/${user._id}/settings`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      fetchUserData();
      toast({
        title: TOAST_TITLES.SUCCESS,
        description: "Settings have been updated successfully.",
      });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        form.setError("root", {
          type: "manual",
          message: error.message,
        });
        toast({
          title: TOAST_TITLES.ERROR,
          description:
            "An error occurred while updating settings. Please check your internet connection.",
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

    updateSettings({ ...updatedFieldsValues });
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
