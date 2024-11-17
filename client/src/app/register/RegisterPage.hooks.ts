import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { axiosInstance } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreateUserSchemaRefined } from "@/schema/UserSchemas";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";

export function useRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateUserSchemaRefined>) => {
      const response = await axiosInstance.post("/users", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  const form = useForm<z.infer<typeof CreateUserSchemaRefined>>({
    resolver: zodResolver(CreateUserSchemaRefined),
    defaultValues: {
      email: "",
      password: "",
      passwordRepeat: "",
      commercialConsent: false,
      privacyPolicyConsent: false,
    },
  });

  function submitHandler(data: z.infer<typeof CreateUserSchemaRefined>) {
    handleRegister(data);
  }

  return {
    form,
    submitHandler,
    isPending,
  };
}
