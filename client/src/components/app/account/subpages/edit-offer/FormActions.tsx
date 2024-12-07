import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface FormActionsProps {
  isLoading: boolean;
  disabledSubmit: boolean;
}

export default function FormActions({
  isLoading,
  disabledSubmit,
}: FormActionsProps) {
  return (
    <div className="flex mt-4 gap-4">
      <Button
        type="submit"
        variant="default"
        isLoading={isLoading}
        disabled={disabledSubmit}
        showLoader
      >
        Update Offer
      </Button>
      <Link
        className={`${buttonVariants({
          variant: "outline",
        })}`}
        href={`/account/your-offers`}
      >
        Go Back
      </Link>
    </div>
  );
}
