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
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTeaching } from "@/hooks/teaching/useCreateTeaching";
import { useSubjects } from "@/hooks/useSubjects";
import { cn } from "@/lib/utils";
import { TeachingLevel } from "@/services/teaching.service";
import { useForm } from "@tanstack/react-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const createTeachingSchema = z.object({
    subjectName: z
        .string()
        .min(2, "Subject name must be at least 2 characters"),
    hourlyRate: z.number().min(1, "Hourly rate must be at least 1"),
    experienceYears: z.number().min(0, "Experience years must be 0 or more"),
    level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    bio: z.string(),
});

const LEVELS: TeachingLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function CreateTeachingPage() {
    const router = useRouter();
    const { mutateAsync, isPending } = useCreateTeaching();
    const { data: subjectsData, isLoading } = useSubjects();

    const subjects = subjectsData?.data ?? [];

    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const form = useForm({
        defaultValues: {
            subjectName: "",
            hourlyRate: 0,
            experienceYears: 0,
            level: "BEGINNER" as TeachingLevel,
            bio: "",
        },
        validators: {
            onSubmit: createTeachingSchema,
        },
        onSubmit: async ({ value }) => {
            await mutateAsync({
                subjectName: value.subjectName,
                hourlyRate: Number(value.hourlyRate),
                experienceYears: Number(value.experienceYears),
                level: value.level,
                bio: value.bio || undefined,
            });
            router.push("/dashboard/tutor/sessions");
        },
    });

    return (
        <div className=" py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Create Teaching Subject</CardTitle>
                    <CardDescription>
                        Add a subject you want to teach along with your
                        experience and rate.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="create-teaching-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            {/* Subject Name */}
                            <form.Field
                                name="subjectName"
                                children={(field) => {
                                    // ✅ no hooks here — use subjects, open, inputValue, containerRef from top level
                                    const isInvalid =
                                        field.state.meta.isTouched &&
                                        !field.state.meta.isValid;
                                    const filtered = subjects.filter((s) =>
                                        s.name
                                            .toLowerCase()
                                            .includes(inputValue.toLowerCase()),
                                    );

                                    return (
                                        <Field>
                                            <FieldLabel htmlFor={field.name}>
                                                Subject Name
                                            </FieldLabel>
                                            <div
                                                ref={containerRef}
                                                className="relative"
                                            >
                                                <div className="relative">
                                                    <Input
                                                        id={field.name}
                                                        placeholder="Search or type a new subject..."
                                                        value={inputValue}
                                                        autoComplete="off"
                                                        onFocus={() =>
                                                            setOpen(true)
                                                        }
                                                        onChange={(e) => {
                                                            setInputValue(
                                                                e.target.value,
                                                            );
                                                            field.handleChange(
                                                                e.target.value,
                                                            );
                                                            setOpen(true);
                                                        }}
                                                    />
                                                    <ChevronsUpDown
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
                                                        onClick={() =>
                                                            setOpen((o) => !o)
                                                        }
                                                    />
                                                </div>

                                                {open && (
                                                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                                                        {isLoading ? (
                                                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                                                Loading
                                                                subjects...
                                                            </div>
                                                        ) : (
                                                            <ul className="max-h-52 overflow-auto py-1">
                                                                {filtered.length >
                                                                0 ? (
                                                                    filtered.map(
                                                                        (
                                                                            subject,
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subject.id
                                                                                }
                                                                                className={cn(
                                                                                    "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-accent",
                                                                                    field
                                                                                        .state
                                                                                        .value ===
                                                                                        subject.name &&
                                                                                        "bg-accent",
                                                                                )}
                                                                                onMouseDown={(
                                                                                    e,
                                                                                ) => {
                                                                                    e.preventDefault();
                                                                                    setInputValue(
                                                                                        subject.name,
                                                                                    );
                                                                                    field.handleChange(
                                                                                        subject.name,
                                                                                    );
                                                                                    setOpen(
                                                                                        false,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Check
                                                                                    className={cn(
                                                                                        "h-4 w-4",
                                                                                        field
                                                                                            .state
                                                                                            .value ===
                                                                                            subject.name
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0",
                                                                                    )}
                                                                                />
                                                                                {
                                                                                    subject.name
                                                                                }
                                                                            </li>
                                                                        ),
                                                                    )
                                                                ) : (
                                                                    <li className="px-3 py-2 text-sm text-muted-foreground">
                                                                        No match
                                                                        —{" "}
                                                                        <span className="font-medium text-foreground">
                                                                            "
                                                                            {
                                                                                inputValue
                                                                            }
                                                                            "
                                                                        </span>{" "}
                                                                        will be
                                                                        created
                                                                        as a new
                                                                        subject
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
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

                            {/* Bio (optional) */}
                            <form.Field
                                name="bio"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel htmlFor={field.name}>
                                            Bio{" "}
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
                                    form="create-teaching-form"
                                    type="submit"
                                    className=""
                                    disabled={isPending}
                                >
                                    {isPending ? "Creating..." : "Create"}
                                </Button>
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
