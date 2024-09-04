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
  allowedCurrencies,
  allowedTechnologies,
  emplomentTypes,
  experience,
  localizations,
  typeOfWork,
} from "../../../../server/src/schemas/offerSchemas";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import useEditOffer from "@/hooks/useEditOffer";

interface EditOfferPropsTypes {
  setEditOfferData: (state: null) => void;
  offerData: OfferType;
  handleUpdateOffer: (values: any) => void;
}

export default function EditOffer({
  setEditOfferData,
  offerData,
  handleUpdateOffer,
}: EditOfferPropsTypes) {
  const { form, handleTechnologies, technologies } = useEditOffer({
    defaultData: offerData,
  });

  function resetOfferData() {
    setEditOfferData(null);
  }

  function handleSubmit(values: any) {
    let hasError = false;
    if (values.experience === "") {
      form.setError("experience", {
        type: "value",
        message: "Experience is required",
      });
      hasError = true;
    }

    if (values.localization === "") {
      form.setError("localization", {
        type: "value",
        message: "Localization is required",
      });
      hasError = true;
    }

    if (values.typeOfWork === "") {
      form.setError("typeOfWork", {
        type: "value",
        message: "Type of work is required",
      });
      hasError = true;
    }

    if (hasError) {
      return;
    }
    handleUpdateOffer(values);
  }

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
                    <FormLabel>Technologies</FormLabel>
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
                    <FormMessage />
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
                Update offer
              </Button>
              <Button
                type="button"
                variant={"outline"}
                onClick={resetOfferData}
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
