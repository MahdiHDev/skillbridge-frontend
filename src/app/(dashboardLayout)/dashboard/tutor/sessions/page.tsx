"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteTeaching } from "@/hooks/teaching/useDeleteTeaching";
import { useGetTeachings } from "@/hooks/teaching/useGetTeaching";
import { TeachingSession } from "@/services/teaching.service";
import {
    BookOpen,
    Clock,
    Edit,
    Loader2,
    Plus,
    Star,
    Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const levelVariant: Record<string, "default" | "secondary" | "destructive"> = {
    BEGINNER: "secondary",
    INTERMEDIATE: "default",
    ADVANCED: "destructive",
};

const levelLabel: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
};

function SessionCard({
    session,
    onDelete,
    isDeleting,
}: {
    session: TeachingSession;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}) {
    return (
        <Card className="flex flex-col gap-2 p-5">
            <div className="flex items-start justify-between gap-2 p-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <h3 className="font-medium capitalize">
                        {session.subject.name}
                    </h3>
                </div>
                <Badge variant={levelVariant[session.level]}>
                    {levelLabel[session.level]}
                </Badge>
            </div>

            {session.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 px-4">
                    {session.description}
                </p>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto py-2 px-4 border-t">
                <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        <span>{session.experienceYears} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>${session.hourlyRate}/hr</span>
                    </div>
                    {session.isPrimary && (
                        <Badge variant="outline" className="ml-auto text-xs">
                            Primary
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                    <Link
                        href={`sessions/${session.id}/edit`}
                        className="cursor-pointer text-blue-600"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        className="cursor-pointer"
                        disabled={isDeleting}
                        onClick={() => onDelete(session.id)}
                    >
                        {isDeleting ? (
                            <Loader2
                                size={18}
                                color="red"
                                className="animate-spin"
                            />
                        ) : (
                            <Trash size={18} color="red" />
                        )}
                    </button>
                </div>
            </div>
        </Card>
    );
}

function SessionCardSkeleton() {
    return (
        <Card className="flex flex-col gap-3 p-5">
            <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-2 border-t">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
            </div>
        </Card>
    );
}

export default function SessionsPage() {
    const { data, isLoading, isError } = useGetTeachings();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { mutate: deleteSession } = useDeleteTeaching();

    const handleDelete = (id: string) => {
        setDeletingId(id);
        deleteSession(id, {
            onSettled: () => setDeletingId(null), // 👈 clear after done
        });
    };
    const sessions = data?.data ?? [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Teaching Sessions
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage the subjects you offer to students
                    </p>
                </div>
                <Button asChild>
                    <Link
                        href="/dashboard/tutor/sessions/create"
                        className="mt-4 md:mt-0"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Session
                    </Link>
                </Button>
            </div>

            {/* Error */}
            {isError && (
                <Card className="p-6 text-center text-muted-foreground">
                    Failed to load sessions. Please try again.
                </Card>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => (
                          <SessionCardSkeleton key={i} />
                      ))
                    : sessions.map((session) => (
                          <SessionCard
                              key={session.id}
                              session={session}
                              onDelete={handleDelete}
                              isDeleting={deletingId === session.id}
                          />
                      ))}
            </div>

            {/* Empty */}
            {!isLoading && !isError && sessions.length === 0 && (
                <Card className="p-10 text-center space-y-3">
                    <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                        No teaching sessions yet.
                    </p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/tutor/sessions/create">
                            Create your first session
                        </Link>
                    </Button>
                </Card>
            )}
        </div>
    );
}
