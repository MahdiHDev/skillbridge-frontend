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
import { useCreateAvailability } from "@/hooks/useAvailability";
import { DayOfWeek, SlotInput } from "@/services/availability.service";
import { useForm } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

export const DAYS: { value: DayOfWeek; label: string }[] = [
    { value: "MON", label: "Monday" },
    { value: "TUE", label: "Tuesday" },
    { value: "WED", label: "Wednesday" },
    { value: "THU", label: "Thursday" },
    { value: "FRI", label: "Friday" },
    { value: "SAT", label: "Saturday" },
    { value: "SUN", label: "Sunday" },
];

const availabilitySchema = z.object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    // slots: z
    //     .array(
    //         z.object({
    //             dayOfWeek: z.enum([
    //                 "MON",
    //                 "TUE",
    //                 "WED",
    //                 "THU",
    //                 "FRI",
    //                 "SAT",
    //                 "SUN",
    //             ]),
    //             startTime: z.string().min(1, "Start time is required"),
    //             endTime: z.string().min(1, "End time is required"),
    //         }),
    //     )
    //     .min(1, "Add at least one slot"),
});

export default function CreateAvailaiblity() {
    const { mutateAsync, isPending } = useCreateAvailability();
    const router = useRouter();

    const [slots, setSlots] = useState<SlotInput[]>([
        { dayOfWeek: "MON", startTime: "", endTime: "" },
    ]);

    const addSlot = () =>
        setSlots((prev) => [
            ...prev,
            { dayOfWeek: "MON", startTime: "", endTime: "" },
        ]);

    const removeSlot = (index: number) =>
        setSlots((prev) => prev.filter((_, i) => i !== index));

    const updateSlot = (index: number, field: keyof SlotInput, value: string) =>
        setSlots((prev) =>
            prev.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot,
            ),
        );

    const form = useForm({
        defaultValues: {
            startDate: "",
            endDate: "",
        },
        validators: { onSubmit: availabilitySchema },
        onSubmit: async ({ value }) => {
            const hasEmptySlot = slots.some((s) => !s.startTime || !s.endTime);
            if (hasEmptySlot) {
                toast.error("Please fill in all slot times");
                return;
            }

            console.log(value, slots, "submitted data");

            await mutateAsync({
                startDate: value.startDate,
                endDate: value.endDate,
                slots,
            });
            setSlots([{ dayOfWeek: "MON", startTime: "", endTime: "" }]);
            form.reset();
            router.push("/dashboard/tutor/availability");
        },
    });

    return (
        <div>
            <Card>
                <CardHeader className="flex justify-between items-center">
                    <div>
                        <CardTitle>New Availability</CardTitle>
                        <CardDescription>
                            Set a date range and add multiple day slots
                        </CardDescription>
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

                            {/* Slots */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        Time Slots
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSlot}
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                        Add Slot
                                    </Button>
                                </div>

                                {slots.map((slot, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-3 border rounded-lg"
                                    >
                                        {/* Day */}
                                        <Field>
                                            <FieldLabel>Day</FieldLabel>
                                            <Select
                                                value={slot.dayOfWeek}
                                                onValueChange={(val) =>
                                                    updateSlot(
                                                        index,
                                                        "dayOfWeek",
                                                        val,
                                                    )
                                                }
                                            >
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

                                        {/* Start Time */}
                                        <Field>
                                            <FieldLabel>Start</FieldLabel>
                                            <Input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) =>
                                                    updateSlot(
                                                        index,
                                                        "startTime",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>

                                        {/* End Time */}
                                        <Field>
                                            <FieldLabel>End</FieldLabel>
                                            <Input
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) =>
                                                    updateSlot(
                                                        index,
                                                        "endTime",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </Field>

                                        {/* Remove */}
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => removeSlot(index)}
                                            disabled={slots.length === 1}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

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
