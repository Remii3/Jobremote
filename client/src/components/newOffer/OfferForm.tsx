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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

import { DropzoneOptions } from "react-dropzone";
import { useGetAvailableTechnologies } from "@/hooks/useGetAvailableTechnologies";
import { useCurrency } from "@/context/CurrencyContext";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CreateOfferSchema } from "@/schema/OfferSchema";
import dynamic from "next/dynamic";
import AvatarUploader from "@/components/ui/avatar-uploader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { EXPERIENCES } from "@/constants/experiences";
import { EMPLOYMENTS } from "@/constants/employments";
import { CONTRACTS } from "@/constants/contracts";
import { LOCALIZATIONS } from "@/constants/localizations";
import { Switch } from "../ui/switch";

const OfferCkEditor = dynamic(
  () => import("../ui/ckeditor").then((mod) => mod.OfferCkEditor),
  { ssr: false }
);

const dropzone = {
  accept: {
    "application/pdf": [".png", ".img", ".jpeg", ".jpg", ".webp"],
  },
  multiple: true,
  maxFiles: 1,
  maxSize: 4 * 1024 * 10024,
} satisfies DropzoneOptions;

type OfferFormPropsTypes = {
  form: UseFormReturn<z.infer<typeof CreateOfferSchema>>;
  changeCurrentStep: (values: any) => void;
  selectedLogo: File[] | null;
  handleChangeLogo: (newLogo: File[] | null) => void;
  handleTechnologies: (tech: string) => void;
};

export default function OfferForm({
  form,
  changeCurrentStep,
  handleTechnologies,
  selectedLogo,
  handleChangeLogo,
}: OfferFormPropsTypes) {
  const [techOpen, setTechOpen] = useState<boolean>(false);
  const [showRequirements, setShowRequirements] = useState<boolean>(false);
  const [showDuties, setShowDuties] = useState<boolean>(false);
  const [showBenefits, setShowBenefits] = useState<boolean>(false);
  const [bindSalaries, setBindSalaries] = useState<boolean>(true);

  const { avTechnologies } = useGetAvailableTechnologies();
  const { allowedCurrencies } = useCurrency();

  useEffect(() => {
    console.log("FormState: ", form.formState);
    console.log("FormState: is valid", form.formState.isValid);
  }, [form.formState]);

  return (
    <div className="max-w-screen-2xl mx-auto ">
      <h2 className="text-3xl font-semibold">Post a new job</h2>

      <div className="flex gap-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => changeCurrentStep(2))}
            className="px-4 py-8 w-full space-y-6"
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
                />
                <FormMessage />
              </div>
              <div className="space-y-4 flex-grow">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Title <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="" />
                      </FormControl>
                      <FormDescription>
                        You should type a title for your offer, for example:
                        Senior Java dev
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Company name <span className="text-red-400">*</span>
                      </FormLabel>
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
                  <FormItem className="w-full">
                    <FormLabel>
                      Type of contract <span className="text-red-400">*</span>
                    </FormLabel>
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
                        {CONTRACTS.map((workType) => (
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
                  <FormItem className="w-full">
                    <FormLabel>
                      Localization <span className="text-red-400">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full flex justify-between font-normal"
                        >
                          {field.value ? field.value : "Localizations"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command
                          filter={(value, search) => {
                            if (
                              value
                                .toLocaleLowerCase()
                                .includes(search.toLocaleLowerCase())
                            )
                              return 1;
                            return 0;
                          }}
                        >
                          <CommandInput placeholder="Search localization..." />
                          <CommandList>
                            <CommandEmpty>No localization found.</CommandEmpty>
                            <CommandGroup>
                              {LOCALIZATIONS.map((localization) => (
                                <CommandItem
                                  key={localization._id}
                                  onSelect={() =>
                                    field.onChange(localization.name)
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === localization.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {localization.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-8 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Experience <span className="text-red-400">*</span>
                    </FormLabel>
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
                        {EXPERIENCES.map((exp) => (
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
                  <FormItem className="w-full">
                    <FormLabel>
                      Employment type <span className="text-red-400">*</span>
                    </FormLabel>
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
                        {EMPLOYMENTS.map((employmentType) => (
                          <SelectItem
                            key={employmentType._id}
                            value={employmentType.name}
                          >
                            {employmentType.name}
                          </SelectItem>
                        ))}
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
                  <FormLabel>
                    Content <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <OfferCkEditor
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                  <span className="text-sm text-muted-foreground lg:block hidden">
                    Tip: Use shift + enter if you want to break the line and not
                    start a new paragraph
                  </span>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="flex items-center gap-2"
                    htmlFor="showRequirementsSwitch"
                  >
                    <Switch
                      onCheckedChange={() =>
                        setShowRequirements(!showRequirements)
                      }
                      id="showRequirementsSwitch"
                    />
                    Requirements
                  </FormLabel>
                  {showRequirements && (
                    <FormControl>
                      <OfferCkEditor
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Your offer requirements"
                      />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="flex items-center gap-2"
                    htmlFor="showDutiesSwitch"
                  >
                    <Switch
                      onCheckedChange={() => setShowDuties(!showDuties)}
                      id="showDutiesSwitch"
                    />
                    Duties
                  </FormLabel>
                  <FormControl>
                    {showDuties && (
                      <OfferCkEditor
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Your offer duties"
                      />
                    )}
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
                  <FormLabel
                    className="flex items-center gap-2"
                    htmlFor="showBenefitsSwitch"
                  >
                    <Switch
                      onCheckedChange={() => setShowBenefits(!showBenefits)}
                      id="showBenefitsSwitch"
                    />
                    Benefits
                  </FormLabel>
                  <FormControl>
                    {showBenefits && (
                      <OfferCkEditor
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Your offer benefits"
                      />
                    )}
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
                              form.getValues("minSalary") * 12
                          ) {
                            form.setValue("minSalaryYear", field.value * 12);
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
                                (form.getValues("maxSalary") * 12).toFixed(2)
                              )
                          ) {
                            form.setValue("maxSalaryYear", field.value * 12);
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
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Currency <span className="text-red-400">*</span>
                    </FormLabel>
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
                                (form.getValues("minSalaryYear") / 12).toFixed(
                                  2
                                )
                              )
                          ) {
                            form.setValue(
                              "minSalary",
                              parseFloat((field.value / 12).toFixed(2))
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
                                (form.getValues("maxSalaryYear") / 12).toFixed(
                                  2
                                )
                              )
                          ) {
                            form.setValue(
                              "maxSalary",
                              parseFloat((field.value / 12).toFixed(2))
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
                  onCheckedChange={() => setBindSalaries((prev) => !prev)}
                />
                <span className="text-nowrap">Bind salaries</span>
              </Label>
            </div>
            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Technologies <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover open={techOpen} onOpenChange={setTechOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={techOpen}
                          className="w-[300px] flex justify-between font-normal"
                        >
                          Technologies
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <Command>
                          <CommandInput placeholder="Search technology..." />
                          <CommandList>
                            <CommandEmpty>No technology found.</CommandEmpty>
                            <CommandGroup>
                              {avTechnologies &&
                                avTechnologies.technologies.map((tech: any) => (
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
                                        field.value.includes(tech.name)
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
                  </FormControl>
                  <FormMessage />
                  {field.value.length > 0 && (
                    <ul className="flex gap-4 pt-2">
                      {field.value.map((tech: string) => (
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
                </FormItem>
              )}
            />
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
                    <FormDescription>
                      If you want to redirect the user to a specific page in
                      order to fill your company application form, you can
                      provide a link here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormRootError />
            <div className="flex mt-4 gap-4">
              <Button type="submit" variant={"default"} size={"lg"}>
                Choose your model
              </Button>
            </div>
          </form>
        </Form>
        <div className="w-full hidden lg:block">
          <div className="bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center p-4 w-full h-[calc(100vh-67px)] sticky top-[67px]"></div>
        </div>
      </div>
    </div>
  );
}
