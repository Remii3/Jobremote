import {
  CalendarDays,
  CheckCircle,
  Circle,
  Coins,
  CreditCard,
  FilePen,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  label: string;
  icon: React.ElementType;
  completed: boolean;
  active: boolean;
};

export function MultiStepProgressBar({ currentStep }: { currentStep: number }) {
  const steps: Step[] = [
    {
      label: "Step 1",
      icon: FilePen,
      completed: currentStep > 1,
      active: currentStep === 1,
    },
    {
      label: "Step 2",
      icon: CalendarDays,
      completed: currentStep > 2,
      active: currentStep === 2,
    },
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto py-6 px-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`${
            index < steps.length - 1 ? "flex-1 " : ""
          }flex items-center justify-start`}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              step.completed
                ? "bg-primary/40 text-white"
                : step.active
                ? "bg-primary text-white"
                : "bg-input text-zinc-400"
            )}
          >
            <step.icon className="h-6 w-6" />
          </div>

          {/* Progress Line (except last) */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-1 h-1",
                step.completed ? "bg-primary/40" : "bg-input"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
