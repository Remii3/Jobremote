import { CreateUserSchemaRefined } from "@/schema/UserSchemas";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Eye, EyeOff } from "lucide-react";

type PasswordRepeatFieldProps = {
  form: UseFormReturn<z.infer<typeof CreateUserSchemaRefined>>;
};

export default function PasswordRepeatField({
  form,
}: PasswordRepeatFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }

  return (
    <FormField
      control={form.control}
      name="passwordRepeat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Repeat Password <span className="text-red-400">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} type={showPassword ? "text" : "password"} />
              {!showPassword ? (
                <button
                  type="button"
                  onClick={() => toggleShowPassword()}
                  className="absolute top-2 right-4"
                >
                  <Eye className="h-6 w-6" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleShowPassword()}
                  className="absolute right-4 top-2"
                >
                  <EyeOff className="h-6 w-6" />
                </button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
