import { client } from "@/lib/utils";
import {
  allowedTechnologies,
  experience,
  localizations,
  OfferSchema,
  typeOfWork,
} from "../../../server/src/schemas/offerSchemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OfferType } from "@/types/types";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { useState } from "react";

const formSchemaTypes = OfferSchema.extend({
  title: z.string(),
  content: z.string(),
  experience: z.enum([...experience, ""]),
  localization: z.enum([...localizations, ""]),
  typeOfWork: z.enum([...typeOfWork, ""]),
  technologies: z.array(z.enum([...allowedTechnologies]).optional()),
});

interface useAddNewOfferTypes {
  callback: () => void;
}
type TechnologiesTypes = z.infer<typeof formSchemaTypes>["technologies"];
export default function useAddNewOffer({ callback }: useAddNewOfferTypes) {
  const [technologies, setTechnologies] = useState<TechnologiesTypes>([]);
  const { mutate } = client.offers.createOffer.useMutation();
  const queryClient = useQueryClient();

  const formSchema = OfferSchema.omit({ _id: true });

  const form = useForm<z.infer<typeof formSchemaTypes>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      experience: "",
      localization: "",
      typeOfWork: "",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
    },
  });
  function handleTechnologies(technology: TechnologiesTypes[number]) {
    if (technologies.includes(technology)) {
      setTechnologies(technologies.filter((tech) => tech !== technology));
    } else {
      setTechnologies([...technologies, technology]);
    }
  }
  function handleSubmit(values: z.infer<typeof formSchemaTypes>) {
    let hasError = false;
    console.log("first");

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

    if (hasError) {
      return;
    }
    mutate({
      body: {
        ...values,
        technologies,
      } as OfferType,
    });
    form.reset();
    queryClient.invalidateQueries(["offersList"]);
    callback();
  }
  return {
    handleSubmit,
    form,
    handleTechnologies,
    technologies,
  };
}
