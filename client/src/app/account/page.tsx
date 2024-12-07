"use client";

import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  return router.replace("/account/details");
}
