import { Button } from "@/components/ui/button";
import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

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
      <PaymentElement />
      <Button onClick={handleSubmit}>Pay</Button>
    </div>
  );
}
