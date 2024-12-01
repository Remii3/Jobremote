import { StaticBody } from "@/components/layout/StaticBody";
import { buttonVariants } from "@/components/ui/button";
import { MultiStepProgressBar } from "@/components/ui/multi-step-progress";
import Image from "next/image";
import Link from "next/link";

export default function page() {
  return (
    <StaticBody>
      <div className="w-full">
        <MultiStepProgressBar currentStep={4} />

        <div className="flex flex-col items-center top-20 relative">
          <div className="w-full md:w-[600px] h-[332px] relative">
            <Image
              src={"/success_award.webp"}
              alt="Successfully posted new offer icon"
              className="rounded-3xl object-contain"
              priority
              quality={100}
              fill
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">
            Your offer has been posted successfully!
          </h2>
          <div className="flex flex-col items-center gap-2">
            <Link
              href={"/hire-remotely"}
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              Add another
            </Link>
            <Link
              href={"/"}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Back to main page
            </Link>
          </div>
        </div>
      </div>
    </StaticBody>
  );
}
