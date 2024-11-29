"use clinet";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRootError,
} from "../../../../ui/form";
import { Input } from "../../../../ui/input";

import { useGetAvailableTechnologies } from "@/hooks/useGetAvailableTechnologies";
import { useCurrency } from "@/context/CurrencyContext";
import dynamic from "next/dynamic";
import { OfferType } from "@/types/types";
import { QueryClient } from "@tanstack/react-query";

import { useEditOffer } from "./EditOffer.hooks";
import TextField from "./TextField";
import AvatarSection from "./AvatarSection";
import SelectField from "./SelectField";
import LocalizationPopover from "./LocalizationPopover";
import TechnologySelection from "./TechnologySelection";
import FormActions from "./FormActions";
import SelectCurrencyField from "./SelectCurrencyField";
import { EXPERIENCES } from "@/constants/experiences";
import { EMPLOYMENTS } from "@/constants/employments";
import { CONTRACTS } from "@/constants/contracts";

const OfferCkEditor = dynamic(
  () => import("../../../../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

interface EditOfferPropsTypes {
  offerData: OfferType;
  queryClient: QueryClient;
  handleChangeCurrentEditOffer: (offerId: OfferType | null) => void;
}

export default function EditOffer({
  offerData,
  queryClient,
  handleChangeCurrentEditOffer,
}: EditOfferPropsTypes) {
  const { avTechnologies } = useGetAvailableTechnologies();
  const { allowedCurrencies } = useCurrency();
  const {
    form,
    handleChangeLogo,
    handleSubmit,
    selectedLogo,
    updateOfferIsLoading,
  } = useEditOffer({
    offerData,
    handleChangeCurrentEditOffer,
    queryClient,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 px-2 md:col-span-4 overflow-y-auto"
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
        <div className="flex gap-8 flex-col md:flex-row">
          <SelectField
            control={form.control}
            label="Contract type"
            name="contractType"
            options={CONTRACTS}
          />
          <LocalizationPopover control={form.control} />
        </div>
        <div className="flex gap-8 flex-col md:flex-row">
          <SelectField
            control={form.control}
            label="Experience"
            name="experience"
            options={EXPERIENCES}
          />
          <SelectField
            control={form.control}
            label="Employment type"
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
                  If you want to redirect the user to a specific page in order
                  to fill your company application form, you can provide a link
                  here.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormActions
          isLoading={updateOfferIsLoading}
          handleCancel={() => handleChangeCurrentEditOffer(null)}
          disabledSubmit={
            updateOfferIsLoading ||
            (!form.formState.isDirty && !selectedLogo) ||
            selectedLogo?.length === 0
          }
        />
        <FormRootError />
      </form>
    </Form>
  );
}
