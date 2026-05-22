"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Status = "verifying" | "success" | "error";

export function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<Status>("verifying");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Verification token is missing.");
            return;
        }

        const verify = async () => {
            const { error } = await authClient.verifyEmail({
                query: { token },
            });

            if (error) {
                setStatus("error");
                setErrorMessage(error.message ?? "Verification failed.");
                return;
            }

            setStatus("success");
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center max-w-4xl mx-auto p-4">
            <Card className="w-full max-w-md p-10 py-20">
                <CardHeader className="text-center">
                    <CardTitle>
                        {status === "verifying" && "Verifying your email..."}
                        {status === "success" && "Email verified!"}
                        {status === "error" && "Verification failed"}
                    </CardTitle>
                    <CardDescription>
                        {status === "verifying" &&
                            "Please wait while we verify your email address."}
                        {status === "success" &&
                            "Your account is now active. You can sign in."}
                        {status === "error" &&
                            (errorMessage ?? "Something went wrong.")}
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4">
                    {status === "verifying" && (
                        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    )}

                    {status === "success" && (
                        <>
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <Button
                                className="w-full"
                                onClick={() => router.push("/login")}
                            >
                                Go to login
                            </Button>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                <svg
                                    className="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => router.push("/signup")}
                            >
                                Back to signup
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
