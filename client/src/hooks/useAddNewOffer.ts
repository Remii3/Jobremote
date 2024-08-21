import { client } from "@/lib/utils";
import {
  allowedTechnologies,
  emplomentTypes,
  experience,
  localizations,
  OfferSchema,
  typeOfWork,
} from "../../../server/src/schemas/offerSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewOfferType, OfferType } from "@/types/types";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

const formSchemaTypes = OfferSchema.extend({
  title: z.string(),
  content: z.string(),
  experience: z.enum([...experience, ""]),
  localization: z.enum([...localizations, ""]),
  typeOfWork: z.enum([...typeOfWork, ""]),
  employmentType: z.enum([...emplomentTypes, ""]),
  technologies: z.array(z.enum([...allowedTechnologies]).optional()),
});

interface useAddNewOfferTypes {
  callback: () => void;
  defaultData?: OfferType;
}
type TechnologiesTypes = z.infer<typeof formSchemaTypes>["technologies"];

export default function useAddNewOffer({
  callback,
  defaultData,
}: useAddNewOfferTypes) {
  const [technologies, setTechnologies] = useState<TechnologiesTypes>(
    defaultData?.technologies ? defaultData.technologies : []
  );
  const { user, fetchUserData } = useUser();
  const { mutate } = client.offers.createOffer.useMutation({
    onSuccess: () => {
      fetchUserData();
      form.reset();
      queryClient.invalidateQueries(["offersList"]);
      callback();
    },
  });
  const queryClient = useQueryClient();
  const formSchema = OfferSchema.omit({ _id: true, createdAt: true });

  const form = useForm<z.infer<typeof formSchemaTypes>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultData?.title || "",
      content: defaultData?.content || "",
      experience: defaultData?.experience || "",
      employmentType: defaultData?.employmentType || "",
      localization: defaultData?.localization || "",
      typeOfWork: defaultData?.typeOfWork || "",
      minSalary: defaultData?.minSalary || 0,
      maxSalary: defaultData?.maxSalary || 0,
      currency: defaultData?.currency || "USD",
    },
  });
  function handleTechnologies(technology: TechnologiesTypes[number]) {
    if (technologies.includes(technology)) {
      setTechnologies(technologies.filter((tech) => tech !== technology));
    } else {
      setTechnologies([...technologies, technology]);
    }
  }
  async function handleSubmit(values: z.infer<typeof formSchemaTypes>) {
    let hasError = false;
    if (values.experience === "") {
      form.setError("experience", {
        type: "value",
        message: "Experience is required",
      });
      hasError = true;
    }

    if (values.localization === "") {
      form.setError("localization", {
        type: "value",
        message: "Localization is required",
      });
      hasError = true;
    }

    if (values.typeOfWork === "") {
      form.setError("typeOfWork", {
        type: "value",
        message: "Type of work is required",
      });
      hasError = true;
    }
    if (hasError || !user) {
      return;
    }
    mutate({
      body: {
        ...values,
        technologies,
        userId: user._id,
      } as NewOfferType,
    });
  }
  return {
    handleSubmit,
    form,
    handleTechnologies,
    technologies,
  };
}
