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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z
    .object({
        name: z.string().min(2, "Name must be at least 2 charecters"),
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 charecters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match",
        path: ["confirmPassword"],
    });

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validators: {
            onSubmit: signupSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Creating Account...");
            const { confirmPassword, ...rest } = value;
            try {
                const { data, error } = await authClient.signUp.email(rest);

                if (error) {
                    toast.error(error.message, { id: toastId });
                    return;
                }

                toast.success("Account created! Check your email.", {
                    id: toastId,
                });

                router.refresh();
                router.push(
                    `/check-email?email=${encodeURIComponent(value.email)}`,
                );
            } catch (error) {
                toast.error("Something went wrong, please try again.", {
                    id: toastId,
                });
                console.error(error);
            }
        },
    });

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                    Enter your information below to create your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    id="signup-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field
                            name="name"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Full Name
                                        </FieldLabel>
                                        <Input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder="John Doe"
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <form.Field
                            name="email"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Email
                                        </FieldLabel>
                                        <Input
                                            type="email"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            placeholder="m@example.com"
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                        <FieldDescription>
                                            We&apos;ll use this to contact you.
                                            We will not share your email with
                                            anyone else.
                                        </FieldDescription>
                                    </Field>
                                );
                            }}
                        />

                        <form.Field
                            name="password"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Password
                                        </FieldLabel>
                                        <Input
                                            type="password"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        />

                        <form.Field
                            name="confirmPassword"
                            children={(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            type="password"
                                            id={field.name}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                        <FieldDescription>
                                            Please confirm your password.
                                        </FieldDescription>
                                    </Field>
                                );
                            }}
                        />

                        <FieldGroup>
                            <Field>
                                <Button form="signup-form" type="submit">
                                    Create Account
                                </Button>
                                {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                                <FieldDescription className="px-6 text-center">
                                    Already have an account?{" "}
                                    <a href="/login">Sign in</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
