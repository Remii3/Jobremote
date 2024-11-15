import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getOnlyDirtyFormFields, axiosInstance } from "@/lib/utils";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/constants/constant";
import { useEffect } from "react";
import { UserType } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";
import { UpdateUserSchema } from "@/schema/UserSchemas";

type UseDetialsProps = {
  user: UserType;
  fetchUserData: () => void;
};

export function useDetails({ fetchUserData, user }: UseDetialsProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user.name,
      description: user.description,
    },
  });

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.patch(`/users/${user._id}/profile`, data);
      return res.data;
    },
    onSuccess: () => {
      fetchUserData();
      toast({
        title: TOAST_TITLES.SUCCESS,
        description: "Account details have been updated successfully.",
      });
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  function handleSubmit(values: z.infer<typeof UpdateUserSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    updateUser({ ...updatedFieldsValues });
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
