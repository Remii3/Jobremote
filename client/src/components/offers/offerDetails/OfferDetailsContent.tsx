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
  Loader2,
  FilePenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
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
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

interface OfferDetailsContentProps {
  offer: OfferType;
  isMobile: boolean;
  toggleSuccessApplied: () => void;
}

const dropzone = {
  accept: {
    "application/pdf": [".pdf", ".doc", ".docx"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

const applicationSchema = z
  .object({
    name: z.string().min(1, { message: "First and last name is required." }),
    email: z.string().min(1, { message: "Email is required." }).email(),
    description: z.string().optional(),
    cv: z
      .array(
        z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, {
          message: "File size must be less than 5MB",
        })
      )
      .max(1, { message: "Only one file is allowed." })
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.cv === null) {
        return false;
      }
      return true;
    },
    {
      path: ["cv"],
      message: "CV is required.",
    }
  );

export default function OfferDetailsContent({
  offer,
  isMobile,
  toggleSuccessApplied,
}: OfferDetailsContentProps) {
  const { user, fetchUserData } = useUser();
  const { formatCurrency, currency } = useCurrency();

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      cv: null,
    },
  });

  const {
    mutate: applyForOffer,
    error,
    isLoading,
  } = client.offers.offerApply.useMutation({
    onSuccess: () => {
      fetchUserData();
      form.reset();
      toggleSuccessApplied();
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

  function submitApplicationHandler(values: z.infer<typeof applicationSchema>) {
    if (values.cv === null) return;
    const applyFormData = new FormData();
    applyFormData.append("name", values.name);
    applyFormData.append("email", values.email);
    applyFormData.append("description", values.description || "");
    applyFormData.append("offerId", offer._id);
    applyFormData.append("cv", values.cv[0]);
    if (user) {
      applyFormData.append("userId", user._id);
    }
    applyForOffer({
      body: applyFormData,
    });
  }

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        description: user.description,
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form
        className="space-y-3 flex flex-col h-full pt-3"
        onSubmit={form.handleSubmit(submitApplicationHandler)}
        encType="multipart/form-data"
      >
        <div className="px-3 space-y-3">
          <div className="lg:p-[25px] p-4 bg-gradient-to-br shadow from-indigo-500  to-violet-400  dark:from-indigo-800 dark:to-violet-700 lg:rounded-lg w-full space-y-4">
            <div className="flex gap-2 justify-between flex-wrap ">
              <div className="flex gap-4">
                {offer.logo ? (
                  <div className="rounded-full overflow-hidden bg-background border border-input">
                    <Image
                      src={offer.logo}
                      alt="Company logo"
                      height={60}
                      width={60}
                      className="object-scale-down h-16 w-16 object-center"
                    />
                  </div>
                ) : (
                  <div className="rounded-full overflow-hidden bg-background border border-input">
                    <div className="h-16 w-16 bg-muted"></div>
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    {offer.title}
                  </h2>
                  <p className="flex items-center gap-2 text-white font-medium">
                    <Building2 className="h-5 w-5" />
                    <span>{offer.companyName}</span>
                  </p>
                </div>
              </div>
              <p className="p-3 bg-violet-600/50 dark:bg-violet-800/50 font-medium text-lg text-white flex items-center rounded-md">
                <Wallet className="h-6 w-6 mr-2" />
                <span>{formatCurrency(offer.minSalary, currency)}</span>
                <span className="px-1">-</span>
                <span>{formatCurrency(offer.maxSalary, currency)}</span>
              </p>
              {isMobile && (
                <div className="flex items-center justify-end absolute top-2 right-2">
                  <DialogPrimitive.Close className="bg-white rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground text-[hsl(224,71.4%,4.1%)]">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
              )}
            </div>
          </div>
          <div className="px-4 lg:px-0 grid gap-4 grid-rows-2 grid-cols-2 sm:grid-rows-1 sm:grid-cols-4 lg:grid-rows-2 lg:grid-cols-2 xl:grid-rows-1 xl:grid-cols-4">
            <div className="flex bg-green-50 dark:bg-green-700/50 rounded-md p-3 items-center justify-start h-20 shadow">
              <FileText className="h-full w-10 text-teal-400/90 mr-2" />
              <p className="flex flex-col">
                <span className="font-medium text-teal-400/90 text-sm">
                  Contract
                </span>
                {offer.contractType}
              </p>
            </div>
            <div className="flex bg-sky-50 dark:bg-sky-700/50 p-3 rounded-md items-center justify-start h-20 shadow">
              <MapPin className="h-full w-10 mr-2 text-sky-400/90" />
              <p className="flex flex-col">
                <span className="font-medium text-sky-400/90 text-sm">
                  Localization
                </span>
                {offer.localization}
              </p>
            </div>
            <div className="flex bg-indigo-50 dark:bg-indigo-700/50 p-3 rounded-md items-center justify-start h-20 shadow">
              <ArrowBigUpDash className="h-12 w-10 mr-2 text-indigo-400/90" />
              <p className="flex flex-col">
                <span className="text-indigo-400/90 font-medium text-sm">
                  Experience
                </span>
                {offer.experience}
              </p>
            </div>
            <div className="flex bg-amber-50 dark:bg-amber-700/50 rounded-md p-3 items-center justify-start h-20 shadow">
              <Gauge className="h-full w-10 mr-2 text-amber-400/90" />
              <p className="flex flex-col">
                <span className="font-medium text-amber-400/90 text-sm">
                  Employment
                </span>
                {offer.employmentType}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6 px-3 flex-grow">
          <div className="px-4 lg:px-0">
            <h3 className="text-2xl font-medium mb-2">Tech stack</h3>
            <div className="flex gap-2 flex-wrap">
              {offer.technologies &&
                offer.technologies.map((technology) => (
                  <Badge
                    key={technology}
                    variant={"outline"}
                    className="text-xs font-medium border-2"
                  >
                    {technology}
                  </Badge>
                ))}
            </div>
          </div>
          <div className="px-4 lg:px-0">
            <h3 className="text-2xl font-medium mb-2">Job description</h3>
            <div
              id="offerContent"
              tabIndex={0}
              aria-label="Scrollable offer content"
              className="prose max-w-[85ch] text-foreground"
              dangerouslySetInnerHTML={{ __html: offer.content }}
            />
          </div>
          <div className="px-4 lg:px-0">
            <h3 className="text-2xl font-medium mb-2">Apply for this job</h3>
            <div className="space-y-4">
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
                        <Input className="rounded-md" />
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
                    </FormLabel>
                    <FormControl {...field}>
                      <Textarea className="rounded-md" />
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
                    <FormLabel htmlFor="">
                      Attach your CV <span className="text-red-400">*</span>
                    </FormLabel>
                    <FileUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      dropzoneOptions={dropzone}
                      reSelect
                    >
                      <FileInput>
                        <div className="p-5 border-2 border-dashed rounded-md flex items-center gap-3">
                          {field.value && field.value.length > 0 ? (
                            <>
                              <FilePenIcon className="h-8 w-8" />
                              <span>{field.value[0].name}</span>
                            </>
                          ) : (
                            <>
                              <FileIcon className="h-8 w-8" />
                              <span>Add CV</span>
                            </>
                          )}
                        </div>
                      </FileInput>
                      {field.value && field.value.length > 0 && (
                        <FileUploaderContent>
                          {field.value.map((file, i) => (
                            <FileUploaderItem
                              key={i}
                              index={i}
                              className="p-4 flex items-center justify-center"
                              aria-roledescription={`file ${i + 1} containing ${
                                file.name
                              }`}
                            >
                              <div>{file.name}</div>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      )}
                    </FileUploader>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormRootError />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 right-0 border-t border-t-input bg-background flex justify-between px-4 lg:px-3 py-3 h-[72px] w-full">
          <div>
            <div className="flex font-medium text-green-500">
              <span>{formatCurrency(offer.minSalary, currency)}</span>
              <span className="px-1">-</span>
              <span>{formatCurrency(offer.maxSalary, currency)}</span>
            </div>
            <span className="text-slate-500">{offer.companyName}</span>
          </div>
          <Button
            variant={"default"}
            className="relative"
            aria-live="polite"
            disabled={isLoading}
          >
            <Loader2
              className={`absolute w-6 h-6 animate-spin transition-opacity ${
                isLoading ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={isLoading ? "false" : "true"}
            />
            <span
              className={`transition-opacity ${
                isLoading ? "opacity-0" : "opacity-100"
              }`}
              aria-hidden={isLoading ? "true" : "false"}
            >
              Apply
            </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
