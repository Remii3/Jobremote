"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  allowedCurrencies,
  allowedTechnologies,
  emplomentTypes,
  experience,
  localizations,
  typeOfWork,
} from "../../../../../server/src/schemas/offerSchemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import useAddNewOffer from "@/hooks/useAddNewOffer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

const OfferForm = ({ handleAddAnother }: { handleAddAnother: () => void }) => {
  const { form, handleSubmit, handleTechnologies, technologies } =
    useAddNewOffer({
      callback: () => {
        handleAddAnother();
      },
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4">
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
                  {experience.map((exp) => (
                    <SelectItem key={exp} value={exp}>
                      {exp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeOfWork"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type of work</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Type of work" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {typeOfWork.map((workType) => (
                    <SelectItem key={workType} value={workType}>
                      {workType}
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
                  {emplomentTypes.map((employmentType) => (
                    <SelectItem key={employmentType} value={employmentType}>
                      {employmentType}
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
                  {localizations.map((localization) => (
                    <SelectItem key={localization} value={localization}>
                      {localization}
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
          render={() => (
            <FormItem className="flex flex-col items-start mt-2">
              <DropdownMenu>
                <Label>Technologies</Label>
                <FormControl>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"outline"} className="gap-2">
                      <span>Add tech stack</span>
                      {technologies.length > 0 && (
                        <Badge variant={"secondary"}>
                          {technologies.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </FormControl>
                <DropdownMenuContent>
                  {allowedTechnologies.map((technology) => (
                    <DropdownMenuCheckboxItem
                      key={technology}
                      checked={technologies.includes(technology)}
                      onCheckedChange={() => handleTechnologies(technology)}
                      preventCloseOnSelect
                    >
                      {technology}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {technologies.length > 0 && (
                <ul className="flex gap-2">
                  {technologies.map((tech) => (
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
