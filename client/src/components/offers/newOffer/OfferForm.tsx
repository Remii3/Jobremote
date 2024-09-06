"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
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
import { client } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { AllowedCurrenciesType } from "@/types/types";
import { offerSchema } from "@/schemas/offerSchemas";

const dropzone = {
  multiple: false,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

const OfferForm = () => {
  const [technologies, setTechnologies] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { user, fetchUserData } = useUser();

  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  const form = useForm<z.infer<typeof offerSchema>>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: "",
      content: "",
      experience: "",
      employmentType: "",
      localization: "",
      maxSalary: 0,
      currency: "USD",
      logo: null,
      minSalary: 0,
    },
  });
  const { mutate: createOffer } = client.offers.createOffer.useMutation({
    onSuccess: () => {
      fetchUserData();
      form.reset();
      queryClient.invalidateQueries(["offersList"]);
    },
  });

  function handleTechnologies(technology: string) {
    if (technologies.includes(technology)) {
      setTechnologies(technologies.filter((tech) => tech !== technology));
    } else {
      setTechnologies([...technologies, technology]);
    }
  }

  async function handleSubmit(values: z.infer<typeof offerSchema>) {
    if (!user) {
      return;
    }

    createOffer({
      body: {
        ...values,
        logo: values.logo,
        technologies,
        userId: user._id,
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
        <FormField
          name="logo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropzone}
                reSelect
              >
                <FileInput>Upload your logo</FileInput>
                {field.value && field.value.length > 0 && (
                  <FileUploaderContent>
                    {field.value.map((file, i) => (
                      <FileUploaderItem
                        key={i}
                        index={i}
                        aria-roledescription={`file ${i + 1} containing ${
                          file.name
                        }`}
                      >
                        <div className="aspect-square size-full">
                          {file.name}
                        </div>
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
                )}
              </FileUploader>
            </FormItem>
          )}
        />
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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
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
          name="contractType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of contract</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of work" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {avContractTypes &&
                    avContractTypes.body.contractTypes.map((workType) => (
                      <SelectItem key={workType._id} value={workType.name}>
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
          name="employmentType"
          render={({ field }) => (
            <FormItem>
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
        <FormField
          control={form.control}
          name="localization"
          render={({ field }) => (
            <FormItem>
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
                    avLocalizations.body.localizations.map((localization) => (
                      <SelectItem
                        key={localization._id}
                        value={localization.name}
                      >
                        {localization.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
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
        />
        <FormField
          control={form.control}
          name="technologies"
          render={() => (
            <FormItem className="flex flex-col items-start mt-2">
              <DropdownMenu>
                <Label>Technologies</Label>
                <FormControl>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="gap-2">
                      <span>Add tech stack</span>
                      {technologies.length > 0 && (
                        <Badge variant={"secondary"}>
                          {technologies.length}
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
                        checked={technologies.includes(technology.name)}
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
              {technologies.length > 0 && (
                <ul className="flex gap-2">
                  {technologies.map((tech) => (
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
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex mt-4 gap-4">
          <Button type="submit" variant={"default"} className="">
            Post new offer
          </Button>
          <Link href={"/"} className={buttonVariants({ variant: "outline" })}>
            Go back
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default OfferForm;
