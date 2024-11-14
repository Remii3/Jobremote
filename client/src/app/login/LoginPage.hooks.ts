import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LoginUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

export const useLoginPageHooks = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserData } = useUser();

  const { mutate: handleLogin, isPending: loginIsPending } = useMutation({
    mutationFn: async (data: z.infer<typeof LoginUserSchema>) => {
      const response = await axiosInstance.post("/users/login", data);
      return response.data;
    },
    onSuccess: () => {
      fetchUserData();
      router.push("/");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            "Failed to change the password. Please check your internet connection.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function submitHandler(data: z.infer<typeof LoginUserSchema>) {
    handleLogin(data);
  }
  return {
    form,
    loginIsPending,
    submitHandler,
  };
};
