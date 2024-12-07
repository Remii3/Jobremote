"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useGetAvailableTechnologies } from "@/hooks/useGetAvailableTechnologies";
import { useCurrency } from "@/context/CurrencyContext";
import dynamic from "next/dynamic";

import { useEditOffer } from "./EditOffer.hooks";
import TextField from "@/components/app/account/subpages/edit-offer/TextField";
import AvatarSection from "@/components/app/account/subpages/edit-offer/AvatarSection";
import SelectField from "@/components/app/account/subpages/edit-offer/SelectField";
import LocalizationPopover from "@/components/app/account/subpages/edit-offer/LocalizationPopover";
import TechnologySelection from "@/components/app/account/subpages/edit-offer/TechnologySelection";
import FormActions from "@/components/app/account/subpages/edit-offer/FormActions";
import SelectCurrencyField from "@/components/app/account/subpages/edit-offer/SelectCurrencyField";
import { EXPERIENCES } from "@/constants/experiences";
import { EMPLOYMENTS } from "@/constants/employments";
import { CONTRACTS } from "@/constants/contracts";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const OfferCkEditor = dynamic(
  () => import("@/components/ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

export default function EditOfferPage() {
  const { offerId } = useParams() as { offerId: string };

  const { avTechnologies } = useGetAvailableTechnologies();
  const { allowedCurrencies } = useCurrency();

  const {
    offerData,
    isPending,
    form,
    handleChangeLogo,
    handleSubmit,
    selectedLogo,
    updateOfferIsLoading,
    handleTechnologies,
  } = useEditOffer({
    offerId,
  });

  return (
    <>
      {isPending && (
        <div className="space-y-4 h-full col-span-4">
          <Skeleton className="w-full h-11" />
          <Skeleton className="w-full h-11" />
          <Skeleton className="w-full h-11" />
        </div>
      )}
      {!isPending && offerData && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 px-2 md:col-span-4"
          >
            <div className="flex gap-8 flex-col md:flex-row">
              <AvatarSection
                selectedLogo={selectedLogo}
                onLogoChange={(newValue) => handleChangeLogo(newValue)}
                oldLogo={offerData.logo}
              />
              <div className="space-y-4 flex-grow flex flex-col justify-between h-full">
                <TextField
                  control={form.control}
                  label="Title"
                  name="title"
                  description="A title of your offer that will be visible to the users"
                  type="text"
                />
                <TextField
                  control={form.control}
                  label="Company name"
                  name="companyName"
                  description="Please provide a full name of your company"
                  type="text"
                />
              </div>
            </div>
            <div className="flex gap-8 flex-col md:flex-row max-w-lg">
              <SelectField
                control={form.control}
                label="Contract type"
                name="contractType"
                options={CONTRACTS}
              />
              <LocalizationPopover control={form.control} />
            </div>
            <div className="flex gap-8 flex-col md:flex-row max-w-lg">
              <SelectField
                control={form.control}
                label="Experience"
                name="experience"
                options={EXPERIENCES}
              />
              <SelectField
                control={form.control}
                label="Employment"
                name="employmentType"
                options={EMPLOYMENTS}
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
              <TextField
                name="minSalary"
                label="Min Salary"
                control={form.control}
                type="number"
              />
              <SelectCurrencyField
                name="currency"
                label="Currency"
                options={allowedCurrencies}
                control={form.control}
              />

              <TextField
                control={form.control}
                label="Max salary"
                name="maxSalary"
                type="number"
              />
            </div>
            {avTechnologies && (
              <TechnologySelection
                availableTechnologies={avTechnologies.technologies}
                control={form.control}
                label="Technologies"
                name="technologies"
                handleTechnologies={handleTechnologies}
              />
            )}
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
                      If you want to redirect the user to a specific page in
                      order to fill your company application form, you can
                      provide a link here.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <FormActions
              isLoading={updateOfferIsLoading}
              disabledSubmit={
                updateOfferIsLoading ||
                (!form.formState.isDirty && !selectedLogo) ||
                selectedLogo?.length === 0
              }
            />
            <FormRootError />
          </form>
        </Form>
      )}
    </>
  );
}
