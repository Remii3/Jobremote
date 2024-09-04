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
import { OfferType } from "@/types/types";
import { useState } from "react";

export const formSchemaTypes = OfferSchema.extend({
  title: z.string(),
  content: z.string(),
  experience: z.enum([...experience, ""]),
  localization: z.enum([...localizations, ""]),
  typeOfWork: z.enum([...typeOfWork, ""]),
  employmentType: z.enum([...emplomentTypes, ""]),
  technologies: z.array(z.enum([...allowedTechnologies]).optional()),
});

interface useEditOfferTypes {
  defaultData?: OfferType | null;
}
type TechnologiesTypes = z.infer<typeof formSchemaTypes>["technologies"];

export default function useEditOffer({ defaultData }: useEditOfferTypes) {
  const [technologies, setTechnologies] = useState<TechnologiesTypes>(
    defaultData?.technologies || []
  );

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

  return {
    form,
    handleTechnologies,
    technologies,
  };
}
