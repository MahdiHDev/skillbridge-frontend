"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetTeachings } from "@/hooks/teaching/useGetTeaching";
import { useUpdateTeaching } from "@/hooks/teaching/useUpdateTeaching";
import { TeachingLevel } from "@/services/teaching.service";
import { useForm } from "@tanstack/react-form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";

const editTeachingSchema = z.object({
    hourlyRate: z.number().min(1, "Hourly rate must be at least 1"),
    experienceYears: z.number().min(0, "Experience years must be 0 or more"),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    description: z.string(),
    isPrimary: z.boolean(),
});

const LEVELS: TeachingLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function EditTeachingPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const { data } = useGetTeachings();
    const session = data?.data?.find((s) => s.id === id);

    const { mutateAsync, isPending } = useUpdateTeaching(id);

    const form = useForm({
        defaultValues: {
            hourlyRate: session?.hourlyRate ?? 0,
            experienceYears: session?.experienceYears ?? 0,
            level: (session?.level ?? "BEGINNER") as TeachingLevel,
            description: session?.description ?? "",
            isPrimary: session?.isPrimary ?? false,
        },
        validators: {
            onSubmit: editTeachingSchema,
        },
        onSubmit: async ({ value }) => {
            await mutateAsync({
                hourlyRate: Number(value.hourlyRate),
                experienceYears: Number(value.experienceYears),
                level: value.level,
                description: value.description || undefined,
                isPrimary: value.isPrimary,
            });
            router.push("/dashboard/tutor/sessions");
        },
    });

    if (!session) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                Session not found.{" "}
                <button
                    className="underline"
                    onClick={() => router.push("/dashboard/tutor/sessions")}
                >
                    Go back
                </button>
            </div>
        );
    }

    return (
        <div className="py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Teaching Subject</CardTitle>
                    <CardDescription>
                        <span className="font-medium capitalize text-foreground">
                            {session.subject.name}
                        </span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="edit-teaching-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            {/* Hourly Rate */}
                            <form.Field
                                name="hourlyRate"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Hourly Rate ($)
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                type="number"
                                                min={1}
                                                placeholder="e.g. 65"
                                                value={
                                                    field.state.value === 0
                                                        ? ""
                                                        : field.state.value
                                                }
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />

                            {/* Experience Years */}
                            <form.Field
                                name="experienceYears"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Years of Experience
                                            </FieldLabel>
                                            <Input
                                                id={field.name}
                                                type="number"
                                                min={0}
                                                placeholder="e.g. 4"
                                                value={
                                                    field.state.value === 0
                                                        ? ""
                                                        : field.state.value
                                                }
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />

                            {/* Level */}
                            <form.Field
                                name="level"
                                children={(field) => {
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Level
                                            </FieldLabel>
                                            <Select
                                                value={field.state.value}
                                                onValueChange={(val) =>
                                                    field.handleChange(
                                                        val as TeachingLevel,
                                                    )
                                                }
                                            >
                                                <SelectTrigger id={field.name}>
                                                    <SelectValue placeholder="Select a level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {LEVELS.map((level) => (
                                                        <SelectItem
                                                            key={level}
                                                            value={level}
                                                        >
                                                            {level.charAt(0) +
                                                                level
                                                                    .slice(1)
                                                                    .toLowerCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {isInvalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            />

                            {/* Description (optional) */}
                            <form.Field
                                name="description"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Description{" "}
                                            <span className="text-muted-foreground text-xs">
                                                (optional)
                                            </span>
                                        </FieldLabel>
                                        <Textarea
                                            id={field.name}
                                            placeholder="Tell students about your teaching style..."
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                            rows={4}
                                        />
                                    </Field>
                                )}
                            />

                            {/* isPrimary */}
                            <form.Field
                                name="isPrimary"
                                children={(field) => (
                                    <Field orientation="horizontal">
                                        <Checkbox
                                            id={field.name}
                                            checked={field.state.value}
                                            onCheckedChange={(checked) =>
                                                field.handleChange(
                                                    checked as boolean,
                                                )
                                            }
                                        />
                                        <FieldLabel htmlFor={field.name}>
                                            Is Primary
                                        </FieldLabel>
                                    </Field>
                                )}
                            />

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className=""
                                    onClick={() =>
                                        router.push("/dashboard/tutor/sessions")
                                    }
                                >
                                    Cancel
                                </Button>
                                <Button
                                    form="edit-teaching-form"
                                    type="submit"
                                    className=""
                                    disabled={isPending}
                                >
                                    {isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
