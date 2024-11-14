import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getOnlyDirtyFormFields, axiosInstance } from "@/lib/utils";
import { useToast } from "../../../../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { useEffect, useState } from "react";
import { OfferType } from "@/types/types";
import { z } from "zod";
import { UpdateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const editOfferSchema = UpdateOfferSchema.omit({
  _id: true,
  technologies: true,
})
  .extend({
    logo: z.array(z.instanceof(File)).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.minSalary !== undefined && data.maxSalary !== undefined) {
        return data.minSalary < data.maxSalary;
      }
      return true;
    },
    {
      message: "Min salary must be lower than max salary",
      path: ["minSalary"],
    }
  );

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
  const [technologies, setTechnologies] = useState<string[]>(
    offerData.technologies
  );

  const [techOpen, setTechOpen] = useState(false);
  const [localizationOpen, setLocalizationOpen] = useState(false);

  const form = useForm<z.infer<typeof editOfferSchema>>({
    resolver: zodResolver(editOfferSchema),
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
    },
  });

  const { mutate: updateOffer, isPending: updateOfferIsLoading } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.patch(`/offers/${offerData._id}`, data);
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
      if (isAxiosError(error)) {
        form.setError("root", {
          type: "manual",
          message:
            "Failed to change the data. Please check your internet connection.",
        });

        toast({
          title: TOAST_TITLES.ERROR,
          description:
            "Failed to change the password. Please check your internet connection.",
          variant: "destructive",
        });
      } else {
        console.error("error", error);

        form.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again later.",
        });

        toast({
          title: TOAST_TITLES.ERROR,
          description:
            "An error occurred while updating the offer information.",
          variant: "destructive",
        });
      }
    },
  });

  function handleSubmit(values: z.infer<typeof editOfferSchema>) {
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);
    const formData = new FormData();
    Object.entries(updatedFieldsValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const arrayAreEqual = (arr1: string[], arr2: string[]) => {
      if (arr1.length === arr2.length) return true;
      return arr1.every((tech) => arr2.includes(tech));
    };

    const techChanged = !arrayAreEqual(technologies, offerData.technologies);

    if (techChanged) {
      formData.append("technologies", JSON.stringify(technologies));
    }

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
      });
    }
  }, [form, offerData]);

  function handleTechnologies(technology: string) {
    setTechnologies((prevState) => {
      if (prevState.includes(technology)) {
        return prevState.filter((tech) => tech !== technology);
      }
      return [...prevState, technology];
    });
  }

  const changeTechOpenHandler = (newVal: boolean) => {
    setTechOpen(newVal);
  };

  const changeLocalizationOpenHandler = (newVal: boolean) => {
    setLocalizationOpen(newVal);
  };

  return {
    form,
    handleSubmit,
    updateOfferIsLoading,
    handleChangeLogo,
    selectedLogo,
    technologies,
    handleTechnologies,
    techOpen,
    changeTechOpenHandler,
    localizationOpen,
    changeLocalizationOpenHandler,
  };
}
