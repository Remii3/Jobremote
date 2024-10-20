"use clinet";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Badge } from "../ui/badge";
import useGetAvailableLocalizations from "@/hooks/useGetAvailableLocalizations";
import useGetAvailableTechnologies from "@/hooks/useGetAvailableTechnologies";
import useGetAvailableEmploymentTypes from "@/hooks/useGetAvailableEmploymentTypes";
import useGetAvailableExperiences from "@/hooks/useGetAvailableExperiences";
import useGetAvailableContractTypes from "@/hooks/useGetAvailableContractTypes";
import { useCurrency } from "@/context/CurrencyContext";
import { DropzoneOptions } from "react-dropzone";
import dynamic from "next/dynamic";
import { OfferType } from "@/types/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { client, cn, getOnlyDirtyFormFields } from "@/lib/utils";
import { UpdateOfferSchema } from "jobremotecontracts/dist/schemas/offerSchemas";
import { useToast } from "../ui/use-toast";
import { TOAST_TITLES } from "@/data/constant";
import { useEffect, useState } from "react";
import { QueryClient } from "@ts-rest/react-query/tanstack";
import AvatarUploader from "../ui/avatar-uploader";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

const OfferCkEditor = dynamic(
  () => import("../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

const editOfferSchema = UpdateOfferSchema.omit({
  _id: true,
  technologies: true,
  redirectLink: true,
})
  .extend({
    logo: z.array(z.instanceof(File)).optional().nullable(),
    redirectLink: z.string().url().optional(),
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

interface EditOfferPropsTypes {
  offerData: OfferType;
  queryClient: QueryClient;
  handleChangeCurrentEditOffer: (offerId: string | null) => void;
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
  queryClient,
  handleChangeCurrentEditOffer,
}: EditOfferPropsTypes) {
  const { toast } = useToast();
  const [selectedLogo, setSelectedLogo] = useState<File[] | null>(null);
  const [technologies, setTechnologies] = useState<string[]>(
    offerData.technologies
  );
  const [techOpen, setTechOpen] = useState(false);

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
      redirectLink: "",
    },
  });

  const { mutate: updateOffer, isPending: updateOfferIsLoading } =
    client.offers.updateOffer.useMutation({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["userOffersList"] });
        queryClient.invalidateQueries({ queryKey: ["offersList"] });
        toast({
          title: TOAST_TITLES.SUCCESS,
          description: "Offer information has been updated successfully.",
        });
        handleChangeCurrentEditOffer(null);
      },
      onError: (error) => {
        if (error.status === 404 || error.status === 500) {
          form.setError("root", {
            type: "manual",
            message: error.body.msg,
          });
        } else {
          console.log("error", error);
          form.setError("root", {
            type: "manual",
            message: "Something went wrong. Please try again later.",
          });
        }
        toast({
          title: TOAST_TITLES.ERROR,
          description:
            "An error occurred while updating the offer information.",
          variant: "destructive",
        });
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
    updateOffer({ body: formData });
  }

  function handleTechnologies(technology: string) {
    setTechnologies((prevState) => {
      if (prevState.includes(technology)) {
        return prevState.filter((tech) => tech !== technology);
      }
      return [...prevState, technology];
    });
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
      });
    }
  }, [form, offerData]);

  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  function handleChangeLogo(newLogo: File[] | null) {
    setSelectedLogo(newLogo);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-2 md:col-span-4 overflow-y-auto"
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
              oldFile={offerData.logo}
            />
            <FormMessage />
          </div>
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
        <div className="space-y-3">
          <Popover open={techOpen} onOpenChange={setTechOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={techOpen}
                className="w-[200px] justify-between"
              >
                Technology
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search technology..." />
                <CommandList>
                  <CommandEmpty>No technology found.</CommandEmpty>
                  <CommandGroup>
                    {avTechnologies &&
                      avTechnologies.body.technologies.map((tech) => (
                        <CommandItem
                          key={tech._id}
                          value={tech.name}
                          onSelect={(currentValue) => {
                            handleTechnologies(currentValue);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              technologies.includes(tech.name)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {tech.name}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {technologies.length > 0 && (
            <ul className="flex gap-3">
              {technologies.map((tech: string) => (
                <li key={tech}>
                  <button
                    type="button"
                    onClick={() => handleTechnologies(tech)}
                  >
                    <Badge variant={"outline"} className="py-1 px-3">
                      {tech}
                    </Badge>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <FormField
            control={form.control}
            name="redirectLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Redirect link</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  If you want to redirect the user to a specific page in order
                  to fill your company application form, you can provide a link
                  here.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
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
            onClick={() => handleChangeCurrentEditOffer(null)}
          >
            Go back
          </Button>
        </div>
        <FormRootError />
      </form>
    </Form>
  );
}
