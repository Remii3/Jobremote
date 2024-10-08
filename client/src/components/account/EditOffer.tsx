"use clinet";

import { Button } from "../ui/button";
import { ArrowLeft, FileEditIcon, FilePlusIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import { useCurrency } from "@/context/CurrencyContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/extension/file-upload";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";
import dynamic from "next/dynamic";
import { UpdateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { client, getOnlyDirtyFormFields } from "@/lib/utils";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
const OfferCkEditor = dynamic(
  () => import("../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

interface EditOfferPropsTypes {
  handleChangeCurrentEditOffer: (offerId: null) => void;
  offerDataId: string;
}
const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

const editOfferSchema = UpdateOfferSchema.omit({ _id: true }).extend({
  logo: z.array(z.instanceof(File)).optional().nullable(),
  technologies: z.array(z.string()).optional(),
});

export default function EditOffer({
  handleChangeCurrentEditOffer,
  offerDataId,
}: EditOfferPropsTypes) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof editOfferSchema>>({
    resolver: zodResolver(editOfferSchema),
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
      technologies: [],
      logo: [],
    },
  });

  const { data: offerData, isLoading } = client.users.getUserOffer.useQuery(
    ["userOffer"],
    { query: { _id: offerDataId } }
  );

  const { mutate: updateOffer, isPending: updateOfferIsLoading } =
    client.offers.updateOffer.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
        handleChangeCurrentEditOffer(null);
        queryClient.invalidateQueries({ queryKey: ["offersList"] });
      },
      onError: (error) => {
        if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        }
      },
    });

  function resetOfferData() {
    handleChangeCurrentEditOffer(null);
  }

  function handleSubmit(values: z.infer<typeof editOfferSchema>) {
    if (!offerData) return;
    const updatedFieldsValues = getOnlyDirtyFormFields(values, form);

    const formData = new FormData();
    Object.entries(updatedFieldsValues).forEach(([key, value]) => {
      if (key === "logo" && value) {
        if (Array.isArray(value) && value.length > 0) {
          formData.append("logo", value[0]);
        }
      } else {
        formData.append(key, value as string);
      }
    });

    formData.append("_id", offerData.body.offer._id);
    updateOffer({ body: formData });
  }

  function handleTechnologies(technology: string) {
    const currentTechnologies = form.getValues("technologies") || [];
    const updatedTechnologies = currentTechnologies.includes(technology)
      ? currentTechnologies.filter((tech) => tech !== technology)
      : [...currentTechnologies, technology];

    form.setValue("technologies", updatedTechnologies);
  }

  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  useEffect(() => {
    if (offerData) {
      form.reset({
        title: offerData.body.offer.title,
        content: offerData.body.offer.content,
        experience: offerData.body.offer.experience,
        employmentType: offerData.body.offer.employmentType,
        companyName: offerData.body.offer.companyName,
        contractType: offerData.body.offer.contractType,
        localization: offerData.body.offer.localization,
        minSalary: offerData.body.offer.minSalary,
        maxSalary: offerData.body.offer.maxSalary,
        currency: offerData.body.offer.currency,
        technologies: offerData.body.offer.technologies,
        logo: [],
      });
    }
  }, [form, offerData]);
  console.log("data: ", offerData);
  return (
    <section className="space-y-6">
      <div>
        <div className="flex gap-4 items-center">
          <Button
            variant={"outline"}
            size={"icon"}
            type="button"
            onClick={() => {
              handleChangeCurrentEditOffer(null);
            }}
            className={`rounded-full h-auto w-auto p-2`}
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Button>
          {offerData ? (
            <h2 className="text-3xl font-semibold">
              {offerData.body.offer.title}
            </h2>
          ) : (
            <Skeleton className="w-1/2" />
          )}
        </div>
        <Separator className="my-2" />
      </div>

      <div>
        {offerData && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="px-4 w-full space-y-6"
            >
              <div className="flex gap-8 flex-col md:flex-row">
                <FormField
                  name="logo"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div>
                        <FormLabel>Company logo</FormLabel>
                      </div>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        dropzoneOptions={dropzone}
                        reSelect
                        className="h-full"
                      >
                        {(!field.value ||
                          (field.value && field.value.length <= 0)) && (
                          <FileInput className="h-full">
                            {offerData.body.offer.logo ? (
                              <div className="group h-full min-h-[128px] min-w-[128px] max-w-[128px] relative">
                                <Image
                                  src={offerData.body.offer.logo.url}
                                  alt="Company current uploaded logo"
                                  fill
                                  quality={100}
                                  className="h-full w-full aspect-square rounded-full"
                                />
                                <div className="group-hover:opacity-50 rounded-full bg-black opacity-0 h-full w-full absolute top-0 left-0 transition-opacity"></div>
                                <button
                                  type="button"
                                  className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FileEditIcon className="hidden group-hover:block w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:stroke-white duration-200 ease-in-out" />
                                </button>
                              </div>
                            ) : (
                              <div className="group p-4 h-full border-2 border-dashed rounded-full flex items-center justify-center gap-1 min-w-[128px] min-h-[128px] max-w-[128px]">
                                <FilePlusIcon className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition" />
                              </div>
                            )}
                          </FileInput>
                        )}

                        {field.value && field.value.length > 0 && (
                          <FileUploaderContent className="w-full h-full">
                            {field.value.map((file, i) => (
                              <FileUploaderItem
                                key={i}
                                index={i}
                                aria-roledescription={`file ${
                                  i + 1
                                } containing ${file.name}`}
                                absoluteRemove
                                className="p-0 rounded-full min-h-[128px] min-w-[128px] max-w-[128px] relative"
                              >
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="object-cover rounded-full aspect-square min-w-[128px]"
                                  fill
                                />
                              </FileUploaderItem>
                            ))}
                          </FileUploaderContent>
                        )}
                      </FileUploader>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4 flex-grow flex flex-col justify-between h-full">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-8 flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="contractType"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]">
                      <FormLabel>Contract type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Contract type" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {avContractTypes &&
                            avContractTypes.body.contractTypes.map(
                              (workType) => (
                                <SelectItem
                                  key={workType._id}
                                  value={workType.name}
                                >
                                  {workType.name}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="localization"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]">
                      <FormLabel>Localization</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Localization" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {avLocalizations &&
                            avLocalizations.body.localizations.map(
                              (localization) => (
                                <SelectItem
                                  key={localization._id}
                                  value={localization.name}
                                >
                                  {localization.name}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-8 flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]">
                      <FormLabel>Experience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Experience" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {avExperiences &&
                            avExperiences.body.experiences.map((exp) => (
                              <SelectItem key={exp._id} value={exp.name}>
                                {exp.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]">
                      <FormLabel>Employment type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Employment type" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {avEmploymentTypes &&
                            avEmploymentTypes.body.employmentTypes.map(
                              (employmentType) => (
                                <SelectItem
                                  key={employmentType._id}
                                  value={employmentType.name}
                                >
                                  {employmentType.name}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <OfferCkEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-8 flex-col md:flex-row">
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min salary</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max salary</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem className="min-w-[200px]">
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {allowedCurrencies.map((currency) => (
                            <SelectItem key={currency} value={currency}>
                              {currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start mt-2">
                    <DropdownMenu>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"outline"} className="gap-2">
                            <span>Add tech stack</span>
                            {field.value && field.value.length > 0 && (
                              <Badge variant={"secondary"}>
                                {field.value.length}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                      </FormControl>
                      <FormMessage />
                      <DropdownMenuContent>
                        {avTechnologies &&
                          avTechnologies.body.technologies.map((technology) => (
                            <DropdownMenuCheckboxItem
                              key={technology._id}
                              checked={
                                field.value &&
                                field.value.includes(technology.name)
                              }
                              onCheckedChange={() =>
                                handleTechnologies(technology.name)
                              }
                              preventCloseOnSelect
                            >
                              {technology.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {field.value && field.value.length > 0 && (
                      <ul className="flex gap-2">
                        {field.value.map((tech) => (
                          <li key={tech}>
                            <button
                              type="button"
                              onClick={() => handleTechnologies(tech)}
                            >
                              <Badge variant={"outline"}>{tech}</Badge>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </FormItem>
                )}
              />
              <div className="flex mt-4 gap-4">
                <Button
                  type="submit"
                  variant={"default"}
                  disabled={updateOfferIsLoading || !form.formState.isDirty}
                  showLoader
                  isLoading={updateOfferIsLoading}
                >
                  Update offer
                </Button>
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={resetOfferData}
                >
                  Go back
                </Button>
              </div>
              <FormRootError />
            </form>
          </Form>
        )}
        {!offerData && isLoading && (
          <div>
            <Skeleton className="h-4" />
          </div>
        )}
      </div>
    </section>
  );
}
