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
import { useUser } from "@/context/UserContext";
import { useQueryClient } from "@ts-rest/react-query/tanstack";
import { offerSchema } from "@/schemas/offerSchemas";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { OfferCkEditor } from "@/components/ui/ckeditor";

const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 10024,
} satisfies DropzoneOptions;
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
);

const pricingOptions = [
  {
    name: "Basic",
    code: "basic",
    description: (
      <ul>
        <li>Basic offer</li>
        <li>Some other option</li>
      </ul>
    ),
    price: 100,
  },
  {
    name: "Standard",
    code: "standard",
    description: (
      <ul>
        <li>Standard offer</li>
        <li>Some other option</li>
      </ul>
    ),
    price: 200,
  },
  {
    name: "Premium",
    code: "premium",
    description: (
      <ul>
        <li>Premium offer</li>
        <li>Some other option</li>
      </ul>
    ),
    price: 300,
  },
];

const createNewOfferFormSchema = offerSchema.refine(
  (data) => {
    return data.maxSalary >= data.minSalary;
  },
  { message: "Max salary must be greater than min salary" }
);

const OfferForm = () => {
  const queryClient = useQueryClient();
  const { user, fetchUserData } = useUser();
  const { avLocalizations } = useGetAvailableLocalizations();
  const { avTechnologies } = useGetAvailableTechnologies();
  const { avEmploymentTypes } = useGetAvailableEmploymentTypes();
  const { avExperiences } = useGetAvailableExperiences();
  const { avContractTypes } = useGetAvailableContractTypes();
  const { allowedCurrencies } = useCurrency();

  const form = useForm<z.infer<typeof createNewOfferFormSchema>>({
    resolver: zodResolver(createNewOfferFormSchema),
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
      contractType: "",
      technologies: [],
      companyName: "",
      pricing: undefined,
    },
  });
  const { mutate: createOffer, isLoading } =
    client.offers.createOffer.useMutation({
      onSuccess: async (param) => {
        fetchUserData();
        const stripe = await stripePromise;
        if (!stripe) return;
        const { error } = await stripe.redirectToCheckout({
          sessionId: param.body.sessionId,
        });

        if (error) {
          console.error("Stripe error:", error);
        }
        queryClient.invalidateQueries(["offersList"]);
        form.reset();
      },
    });

  async function handleSubmit(values: z.infer<typeof offerSchema>) {
    if (!user) {
      return;
    }

    const formData = new FormData();

    if (values.logo) {
      formData.append("logo", values.logo[0]);
    }

    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("experience", values.experience);
    formData.append("employmentType", values.employmentType);
    formData.append("contractType", values.contractType);
    formData.append("localization", values.localization);
    formData.append("minSalary", values.minSalary.toString());
    formData.append("maxSalary", values.maxSalary.toString());
    formData.append("currency", values.currency);
    formData.append("userId", user._id);
    formData.append("technologies", JSON.stringify(values.technologies));
    formData.append("companyName", values.companyName);
    formData.append("pricing", values.pricing);

    createOffer({
      body: formData,
    });
  }

  const handleTechnologies = (technology: string) => {
    const currentTechnologies = form.getValues("technologies") || [];
    const updatedTechnologies = currentTechnologies.includes(technology)
      ? currentTechnologies.filter((tech) => tech !== technology)
      : [...currentTechnologies, technology];

    form.setValue("technologies", updatedTechnologies);
  };

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
                <Input {...field} type="number" min={1} />
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
                <Input {...field} type="number" min={1} />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pricing</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  {pricingOptions.map((option) => (
                    <FormItem key={option.name} className="relative">
                      <FormControl>
                        <RadioGroupItem
                          value={option.code}
                          className="absolute top-2 left-2"
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer">
                        <Card
                          className={`${
                            field.value === option.name &&
                            "ring-2 ring-ring ring-offset-2"
                          }`}
                        >
                          <CardHeader>
                            <CardTitle>{option.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {option.description}
                            <div className="mt-4">{option.price} USD</div>
                          </CardContent>
                        </Card>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex mt-4 gap-4">
          <Button type="submit" variant={"default"} disabled={isLoading}>
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
