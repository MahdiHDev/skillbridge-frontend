import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { bookingId: string } },
) {
  const { bookingId } = params;

  // Get all cookies and forward them as-is
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const backendRes = await fetch(
    `https://assignment5-api.vercel.app/api/v1/payments/checkout/${bookingId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // forward cookies to backend
      },
    },
  );

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
