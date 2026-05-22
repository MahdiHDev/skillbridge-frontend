"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    useEditAvailability,
    useGetAvailability,
} from "@/hooks/useAvailability";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import z from "zod";
import { DAYS } from "../../create/page";

const availabilitySchema = z.object({
    dayOfWeek: z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

const extractUTCTime = (iso: string) => {
    const date = new Date(iso);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`; // "16:00"
};

export default function page() {
    const { mutateAsync, isPending } = useEditAvailability();
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useGetAvailability();
    const session = data?.data?.find((s) => s.id === id);

    const form = useForm({
        defaultValues: {
            dayOfWeek: session?.dayOfWeek || "MON",
            startDate: session?.startDate.split("T")[0] || "",
            endDate: session?.endDate.split("T")[0] || "",
            startTime: session?.startTime
                ? extractUTCTime(session.startTime)
                : "",
            endTime: session?.endTime ? extractUTCTime(session.endTime) : "",
        },
        validators: { onSubmit: availabilitySchema },
        onSubmit: async ({ value }) => {
            console.log(value);
            await mutateAsync({
                id: id,
                data: {
                    startDate: value.startDate,
                    endDate: value.endDate,
                    dayOfWeek: value.dayOfWeek,
                    startTime: value.startTime,
                    endTime: value.endTime,
                },
            });
            form.reset();
            router.push("/dashboard/tutor/availability");
        },
    });

    console.log("session", session);
    // console.log("form", TweleveFormatTime(session?.startTime || ""));

    // useEffect(() => {
    //     if (!session) return;

    //     form.setFieldValue("startDate", session.startDate.split("T")[0]);
    //     form.setFieldValue("endDate", session.endDate.split("T")[0]);
    //     form.setFieldValue("dayOfWeek", session.dayOfWeek);
    //     form.setFieldValue(
    //         "startTime",
    //         new Date(session.startTime).toISOString().slice(11, 16), // "16:00"
    //     );
    //     form.setFieldValue(
    //         "endTime",
    //         new Date(session.endTime).toISOString().slice(11, 16), // "18:00"
    //     );
    // }, [session?.id]);

    if (isLoading) {
        return (
            <div className="py-10 text-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    return (
        <div>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle>Edit Availability</CardTitle>
                    </div>
                    <Link href={"/dashboard/tutor/availability"} className="">
                        <Button className="cursor-pointer">Cancel</Button>
                    </Link>
                </CardHeader>

                <CardContent>
                    <form
                        id="availability-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                    >
                        <FieldGroup>
                            {/* Date Range */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <form.Field
                                    name="startDate"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>Start Date</FieldLabel>
                                            <Input
                                                type="date"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {field.state.meta.isTouched &&
                                                !field.state.meta.isValid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                        </Field>
                                    )}
                                />
                                <form.Field
                                    name="endDate"
                                    children={(field) => (
                                        <Field>
                                            <FieldLabel>End Date</FieldLabel>
                                            <Input
                                                type="date"
                                                value={field.state.value}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {field.state.meta.isTouched &&
                                                !field.state.meta.isValid && (
                                                    <FieldError
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <form.Field
                                name="dayOfWeek"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel>Day</FieldLabel>
                                        <Select value={field.state.value}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DAYS.map((d) => (
                                                    <SelectItem
                                                        key={d.value}
                                                        value={d.value}
                                                    >
                                                        {d.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />

                            <form.Field
                                name="startTime"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel>Start Time</FieldLabel>
                                        <Input
                                            type="time"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {field.state.meta.isTouched &&
                                            !field.state.meta.isValid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                    </Field>
                                )}
                            />

                            <form.Field
                                name="endTime"
                                children={(field) => (
                                    <Field>
                                        <FieldLabel>End Time</FieldLabel>
                                        <Input
                                            type="time"
                                            value={field.state.value}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {field.state.meta.isTouched &&
                                            !field.state.meta.isValid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                    </Field>
                                )}
                            />

                            <Button
                                form="availability-form"
                                type="submit"
                                className="w-full"
                                disabled={isPending}
                            >
                                {isPending ? "Saving..." : "Save Availability"}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
