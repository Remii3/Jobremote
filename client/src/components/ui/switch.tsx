"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);
  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
      onCheckedChange={(e) => setIsChecked(e)}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background rotate-0 shadow-lg ring-0 transition-all duration-200 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 data-[state=checked]:rotate-[35deg] relative"
        )}
      >
        <Moon
          className={`h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-100 absolute ease-out transition-[opacity,scale] ${
            isChecked ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        />
        <Sun
          className={`h-4 w-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 duration-100 absolute ease-out transition-[opacity,scale] ${
            isChecked ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };