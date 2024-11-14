import { useToast } from "@/components/ui/use-toast";
import { useCurrency } from "@/context/CurrencyContext";
import { useUser } from "@/context/UserContext";
import { axiosInstance } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  toggleSuccessApplied: () => void;
  offerId: string;
};
const applicationSchema = z
  .object({
    name: z.string().min(1, { message: "First and last name is required." }),
    email: z.string().min(1, { message: "Email is required." }).email(),
    description: z.string().optional(),
    cv: z
      .array(
        z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, {
          message: "File size must be less than 5MB",
        })
      )
      .max(1, { message: "Only one file is allowed." })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.cv === null) {
        return false;
      }
      return true;
    },
    {
      path: ["cv"],
      message: "CV is required.",
    }
  );

export default function useOfferDetails({
  toggleSuccessApplied,
  offerId,
}: Props) {
  const { user, fetchUserData } = useUser();
  const { toast } = useToast();

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
        if (isAxiosError(error)) {
          form.setError("root", {
            type: "manual",
            message: "Unable to apply for the offer. Please try again.",
          });
          return toast({
            title: "Error",
            description:
              "Unable to apply for the offer. Please check your internet connection.",
            variant: "destructive",
          });
        } else {
          form.setError("root", {
            type: "manual",
            message: "An error occurred while applying for the offer.",
          });
          return toast({
            title: "Error",
            description:
              "An error occurred while applying for the offer. Please try again later.",
            variant: "destructive",
          });
        }
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
  };
}
