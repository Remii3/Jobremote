import { useRouter } from "next/navigation";
import { ChangeUserPasswordSchema } from "jobremotecontracts/dist/schemas/userSchemas";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { axiosInstance } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const ClientChangeUserPasswordSchema = ChangeUserPasswordSchema.omit({
  resetToken: true,
});

const ChangeUserPasswordSchemaRefined =
  ClientChangeUserPasswordSchema.superRefine((data, ctx) => {
    if (data.password !== data.passwordRepeat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["passwordRepeat"],
      });
    }
  });

export const useChangePassword = ({ resetToken }: { resetToken: string }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof ChangeUserPasswordSchemaRefined>>({
    resolver: zodResolver(ChangeUserPasswordSchemaRefined),
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
      if (isAxiosError(error)) {
        form.setError("root", {
          type: "manual",
          message:
            "Failed to change the password. Please check your internet connection.",
        });

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
  function handleSubmit(data: z.infer<typeof ChangeUserPasswordSchemaRefined>) {
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
};
