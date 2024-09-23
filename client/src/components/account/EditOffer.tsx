import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { OfferType } from "@/types/types";
import { Separator } from "../ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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
import { offerSchema } from "@/schemas/offerSchemas";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/extension/file-upload";
import Image from "next/image";
import { DropzoneOptions } from "react-dropzone";

interface EditOfferPropsTypes {
  setEditOfferData: (state: null) => void;
  offerData: OfferType;
  handleUpdateOffer: (values: any) => void;
}
const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 10024,
} satisfies DropzoneOptions;

const editOfferSchema = offerSchema.partial();

export default function EditOffer({
  setEditOfferData,
  offerData,
  handleUpdateOffer,
}: EditOfferPropsTypes) {
  console.log(offerData);
  const form = useForm<z.infer<typeof editOfferSchema>>({
    resolver: zodResolver(editOfferSchema),
    defaultValues: {
      title: offerData.title || "",
      content: offerData.content || "",
      experience: offerData.experience || "",
      employmentType: offerData.employmentType || "",
      companyName: offerData.companyName || "",
      contractType: offerData.contractType || "",
      localization: offerData.localization || "",
      minSalary: offerData.minSalary || 0,
      maxSalary: offerData.maxSalary || 0,
      currency: offerData.currency || "USD",
      technologies: offerData.technologies || [],
      logo: null,
      pricing: offerData.pricing || "basic",
    },
  });

  function resetOfferData() {
    setEditOfferData(null);
  }

  function handleSubmit(values: z.infer<typeof editOfferSchema>) {
    console.log(values);
    handleUpdateOffer(values);
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
  function test() {
    console.log(form.formState.errors);
  }
  console.log(avEmploymentTypes);
  console.log(offerData.employmentType);
  return (
    <section className="space-y-6">
      <div>
        <div className="flex gap-4 items-center">
          <Button
            variant={"outline"}
            size={"icon"}
            type="button"
            onClick={() => {
              setEditOfferData(null);
            }}
            className={`rounded-full h-auto w-auto p-2`}
          >
            <ArrowLeft className="h-[18px] w-[18px]" />
          </Button>
          <h2 className="text-3xl font-semibold">{offerData.title}</h2>
        </div>
        <Separator className="my-2" />
      </div>

      <div>
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
                            className="p-0 size-20"
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
                    {offerData.logo && (
                      <Image
                        src={offerData.logo}
                        alt="Offer post company logo"
                        width={100}
                        height={100}
                      />
                    )}
                  </FileUploader>
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
              <Button type="submit" variant={"default"} className="">
                Update offer
              </Button>
              <Button
                type="button"
                variant={"outline"}
                // onClick={resetOfferData}
                onClick={test}
              >
                Go back
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
