import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/errorHandler";
import { axiosInstance } from "@/lib/utils";
import { emailResetSchema } from "@/schema/UserSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function useResetPassword() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof emailResetSchema>>({
    resolver: zodResolver(emailResetSchema),
    defaultValues: { email: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof emailResetSchema>) => {
      const response = await axiosInstance.post("/users/reset-password", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  function handleSubmit(data: z.infer<typeof emailResetSchema>) {
    mutate(data);
  }

  return {
    form,
    handleSubmit,
    isPending,
  };
}
