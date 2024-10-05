"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-upload";
import { DropzoneOptions } from "react-dropzone";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import { useCurrency } from "@/context/CurrencyContext";
import Image from "next/image";
import { OfferCkEditor } from "@/components/ui/ckeditor";
import { FileIcon } from "lucide-react";

const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 10024,
} satisfies DropzoneOptions;

type OfferFormPropsTypes = {
  form: any;
  handleSubmit: (values: any) => void;
  handleTechnologies: (tech: string) => void;
};

const OfferForm = ({
  form,
  handleSubmit,
  handleTechnologies,
}: OfferFormPropsTypes) => {
  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  return (
    <div className="max-w-screen-2xl mx-auto ">
      <h2 className="text-3xl font-semibold">Post a new job</h2>

      <div className="flex gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="px-4 py-8 w-full space-y-6"
          >
            <div className="flex gap-8 flex-col md:flex-row">
              <FormField
                name="logo"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Company logo</FormLabel>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      dropzoneOptions={dropzone}
                      reSelect
                    >
                      {(!field.value ||
                        (field.value && field.value.length <= 0)) && (
                        <FileInput className="h-[200px] w-[200px]">
                          <div className="p-4 h-full border-2 border-dashed rounded-md flex items-center justify-center gap-3">
                            <FileIcon className="h-8 w-8" />
                            <span>Select image</span>
                          </div>
                        </FileInput>
                      )}
                      {field.value && field.value.length > 0 && (
                        <FileUploaderContent>
                          {field.value.map((file: any, i: any) => (
                            <FileUploaderItem
                              key={i}
                              index={i}
                              aria-roledescription={`file ${i + 1} containing ${
                                file.name
                              }`}
                              className="p-0 size-full"
                              absoluteRemove
                            >
                              <div className="aspect-square size-full">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className="object-cover rounded-md"
                                  fill
                                />
                              </div>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      )}
                    </FileUploader>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4 flex-grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" />
                      </FormControl>
                      <FormDescription>
                        You should type a title for your offer, for example:
                        Senior Java dev
                      </FormDescription>
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
                  <FormItem className="w-full">
                    <FormLabel>Type of contract</FormLabel>
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
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground">
                    Tip: Use shift + enter if you want to break the line and not
                    start a new paragraph
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-8 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="minSalary"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
                    <FormLabel>Max salary</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full">
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
            <div>
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start mt-2">
                    <DropdownMenu>
                      <Label>Technologies</Label>
                      <FormControl>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"outline"} className="gap-2">
                            <span>Add tech stack</span>
                            {field.value.length > 0 && (
                              <Badge variant={"secondary"}>
                                {field.value.length}
                              </Badge>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                      </FormControl>
                      <DropdownMenuContent>
                        {avTechnologies &&
                          avTechnologies.body.technologies.map((technology) => (
                            <DropdownMenuCheckboxItem
                              key={technology._id}
                              checked={field.value.includes(technology.name)}
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
                    <div className="pt-3">
                      {field.value && field.value.length > 0 && (
                        <ul className="flex gap-3">
                          {field.value.map((tech: string) => (
                            <li key={tech}>
                              <button
                                type="button"
                                onClick={() => handleTechnologies(tech)}
                              >
                                <Badge
                                  variant={"outline"}
                                  className="py-1 px-3"
                                >
                                  {tech}
                                </Badge>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex mt-4 gap-4">
              <Button type="submit" variant={"default"} size={"lg"}>
                Choose your model
              </Button>
            </div>
          </form>
        </Form>
        <div className="w-full hidden lg:block">
          <div className="bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center p-4 w-full h-[calc(100vh-67px)] sticky top-[67px]"></div>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;
