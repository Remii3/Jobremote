import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { axiosInstance } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordSchema } from "@/schema/OfferSchema";
import { TOAST_TITLES } from "@/constants/constant";
import { handleError } from "@/lib/errorHandler";

export function useChangePassword({ resetToken }: { resetToken: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/users/update-password", data);
      return res.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  function handleSubmit(data: z.infer<typeof ChangePasswordSchema>) {
    mutate({
      password: data.password,
      passwordRepeat: data.password,
      resetToken,
    });
  }

  return {
    form,
    handleSubmit,
    isPending,
  };
}
