import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getOnlyDirtyFormFields } from "@/lib/utils";
import { useEffect } from "react";
import { useToast } from "../../../components/ui/use-toast";
import { TOAST_TITLES } from "@/constants/constant";
import { UserType } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";
import { UpdateUserSettingsSchema } from "@/schema/UserSchemas";
import fetchWithAuth from "@/lib/fetchWithAuth";

type UseSettingsProps = {
  user: UserType;
  fetchUserData: () => void;
};

export function useSettings({ fetchUserData, user }: UseSettingsProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof UpdateUserSettingsSchema>>({
    resolver: zodResolver(UpdateUserSettingsSchema),
    defaultValues: { commercialConsent: user.commercialConsent },
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchWithAuth.patch(
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
      handleError(error, toast);
    },
  });

  function handleSubmit(values: z.infer<typeof UpdateUserSettingsSchema>) {
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
