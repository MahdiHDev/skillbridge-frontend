"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTutorProfile } from "@/hooks/use-Tutor";
import { useForm } from "@tanstack/react-form";
import {
    BookOpen,
    CheckCircle,
    Clock,
    DollarSign,
    Star,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const perks = [
    {
        icon: DollarSign,
        title: "Earn on your terms",
        desc: "Set your own hourly rate and availability",
    },
    {
        icon: Users,
        title: "Reach students globally",
        desc: "Connect with learners from around the world",
    },
    {
        icon: Clock,
        title: "Flexible schedule",
        desc: "Teach whenever it works for you",
    },
    {
        icon: Star,
        title: "Build your reputation",
        desc: "Collect reviews and grow your profile",
    },
];

export default function BeATutorPage() {
    const router = useRouter();
    const { mutateAsync, isPending } = useCreateTutorProfile();

    const form = useForm({
        defaultValues: { bio: "" },
        // validators: { onSubmit: schema },
        onSubmit: async ({ value }) => {
            console.log("submiteed");
            await mutateAsync({ bio: value.bio });
            router.push("/");
        },
    });

    return (
        <section className="min-h-screen py-20 bg-gray-50 dark:bg-[#09090b]">
            <div className="max-w-5xl mx-auto px-4 space-y-16">
                {/* HERO */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-black text-white text-xs px-3 py-1 rounded-full mb-4">
                        <BookOpen className="h-3 w-3" />
                        Join our tutor community
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Share your knowledge,
                        <br />
                        <span className="text-gray-400">
                            earn on your schedule
                        </span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                        Apply to become a tutor. Once your profile is reviewed
                        and approved, you'll receive a confirmation email and
                        can start accepting bookings.
                    </p>
                </div>

                {/* PERKS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {perks.map(({ icon: Icon, title, desc }) => (
                        <Card
                            key={title}
                            className="p-4 text-center space-y-2 border dark:bg-[#1e1e22]"
                        >
                            <div className="mx-auto w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                                <Icon className="h-4 w-4" />
                            </div>
                            <p className="font-semibold text-sm">{title}</p>
                            <p className="text-xs text-muted-foreground">
                                {desc}
                            </p>
                        </Card>
                    ))}
                </div>

                {/* STEPS */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">
                        How it works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            {
                                step: "01",
                                title: "Submit your application",
                                desc: "Fill in your bio and areas of expertise",
                            },
                            {
                                step: "02",
                                title: "Profile review",
                                desc: "Our team reviews your application within 24-48 hours",
                            },
                            {
                                step: "03",
                                title: "Start teaching",
                                desc: "Get approved, set your availability and start earning",
                            },
                        ].map(({ step, title, desc }) => (
                            <div
                                key={step}
                                className="flex gap-4 items-start p-4 border rounded-xl dark:bg-[#1e1e22]"
                            >
                                <span className="text-3xl font-bold text-gray-200 dark:text-gray-700">
                                    {step}
                                </span>
                                <div>
                                    <p className="font-semibold text-sm">
                                        {title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FORM */}
                <Card className="max-w-2xl mx-auto dark:bg-[#1e1e22]">
                    <CardHeader>
                        <CardTitle>Apply to become a tutor</CardTitle>
                        <CardDescription>
                            Tell us about yourself. You'll receive an email once
                            your profile is approved.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit();
                            }}
                        >
                            <FieldGroup>
                                <form.Field
                                    name="bio"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>
                                                Your Bio (optional)
                                            </FieldLabel>
                                            <Textarea
                                                rows={6}
                                                placeholder="Tell students about your background, experience, teaching style, and what subjects you can help with..."
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <div className="flex justify-between items-center">
                                                {field.state.meta.isTouched &&
                                                    !field.state.meta
                                                        .isValid && (
                                                        <FieldError
                                                            errors={
                                                                field.state.meta
                                                                    .errors
                                                            }
                                                        />
                                                    )}
                                                <span className="text-xs text-muted-foreground ml-auto">
                                                    {field.state.value.length}{" "}
                                                    chars
                                                </span>
                                            </div>
                                        </Field>
                                    )}
                                />

                                {/* NOTICE */}
                                <div className="flex gap-3 p-4 bg-gray-50 dark:bg-[#141414] rounded-lg border text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                    <p className="text-muted-foreground">
                                        After submitting, your profile will be
                                        reviewed by our team. You'll receive a
                                        confirmation email once approved.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Submitting..."
                                        : "Submit Application"}
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
