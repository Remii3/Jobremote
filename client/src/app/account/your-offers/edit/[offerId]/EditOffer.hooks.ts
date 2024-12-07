import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOnlyDirtyFormFields, axiosInstance } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { TOAST_TITLES } from "@/constants/constant";
import { useEffect, useState } from "react";
import { OfferType } from "@/types/types";
import { z } from "zod";
import { CreateOfferSchema } from "@/schema/OfferSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";
import fetchWithAuth from "@/lib/fetchWithAuth";

type EditOfferProps = {
  offerId: string;
};

type FetchDataType = {
  offer: OfferType;
};

// TODO - on change refresh every list with items and form
export function useEditOffer({ offerId }: EditOfferProps) {
  const { toast } = useToast();
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);
  const queryClient = useQueryClient();
  const [bindSalaries, setBindSalaries] = useState<boolean>(true);

  const [techOpen, setTechOpen] = useState(false);
  const [localizationOpen, setLocalizationOpen] = useState(false);

  const {
    data: offerData,
    isPending,
    error,
    isError,
  } = useQuery({
    queryKey: ["offer", offerId],
    queryFn: async () => {
      const res = await axiosInstance.get<FetchDataType>(`/offers/${offerId}`);
      return res.data.offer;
    },
  });

  const form = useForm<z.infer<typeof CreateOfferSchema>>({
    resolver: zodResolver(CreateOfferSchema),
    defaultValues: {
      title: "",
      content: "",
      experience: "",
      employmentType: "",
      companyName: "",
      contractType: "",
      localization: "",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
      redirectLink: "",
      technologies: [],
      maxSalaryYear: 0,
      minSalaryYear: 0,
      benefits: "",
      duties: "",
      requirements: "",
    },
  });

  const { mutate: updateOffer, isPending: updateOfferIsLoading } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchWithAuth.patch(`/offers/${offerId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
      queryClient.invalidateQueries({ queryKey: ["offers-list"] });
      toast({
        title: TOAST_TITLES.SUCCESS,
        description: "Offer information has been updated successfully.",
      });
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  function handleSubmit(values: z.infer<typeof CreateOfferSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    const formData = new FormData();
    Object.entries(updatedFieldsValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (selectedLogo) {
      formData.append("logo", selectedLogo[0]);
    }

    formData.append("_id", offerId);
    updateOffer(formData);
  }

  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }

  useEffect(() => {
    if (!offerData) return;
    form.reset((values) => ({
      ...values,
      title: offerData.title || "",
      content: offerData.content || "",
      experience: offerData.experience || "",
      employmentType: offerData.employmentType || "",
      companyName: offerData.companyName || "",
      contractType: offerData.contractType || "",
      localization: offerData.localization || "",
      minSalary: offerData.minSalary ?? 0,
      maxSalary: offerData.maxSalary ?? 0,
      currency: offerData.currency || "",
      redirectLink: offerData.redirectLink || "",
      technologies: offerData.technologies || [],
      benefits: offerData.benefits || "",
      duties: offerData.duties || "",
      requirements: offerData.requirements || "",
      maxSalaryYear: offerData.maxSalaryYear ?? 0,
      minSalaryYear: offerData.minSalaryYear ?? 0,
    }));
  }, [form, offerData]);

  function handleBindSalaries() {
    setBindSalaries(!bindSalaries);
  }

  function handleTechnologies(technology: string) {
    const technologies = form.getValues().technologies || [];
    const updated = technologies.includes(technology)
      ? technologies.filter((tech) => tech !== technology)
      : [...technologies, technology];
    form.setValue("technologies", updated);
  }

  function changeTechOpenHandler(newVal: boolean) {
    setTechOpen(newVal);
  }

  function changeLocalizationOpenHandler(newVal: boolean) {
    setLocalizationOpen(newVal);
  }
  console.log("Form values: ", form.getValues());
  return {
    offerData,
    isPending,
    error,
    isError,
    form,
    handleSubmit,
    updateOfferIsLoading,
    handleChangeLogo,
    selectedLogo,
    handleTechnologies,
    techOpen,
    changeTechOpenHandler,
    localizationOpen,
    changeLocalizationOpenHandler,
    bindSalaries,
    handleBindSalaries,
  };
}
