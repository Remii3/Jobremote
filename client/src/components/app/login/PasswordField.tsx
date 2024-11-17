import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { LoginUserSchema } from "@/schema/UserSchemas";

type PasswordFieldProps = {
  form: UseFormReturn<z.infer<typeof LoginUserSchema>>;
};

export default function PasswordField({ form }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  function toggleShowPassword() {
    setShowPassword((prev) => !prev);
  }
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} type={showPassword ? "text" : "password"} />
              {!showPassword ? (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-2 right-4"
                >
                  <Eye className="h-6 w-6" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-4 top-2 "
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
