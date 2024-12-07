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
import FormActions from "@/components/app/account/subpages/edit-offer/FormActions";
import SelectCurrencyField from "@/components/app/account/subpages/edit-offer/SelectCurrencyField";
import { EXPERIENCES } from "@/constants/experiences";
import { EMPLOYMENTS } from "@/constants/employments";
import { CONTRACTS } from "@/constants/contracts";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const OfferCkEditor = dynamic(
  () => import("@/components/ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

export default function EditOfferPage() {
  const { offerId } = useParams() as { offerId: string };
  const [techOpen, setTechOpen] = useState<boolean>(false);

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
    bindSalaries,
    handleBindSalaries,
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
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
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
            <FormField
              control={form.control}
              name="duties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duties</FormLabel>
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
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
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
                  <FormItem className="w-full">
                    <FormLabel>
                      Min salary <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onBlur={() => {
                          if (
                            bindSalaries &&
                            form.getValues("minSalaryYear") !==
                              form.getValues("minSalary")! * 12
                          ) {
                            form.setValue("minSalaryYear", field.value! * 12);
                          }
                        }}
                      />
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
                      <Input
                        {...field}
                        min={0}
                        type="number"
                        onBlur={() => {
                          if (
                            bindSalaries &&
                            form.getValues("maxSalaryYear") !==
                              parseFloat(
                                (form.getValues("maxSalary")! * 12).toFixed(2)
                              )
                          ) {
                            form.setValue("maxSalaryYear", field.value! * 12);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SelectCurrencyField
                name="currency"
                label="Currency"
                options={allowedCurrencies}
                control={form.control}
              />
            </div>
            <div className="flex gap-8 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="minSalaryYear"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Min salary/ year<span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onBlur={() => {
                          if (
                            bindSalaries &&
                            form.getValues("minSalary") !==
                              parseFloat(
                                (form.getValues("minSalaryYear")! / 12).toFixed(
                                  2
                                )
                              )
                          ) {
                            form.setValue(
                              "minSalary",
                              parseFloat((field.value! / 12).toFixed(2))
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxSalaryYear"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Max salary/ year <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        onBlur={() => {
                          if (
                            bindSalaries &&
                            form.getValues("maxSalary") !==
                              parseFloat(
                                (form.getValues("maxSalaryYear")! / 12).toFixed(
                                  2
                                )
                              )
                          ) {
                            form.setValue(
                              "maxSalary",
                              parseFloat((field.value! / 12).toFixed(2))
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Label className="flex gap-4 items-center">
                <Switch
                  checked={bindSalaries}
                  onCheckedChange={handleBindSalaries}
                />
                <span className="text-nowrap">Bind salaries</span>
              </Label>
            </div>
            {avTechnologies && (
              <FormField
                control={form.control}
                name="technologies"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Technologies</FormLabel>
                    <FormControl>
                      <Popover
                        open={techOpen}
                        onOpenChange={() => setTechOpen((prev) => !prev)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={techOpen}
                            className="w-[300px] flex justify-between"
                          >
                            Technology
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search technology..." />
                            <CommandList>
                              <CommandEmpty>No technology found.</CommandEmpty>
                              <CommandGroup>
                                {avTechnologies.technologies.map(
                                  (tech: { _id: string; name: string }) => {
                                    return (
                                      <CommandItem
                                        key={tech._id}
                                        onSelect={() =>
                                          handleTechnologies(tech.name)
                                        }
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value.includes(tech.name)
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <span className="w-full">
                                          {tech.name}
                                        </span>
                                      </CommandItem>
                                    );
                                  }
                                )}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                    {field.value.length > 0 && (
                      <ul className="flex gap-4 pt-2">
                        {field.value.map((tech: string) => (
                          <li key={tech}>
                            <Badge
                              variant="outline"
                              className="py-1 px-3 cursor-pointer"
                              onClick={() => handleTechnologies(tech)}
                            >
                              {tech}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    )}
                  </FormItem>
                )}
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
