import { Button } from "@/components/ui/button";

type PaymentFormPropsTypes = {
  changeStepPrev: (step: number) => void;
  handleSubmit: (values: any) => void;
};

export default function PaymentForm({
  changeStepPrev,
  handleSubmit,
}: PaymentFormPropsTypes) {
  return (
    <div>
      <Button onClick={() => changeStepPrev(2)}>Edit model</Button>
      PaymentForm Dev payment
      <Button onClick={handleSubmit}>Pay</Button>
    </div>
  );
}
