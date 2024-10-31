import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { client } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CreateUserSchemaRefined } from "@/schema/UserSchemas";
import { isFetchError } from "@ts-rest/react-query/v5";
import { useToast } from "@/components/ui/use-toast";

export const useRegisterPage = () => {
  const router = useRouter();
  const { toast } = useToast();

  const {
    mutate: handleRegister,
    isPending,
    isError,
    error,
  } = client.users.createUser.useMutation({
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error) => {
      if (isFetchError(error)) {
        toast({
          title: "Error",
          description:
            "Failed to change the password. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error.status === 400 || error.status === 409) {
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
    handleRegister({ body: data });
  }
  return {
    form,
    submitHandler,
    isPending,
  };
};
