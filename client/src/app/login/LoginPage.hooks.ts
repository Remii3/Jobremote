import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";
import { LoginUserSchema } from "@/schema/UserSchemas";
import { useAuth } from "@/context/AuthContext";

export function useLoginPageHooks() {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserData } = useUser();
  const { setAccessToken } = useAuth();
  const { mutate: handleLogin, isPending: loginIsPending } = useMutation({
    mutationFn: async (data: z.infer<typeof LoginUserSchema>) => {
      const response = await axiosInstance.post("/users/login", data);
      return response.data;
    },
    onSuccess: async (response) => {
      setAccessToken(response.accessToken);
      localStorage.setItem("loggedIn", "true");
      await fetchUserData();
      router.push("/");
    },
    onError: (error) => {
      handleError(error, toast);
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
}
