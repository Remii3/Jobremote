import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

type ModelFormPropsTypes = {
  form: any;
  handleSubmit: (values: any) => void;
  changeStepPrev: (step: number) => void;
};

export default function ModelForm({
  form,
  handleSubmit,
  changeStepPrev,
}: ModelFormPropsTypes) {
  return (
    <div>
      <Button onClick={() => changeStepPrev(1)}>Edit offer data</Button>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
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
          <div>
            <Button type="submit">Pay for new offer</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
