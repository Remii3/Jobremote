import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { client } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LoginUserSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useToast } from "@/components/ui/use-toast";
import { isFetchError } from "@ts-rest/react-query/v5";

export const useLoginPageHooks = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserData } = useUser();

  const { mutate: handleLogin, isPending: loginIsPending } =
    client.users.loginUser.useMutation({
      onSuccess: () => {
        fetchUserData();
        router.push("/");
      },
      onError: (error) => {
        if (isFetchError(error)) {
          toast({
            title: "Error",
            description:
              "Failed to change the password. Please check your internet connection.",
            variant: "destructive",
          });
        } else if (
          error.status === 401 ||
          error.status === 403 ||
          error.status === 404
        ) {
          form.setError(error.body.field, {
            type: "manual",
            message: error.body.msg,
          });

          toast({
            title: "Error",
            description: error.body.msg,
            variant: "destructive",
          });
        } else if (error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
          toast({
            title: "Error",
            description: error.body.msg,
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
    handleLogin({ body: data });
  }
  return {
    form,
    loginIsPending,
    submitHandler,
  };
};
