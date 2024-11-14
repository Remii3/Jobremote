import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { axiosInstance } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";

export default function useCancel() {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserData } = useUser();

  const { mutate: deleteOffer } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post(
        `/offers/${data._id}/mark-deleted`,
        data
      );
      return res.data;
    },
    onSuccess: async () => {
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
      }
      console.error(error);
    },
  });

  function handleDeleteOffer(offerId: string) {
    deleteOffer({ _id: offerId });
  }
  return {
    handleDeleteOffer,
  };
}
