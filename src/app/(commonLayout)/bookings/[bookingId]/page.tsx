"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

function BookingResult() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const payment = searchParams.get("payment");
    if (payment === "success") {
      toast.success("Payment successful! Booking confirmed.");
      // Redirect to my-sessions after 2 seconds
      setTimeout(() => router.push("/my-sessions"), 2000);
    }
    if (payment === "cancelled") {
      toast.error("Payment cancelled.");
      setTimeout(() => router.push("/my-sessions"), 2000);
    }
  }, []);

  const payment = searchParams.get("payment");

  return (
    <section className="py-20">
      <div className="max-w-md mx-auto px-4 text-center space-y-4">
        {payment === "success" ? (
          <>
            <div className="text-5xl">✅</div>
            <h1 className="text-2xl font-bold text-green-600">
              Payment Successful!
            </h1>
            <p className="text-gray-500">
              Your booking is confirmed. Redirecting to your sessions...
            </p>
          </>
        ) : payment === "cancelled" ? (
          <>
            <div className="text-5xl">❌</div>
            <h1 className="text-2xl font-bold text-red-600">
              Payment Cancelled
            </h1>
            <p className="text-gray-500">
              Your payment was cancelled. Redirecting back...
            </p>
          </>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </section>
  );
}

export default function BookingResultPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <BookingResult />
    </Suspense>
  );
}
