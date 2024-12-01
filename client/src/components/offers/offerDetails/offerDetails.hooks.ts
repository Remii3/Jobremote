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

type Props = {
  toggleSuccessApplied: () => void;
  offerId: string;
};

export function useOfferDetails({ toggleSuccessApplied, offerId }: Props) {
  const { user, fetchUserData } = useUser();
  const { toast } = useToast();
  const [showOriginalPrice, setShowOriginalPrice] = useState(false);

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
    form,
    submitApplicationHandler,
    isPendingApplyForOffer,
    showOriginalPrice,
    toggleOriginalPrice,
  };
}
