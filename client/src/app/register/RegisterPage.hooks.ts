import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { axiosInstance } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreateUserSchemaRefined } from "@/schema/UserSchemas";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const useRegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    mutate: handleRegister,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: z.infer<typeof CreateUserSchemaRefined>) => {
      const response = await axiosInstance.post("/users", data);
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            "Failed to change the password. Please check your internet connection.",
          variant: "destructive",
        });
      }
      console.error(error);
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
};
