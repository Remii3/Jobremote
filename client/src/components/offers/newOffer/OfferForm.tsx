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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { DropzoneOptions } from "react-dropzone";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import { useCurrency } from "@/context/CurrencyContext";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ClientOfferFormSchema } from "@/schema/OfferSchema";
import dynamic from "next/dynamic";
import AvatarUploader from "@/components/ui/avatar-uploader";
const OfferCkEditor = dynamic(
  () => import("../../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 10024,
} satisfies DropzoneOptions;

type OfferFormPropsTypes = {
  form: UseFormReturn<z.infer<typeof ClientOfferFormSchema>>;
  handleSubmit: (values: any) => void;
  handleTechnologies: (tech: string) => void;
  selectedLogo: File[] | null;
  handleChangeLogo: (newLogo: File[] | null) => void;
};

const OfferForm = ({
  form,
  handleSubmit,
  handleTechnologies,
  selectedLogo,
  handleChangeLogo,
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
              <div className="flex flex-col gap-2">
                <div>
                  <Label>Company logo</Label>
                </div>
                <AvatarUploader
                  dropzoneOptions={dropzone}
                  onValueChange={(newValue) => handleChangeLogo(newValue)}
                  value={selectedLogo}
                />
                <FormMessage />
              </div>
              <div className="space-y-4 flex-grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-400">*</span>
                      </FormLabel>
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
                      <FormLabel>
                        Company name <span className="text-red-400">*</span>
                      </FormLabel>
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
                    <FormLabel>
                      Type of contract <span className="text-red-400">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Localization <span className="text-red-400">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Experience <span className="text-red-400">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Employment type <span className="text-red-400">*</span>
                    </FormLabel>
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
                  <FormLabel>
                    Content <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <OfferCkEditor
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground lg:block hidden">
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
                    <FormLabel>
                      Min salary <span className="text-red-400">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Max salary <span className="text-red-400">*</span>
                    </FormLabel>
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
              <Button
                type="submit"
                variant={"default"}
                size={"lg"}
                disabled={!form.formState.isDirty}
              >
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
