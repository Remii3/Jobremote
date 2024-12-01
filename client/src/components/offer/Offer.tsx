import { useCurrency } from "@/context/CurrencyContext";
import { OfferType } from "@/types/types";
import {
  ArrowBigUpDash,
  Building2,
  FileIcon,
  FilePenIcon,
  FileText,
  Gauge,
  MapPin,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import { useOffer } from "./offer.hooks";
import { useMemo } from "react";
import Link from "next/link";
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

import { DropzoneOptions } from "react-dropzone";
import { Badge } from "../ui/badge";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "../ui/extension/file-upload";
import { Textarea } from "../ui/textarea";

type OfferProps = {
  offer: OfferType;
};

const dropzone = {
  accept: {
    "application/pdf": [".pdf", ".doc", ".docx"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 1024,
} satisfies DropzoneOptions;

export default function Offer({ offer }: OfferProps) {
  const {
    showOriginalPrice,
    toggleOriginalPrice,
    form,
    submitApplicationHandler,
    isPendingApplyForOffer,
  } = useOffer({
    offerId: offer._id,
  });
  const { salaryType, currency, formatCurrency } = useCurrency();

  const properMinSalary =
    salaryType === "yearly" ? offer.minSalaryYear : offer.minSalary;
  const properMaxSalary =
    salaryType === "yearly" ? offer.maxSalaryYear : offer.maxSalary;

  const formattedMinPrice = useMemo(() => {
    if (showOriginalPrice) {
      return formatCurrency(properMinSalary, offer.currency, false);
    } else {
      return formatCurrency(properMinSalary, offer.currency);
    }
  }, [showOriginalPrice, formatCurrency, properMinSalary, offer.currency]);

  const formattedMaxPrice = useMemo(() => {
    if (showOriginalPrice) {
      return formatCurrency(properMaxSalary, offer.currency, false);
    } else {
      return formatCurrency(properMaxSalary, offer.currency);
    }
  }, [showOriginalPrice, formatCurrency, properMaxSalary, offer.currency]);

  return (
    <Form {...form}>
      <form
        className="space-y-4 flex flex-col h-full"
        onSubmit={form.handleSubmit(submitApplicationHandler)}
        encType="multipart/form-data"
      >
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="p-5 bg-gradient-to-br h-[142px] justify-between flex-wrap gap-2 flex items-center shadow from-indigo-500  to-violet-400  dark:from-indigo-800 dark:to-violet-700 lg:rounded-lg w-full">
              <div className="flex gap-4">
                {offer.logo?.url ? (
                  <div className="rounded-full overflow-hidden bg-background border border-input h-16 w-16">
                    <Image
                      src={offer.logo.url}
                      alt="Company logo"
                      height={60}
                      width={60}
                      className="object-scale-down h-16 w-16 object-center"
                    />
                  </div>
                ) : (
                  <div className="rounded-full overflow-hidden bg-background border border-input h-16 w-16">
                    <div className="h-16 w-16 bg-muted"></div>
                  </div>
                )}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    {offer.title}
                  </h2>
                  <div className="flex gap-4">
                    <p className="flex items-center gap-2 text-white font-medium p-0">
                      <Building2 className="h-5 w-5" />
                      <span>{offer.companyName}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="py-3 px-5 bg-gradient-to-br from-violet-500/30 to-indigo-500/20  dark:to-indigo-500/30 dark:from-violet-400/20 font-medium text-lg text-white flex items-center gap-4 rounded-md backdrop-blur-md  shadow-black/30">
                <div className="flex flex-col gap-3 items-center">
                  <span className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 inline-block" />
                    <span>
                      <span>{formattedMinPrice}</span>
                      <span className="px-1">-</span>
                      <span>{formattedMaxPrice}</span>
                    </span>
                  </span>
                  {currency !== offer.currency && (
                    <Button
                      onClick={toggleOriginalPrice}
                      variant={"ghost"}
                      className="rounded-sm text-white hover:bg-violet-400/60 hover:text-white border border-white/20"
                    >
                      {showOriginalPrice ? "Show original" : "Show preferred"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 grid gap-6 grid-rows-2 grid-cols-2 sm:grid-rows-1 sm:grid-cols-4 lg:grid-rows-2 lg:grid-cols-2 xl:grid-rows-1 xl:grid-cols-4">
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
          <div className="px-4 space-y-10 flex-grow">
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
              <h3 className="text-2xl font-medium mb-2">Description</h3>
              <div
                tabIndex={0}
                aria-label="Scrollable offer content"
                className="prose max-w-[85ch] text-foreground"
                dangerouslySetInnerHTML={{ __html: offer.content }}
              />
            </div>
            {offer.requirements && (
              <div className="px-4 lg:px-0">
                <h3 className="text-2xl font-medium mb-2">Requirements</h3>
                <div
                  tabIndex={0}
                  aria-label="Scrollable offer content"
                  className="prose max-w-[85ch] text-foreground"
                  dangerouslySetInnerHTML={{ __html: offer.requirements }}
                />
              </div>
            )}
            {offer.benefits && (
              <div className="px-4 lg:px-0">
                <h3 className="text-2xl font-medium mb-2">Benefits</h3>
                <div
                  tabIndex={0}
                  aria-label="Scrollable offer content"
                  className="prose max-w-[85ch] text-foreground"
                  dangerouslySetInnerHTML={{ __html: offer.benefits }}
                />
              </div>
            )}
            {offer.duties && (
              <div className="px-4 lg:px-0">
                <h3 className="text-2xl font-medium mb-2">Duties</h3>
                <div
                  tabIndex={0}
                  aria-label="Scrollable offer content"
                  className="prose max-w-[85ch] text-foreground"
                  dangerouslySetInnerHTML={{ __html: offer.duties }}
                />
              </div>
            )}
            <div className="px-4 lg:px-0">
              <h3 className="text-2xl font-medium mb-2">Apply for this job</h3>
              {offer.redirectLink ? (
                <div className="flex flex-col gap-4 items-center">
                  <span>
                    If you are interested in this offer, click the button below
                    to apply via the company&apos;s website.
                  </span>

                  <Link
                    href={offer.redirectLink}
                    className={`${buttonVariants({
                      variant: "default",
                      size: "lg",
                    })}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Apply
                  </Link>
                </div>
              ) : (
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
                                  className="p-4 flex items-center justify-between"
                                  aria-roledescription={`file ${
                                    i + 1
                                  } containing ${file.name}`}
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
              )}
            </div>
          </div>
        </div>
        <div className="border-b border-b-input border-t border-t-input bg-background flex justify-between px-4 lg:px-4 py-4 h-[72px] w-full">
          <div>
            <div className="flex font-medium text-green-500">
              <span>{formattedMinPrice}</span>
              <span className="px-1">-</span>
              <span>{formattedMaxPrice}</span>
            </div>
            <span className="text-slate-500">{offer.companyName}</span>
          </div>
          <div className="flex items-center gap-1">
            {offer.redirectLink ? (
              <Link
                href={offer.redirectLink}
                className={`${buttonVariants({ variant: "default" })} relative`}
                target="_blank"
                rel="noopener"
              >
                Apply
              </Link>
            ) : (
              <Button
                variant={"default"}
                type="submit"
                showLoader
                isLoading={isPendingApplyForOffer}
                disabled={isPendingApplyForOffer}
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
