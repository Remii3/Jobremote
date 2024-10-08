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

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/extension/file-upload";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";
import dynamic from "next/dynamic";

import { Skeleton } from "../ui/skeleton";
const OfferCkEditor = dynamic(
  () => import("../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

interface EditOfferPropsTypes {
  offerData: any;
  form: any;
  handleSubmit: (values: any) => void;
  updateOfferIsLoading: boolean;
  resetOfferData: () => void;
  handleTechnologies: (value: any) => void;
}
const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

export default function EditOffer({
  offerData,
  form,
  handleSubmit,
  updateOfferIsLoading,
  resetOfferData,
  handleTechnologies,
}: EditOfferPropsTypes) {
  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  return (
    <section className="space-y-6">
      <div>
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
                          {field.value.map((file: any, i: number) => (
                            <FileUploaderItem
                              key={i}
                              index={i}
                              aria-roledescription={`file ${i + 1} containing ${
                                file.name
                              }`}
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
                      defaultValue={"asd"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Contract type" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {avContractTypes &&
                          avContractTypes.body.contractTypes.map((workType) => (
                            <SelectItem
                              key={workType._id}
                              value={workType.name}
                            >
                              {workType.name}
                            </SelectItem>
                          ))}
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
                      {field.value.map((tech: string) => (
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
      </div>
    </section>
  );
}
