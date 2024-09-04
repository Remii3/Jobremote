"use client";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import Image from "next/image";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowBigUpDash,
  Building2,
  FileText,
  Gauge,
  MapPin,
  Wallet,
  X,
  FilePlus as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { client } from "@/lib/utils";
import { DropzoneOptions } from "react-dropzone";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/extension/file-upload";

interface OfferDetailsContentProps {
  offer: OfferType;
  isMobile: boolean;
}

const dropzone = {
  accept: {
    "application/pdf": [".pdf", ".doc", ".docx"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

const applicationSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().min(1, { message: "Email is required." }).email(),
  description: z.string().optional(),
  cv: z
    .array(
      z.instanceof(File).refine((file) => file.size < 4 * 1024 * 1024, {
        message: "File size must be less than 4MB",
      })
    )
    .max(1, { message: "Only one file is allowed." })
    .nullable(),
});

export default function OfferDetailsContent({
  offer,
  isMobile,
}: OfferDetailsContentProps) {
  const { formatCurrency, currency } = useCurrency();
  const { mutate: applyForOffer } = client.offers.offerApply.useMutation({
    onSuccess: () => {},
  });

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      cv: null,
    },
  });

  function submitApplicationHandler(values: z.infer<typeof applicationSchema>) {
    console.log("offer._id", typeof offer._id);
    const testFormData = new FormData();
    testFormData.append("name", values.name);
    testFormData.append("email", values.email);
    testFormData.append("description", values.description || "");
    testFormData.append("offerId", offer._id);
    testFormData.append("cv", values.cv);
    applyForOffer({
      // body: {
      //   email: values.email,
      //   name: values.name,
      //   description: values.description,
      //   offerId: offer._id,
      //   cv: values.cv,
      // },
      body: testFormData,
    });
  }

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(submitApplicationHandler)}
        encType="multipart/form-data"
      >
        <div className="lg:p-6 p-4 bg-gradient-to-br from-indigo-500  to-violet-400 lg:rounded-md w-full space-y-4">
          {isMobile && (
            <div className="flex items-center justify-end">
              <DialogPrimitive.Close className="bg-white rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          )}
          <div className="flex gap-2 justify-between flex-wrap">
            <div className="flex gap-4">
              <Image src="/" alt="Company logo" height={60} width={60} />
              <div className="space-y-2 ">
                <h2 className="text-2xl font-semibold text-white">
                  {offer.title}
                </h2>
                <p className="flex items-center gap-2 text-white font-medium">
                  <Building2 className="h-5 w-5" />
                  <span>Company name</span>
                </p>
              </div>
            </div>
            <p className="p-3 bg-violet-600/50 font-medium text-lg text-white flex items-center rounded-lg">
              <Wallet className="h-6 w-6 mr-2" />
              <span>{formatCurrency(offer.minSalary, currency)}</span>
              <span className="px-1">-</span>
              <span>{formatCurrency(offer.maxSalary, currency)}</span>
            </p>
          </div>
        </div>
        <div className="px-4 lg:px-0 grid gap-4 grid-rows-2 grid-cols-2 sm:grid-rows-1 sm:grid-cols-4 lg:grid-rows-2 lg:grid-cols-2 xl:grid-rows-1 xl:grid-cols-4">
          <div className="flex bg-green-50 rounded-sm p-3">
            <FileText className="h-full w-10 text-teal-400/90 mr-2" />
            <p className="flex flex-col">
              <span className="font-medium text-teal-400/90 text-sm">
                Work type
              </span>
              {offer.typeOfWork}
            </p>
          </div>
          <div className="flex bg-sky-50 p-3 rounded-sm">
            <MapPin className="h-full w-10 mr-2 text-sky-400/90" />
            <p className="flex flex-col">
              <span className="font-medium text-sky-400/90 text-sm">
                Localization
              </span>
              {offer.localization}
            </p>
          </div>
          <div className="flex bg-indigo-50 p-3 rounded-sm">
            <ArrowBigUpDash className="h-12 w-10 mr-2 text-indigo-400/90" />
            <p className="flex flex-col">
              <span className="text-indigo-400/90 font-medium text-sm">
                Experience
              </span>
              {offer.experience}
            </p>
          </div>
          <div className="flex bg-amber-50 rounded-sm p-3">
            <Gauge className="h-full w-10 mr-2 text-amber-400/90" />
            <p className="flex flex-col">
              <span className="font-medium text-amber-400/90 text-sm">
                Employment
              </span>
              {offer.employmentType}
            </p>
          </div>
        </div>
        <div className="px-4 lg:px-0">
          <h3 className="text-xl mb-2">Tech stack</h3>
          <div className="flex gap-2 flex-wrap">
            {offer.technologies &&
              offer.technologies.map((technology) => (
                <Badge
                  key={technology}
                  variant={"outline"}
                  className="text-sm font-medium border-2 rounded-sm"
                >
                  {technology}
                </Badge>
              ))}
          </div>
        </div>
        <div className="px-4 lg:px-0">
          <h3 className="text-xl mb-2">Job description</h3>
          <p
            id="offerContent"
            tabIndex={0}
            aria-label="Scrollable offer content"
            className="prose max-w-[85ch]"
          >
            {offer.content}
          </p>
        </div>
        <div className="px-4 lg:px-0">
          <h3 className="text-xl mb-2">Apply for this job</h3>
          <div className="mb-8 space-y-2">
            <div className="flex gap-8 w-full justify-between">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="">
                      First and last name{" "}
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl {...field}>
                      <Input />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="">
                      Email <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl {...field}>
                      <Input />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="">
                    Introduce yourself (Github/Linkedin link){" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl {...field}>
                    <Textarea />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="cv"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    dropzoneOptions={dropzone}
                    reSelect
                  >
                    <FileInput>
                      <div className="p-5 border-2 border-dashed hover:border-zinc-600 transition rounded-md flex items-center gap-3">
                        <FileIcon className="h-8 w-8" />
                        <span>Add CV</span>
                      </div>
                    </FileInput>
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
          </div>
        </div>
        <div className="sticky bottom-0 right-0 bg-white flex justify-between px-4 lg:px-0 py-3">
          <div>
            <div className="flex">
              <span>{formatCurrency(offer.minSalary, currency)}</span>
              <span className="px-1">-</span>
              <span>{formatCurrency(offer.maxSalary, currency)}</span>
            </div>
            <span className="text-slate-500">{offer.typeOfWork}</span>
          </div>
          <Button variant={"default"}>Apply</Button>
        </div>
      </form>
    </Form>
  );
}
