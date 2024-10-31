import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading: boolean;
  handleCancel: () => void;
  disabledSubmit: boolean;
}

export default function FormActions({
  isLoading,
  handleCancel,
  disabledSubmit,
}: FormActionsProps) {
  return (
    <div className="flex mt-4 gap-4">
      <Button
        type="submit"
        variant="default"
        isLoading={isLoading}
        disabled={disabledSubmit}
      >
        Update Offer
      </Button>
      <Button type="button" variant="outline" onClick={handleCancel}>
        Go Back
      </Button>
    </div>
  );
}
