"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSubjects, useTutors } from "@/hooks/use-Tutor";
import { useRouter, useSearchParams } from "next/navigation";

// Types
interface Subject {
    name: string;
}
interface TutorCategory {
    subject: Subject;
    hourlyRate: number;
}
interface User {
    name: string;
}
interface Tutor {
    id: string;
    user: User;
    bio: string;
    status: string;
    averageRating: number;
    tutorCategories: TutorCategory[];
}
interface ApiResponse {
    data: Tutor[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export default function TutorsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // filters
    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [subject, setSubject] = useState(searchParams.get("subject") ?? "");
    const [minPrice, setMinPrice] = useState(
        searchParams.get("minPrice") ?? "",
    );
    const [maxPrice, setMaxPrice] = useState(
        searchParams.get("maxPrice") ?? "",
    );
    // const [status, setStatus] = useState(searchParams.get("status") ?? "");

    // pagination
    const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
    const [limit, setLimit] = useState(Number(searchParams.get("limit") ?? 6));

    // update url when filter change
    const updateURL = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const { data, isLoading, isError, error, isFetching } = useTutors({
        page: String(page),
        limit: String(limit),
        search,
        subject,
        minPrice,
        maxPrice,
        // status,
        // sortBy: "desc",
    });
    const { data: subjectsData } = useSubjects();
    const subjects = subjectsData?.data ?? [];
    console.log(subjects);

    const tutors = data?.data.data ?? [];
    const totalPages = data?.data?.pagination.totalPages ?? 1;

    function handleFilterChange(setter: (v: string) => void, key: string) {
        return (value: string) => {
            setter(value);
            setPage(1);
            updateURL({ [key]: value });
        };
    }

    return (
        <section className="py-20">
            <div className="container max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8">Browse Tutors</h1>
                {/* FILTERS */}
                <div className="flex gap-4 mb-10">
                    <Input
                        placeholder="Search tutor"
                        value={search}
                        onChange={(e) =>
                            handleFilterChange(
                                setSearch,
                                "search",
                            )(e.target.value)
                        }
                    />

                    <select
                        className="border rounded-md px-3"
                        value={subject}
                        onChange={(e) =>
                            handleFilterChange(
                                setSubject,
                                "subject",
                            )(
                                e.target.value
                                    .toLocaleLowerCase()
                                    .split(" ")
                                    .join("-"),
                            )
                        }
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((sub: any) => (
                            <option value={sub.slug} key={sub.id}>
                                {sub.name}
                            </option>
                        ))}
                    </select>

                    <Input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) =>
                            handleFilterChange(
                                setMinPrice,
                                "minPrice",
                            )(e.target.value)
                        }
                    />

                    <Input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) =>
                            handleFilterChange(
                                setMaxPrice,
                                "maxPrice",
                            )(e.target.value)
                        }
                    />

                    {/* <select
                        className="border rounded-md px-3"
                        value={status}
                        onChange={(e) =>
                            handleFilterChange(setStatus)(e.target.value)
                        }
                    >
                        <option value="">All Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                    </select> */}
                </div>
                {isLoading && (
                    <p className="text-muted-foreground mb-6">Loading...</p>
                )}{" "}
                {isError && (
                    <p className="text-red-500 mb-6">
                        Error: {(error as Error).message}
                    </p>
                )}
                {isFetching && !isLoading && (
                    <p className="text-muted-foreground text-sm mb-4">
                        Updating…
                    </p>
                )}
                {!isLoading && !isError && tutors.length === 0 && (
                    <p className="text-muted-foreground mb-6">
                        No tutors found.
                    </p>
                )}
                {/* TUTORS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tutors.map((tutor: any) => {
                        const categories = tutor.tutorCategories;

                        return (
                            <Card key={tutor.id} className="flex flex-col">
                                <CardHeader className="flex flex-row items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>
                                            {tutor.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <h3 className="font-semibold">
                                            {tutor.user.name}
                                        </h3>

                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                                            {tutor.averageRating}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex flex-col flex-1 space-y-3">
                                    <div className="flex flex-wrap flex-1 gap-2 pb-2">
                                        {categories.map(
                                            (category: TutorCategory) => (
                                                <Badge
                                                    key={category.subject.name}
                                                >
                                                    {category?.subject.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>

                                    {/* <p className="text-sm text-muted-foreground">
                                        ${category?.hourlyRate} / hour
                                    </p> */}

                                    <p className="text-sm line-clamp-2 flex-1">
                                        {tutor.bio}
                                    </p>

                                    <Button asChild className="w-full">
                                        <Link href={`/tutors/${tutor.id}`}>
                                            View Profile
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                            // <Card key={tutor.id} className="flex flex-col">
                            //     <CardHeader className="flex flex-row items-center gap-3">
                            //         <Avatar>
                            //             <AvatarFallback>
                            //                 {tutor.user.name.charAt(0)}
                            //             </AvatarFallback>
                            //         </Avatar>
                            //         <div>
                            //             <h3 className="font-semibold">
                            //                 {tutor.user.name}
                            //             </h3>
                            //             <div className="flex items-center text-sm text-muted-foreground">
                            //                 <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            //                 {tutor.averageRating}
                            //             </div>
                            //         </div>
                            //     </CardHeader>

                            //     <CardContent className="flex flex-col flex-1 space-y-3">
                            //         <div className="flex flex-wrap gap-2">
                            //             {categories.map(
                            //                 (category: TutorCategory) => (
                            //                     <Badge
                            //                         key={category.subject.name}
                            //                     >
                            //                         {category.subject.name}
                            //                     </Badge>
                            //                 ),
                            //             )}
                            //         </div>
                            //         <p className="text-sm line-clamp-2 flex-1">
                            //             {tutor.bio}
                            //         </p>{" "}
                            //         {/* ✅ flex-1 pushes button down */}
                            //         <Button asChild className="w-full">
                            //             <Link href={`/tutors/${tutor.id}`}>
                            //                 View Profile
                            //             </Link>
                            //         </Button>
                            //     </CardContent>
                            // </Card>
                        );
                    })}
                </div>
                {/* PAGINATIONS  */}
                <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t pt-6">
                    {/* LIMIT CONTROL */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                            Results per page
                        </span>

                        <Select
                            value={String(limit)}
                            onValueChange={(value) => {
                                setLimit(Number(value));
                                setPage(1);
                            }}
                        >
                            <SelectTrigger className="w-30">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {[1, 3, 6, 9, 12, 20].map((opt) => (
                                    <SelectItem key={opt} value={String(opt)}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            disabled={page === 1}
                            onClick={() => {
                                setPage(page - 1);
                                const params = new URLSearchParams(
                                    searchParams.toString(),
                                );
                                params.set("page", String(page - 1));
                                router.push(`?${params.toString()}`);
                            }}
                        >
                            Previous
                        </Button>

                        <span className="text-sm text-muted-foreground">
                            Page <span className="font-medium">{page}</span> of{" "}
                            <span className="font-medium">{totalPages}</span>
                        </span>

                        <Button
                            variant="outline"
                            disabled={page === totalPages}
                            onClick={() => {
                                setPage(page + 1);
                                const params = new URLSearchParams(
                                    searchParams.toString(),
                                );
                                params.set("page", String(page + 1));
                                router.push(`?${params.toString()}`);
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
