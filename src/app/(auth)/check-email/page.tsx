import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage({
    searchParams,
}: {
    searchParams: { email?: string };
}) {
    const email = searchParams.email ?? "your email";

    return (
        <div className="min-h-screen flex items-center justify-center max-w-7xl mx-auto p-8">
            <Card className="w-full max-w-md text-center py-20">
                <CardHeader>
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <CardTitle>Check your inbox</CardTitle>
                    <CardDescription>
                        We sent a verification link to <strong>{email}</strong>.
                        Click the link in the email to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive it? Check your spam folder or{" "}
                        <a href="/signup" className="underline">
                            try again
                        </a>
                        .
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
