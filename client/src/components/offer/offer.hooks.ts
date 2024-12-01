import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { applicationSchema } from "@/schema/OfferSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type useOfferProps = {
  offerId: string;
};

export function useOffer({ offerId }: useOfferProps) {
  const [showOriginalPrice, setShowOriginalPrice] = useState<boolean>(false);
  const [isSuccessApplied, setIsSuccessApplied] = useState<boolean>(false);

  function toggleSuccessApplied() {
    setIsSuccessApplied((prev) => !prev);
  }

  const { toast } = useToast();
  const { user, fetchUserData } = useUser();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      cv: [],
    },
  });

  const { mutate: handleOfferApply, isPending: isPendingApplyForOffer } =
    useMutation({
      mutationFn: (data: any) => axiosInstance.post("/offers/apply", data),
      onSuccess: () => {
        fetchUserData();
        form.reset();
        toggleSuccessApplied();
      },
      onError: (error) => {
        handleError(error, toast);
      },
    });

  function submitApplicationHandler(values: z.infer<typeof applicationSchema>) {
    if (values.cv === null) return;
    const applyFormData = new FormData();
    applyFormData.append("name", values.name);
    applyFormData.append("email", values.email);
    applyFormData.append("description", values.description || "");
    applyFormData.append("offerId", offerId);
    applyFormData.append("cv", values.cv[0]);
    if (user) {
      applyFormData.append("userId", user._id);
    }
    handleOfferApply(applyFormData);
  }

  function toggleOriginalPrice() {
    setShowOriginalPrice((prev) => !prev);
  }

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        description: user.description,
      });
    }
  }, [user, form]);

  return {
    showOriginalPrice,
    toggleOriginalPrice,
    form,
    submitApplicationHandler,
    isPendingApplyForOffer,
    isSuccessApplied,
  };
}
