import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOnlyDirtyFormFields, axiosInstance } from "@/lib/utils";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/constants/constant";
import { useEffect, useState } from "react";
import { OfferType } from "@/types/types";
import { z } from "zod";
import { UpdateOfferSchema } from "@/schema/OfferSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";
import fetchWithAuth from "@/lib/fetchWithAuth";

type EditOfferProps = {
  offerData: OfferType;
  handleChangeCurrentEditOffer: (offerId: OfferType | null) => void;
  queryClient: ReturnType<typeof useQueryClient>;
};

export function useEditOffer({
  offerData,
  handleChangeCurrentEditOffer,
  queryClient,
}: EditOfferProps) {
  const { toast } = useToast();
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);

  const [techOpen, setTechOpen] = useState(false);
  const [localizationOpen, setLocalizationOpen] = useState(false);

  const form = useForm<z.infer<typeof UpdateOfferSchema>>({
    resolver: zodResolver(UpdateOfferSchema),
    defaultValues: {
      title: offerData.title,
      content: offerData.content,
      experience: offerData.experience,
      employmentType: offerData.employmentType,
      companyName: offerData.companyName,
      contractType: offerData.contractType,
      localization: offerData.localization,
      minSalary: offerData.minSalary,
      maxSalary: offerData.maxSalary,
      currency: offerData.currency,
      redirectLink: offerData.redirectLink || "",
      technologies: offerData.technologies,
    },
  });

  const { mutate: updateOffer, isPending: updateOfferIsLoading } = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetchWithAuth.patch(`/offers/${offerData._id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
      queryClient.invalidateQueries({ queryKey: ["offers-list"] });
      toast({
        title: TOAST_TITLES.SUCCESS,
        description: "Offer information has been updated successfully.",
      });
      handleChangeCurrentEditOffer(null);
    },
    onError: (error) => {
      handleError(error, toast);
    },
  });

  function handleSubmit(values: z.infer<typeof UpdateOfferSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    const formData = new FormData();
    Object.entries(updatedFieldsValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (selectedLogo) {
      formData.append("logo", selectedLogo[0]);
    }

    formData.append("_id", offerData._id);
    updateOffer(formData);
  }

  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }

  useEffect(() => {
    if (form.formState.isDirty) {
      form.reset({
        title: offerData.title,
        content: offerData.content,
        experience: offerData.experience,
        employmentType: offerData.employmentType,
        companyName: offerData.companyName,
        contractType: offerData.contractType,
        localization: offerData.localization,
        minSalary: offerData.minSalary,
        maxSalary: offerData.maxSalary,
        currency: offerData.currency,
        redirectLink: offerData.redirectLink,
        technologies: offerData.technologies,
      });
    }
  }, [form, offerData]);

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

  return {
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
  };
}
