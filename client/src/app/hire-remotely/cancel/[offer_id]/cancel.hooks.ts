import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { axiosInstance } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/errorHandler";
import fetchWithAuth from "@/lib/fetchWithAuth";

export default function useCancel() {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchUserData } = useUser();

  const { mutate: deleteOffer } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchWithAuth.post(
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
      handleError(error, toast);
    },
  });

  function handleDeleteOffer(offerId: string) {
    deleteOffer({ _id: offerId });
  }

  return {
    handleDeleteOffer,
  };
}
