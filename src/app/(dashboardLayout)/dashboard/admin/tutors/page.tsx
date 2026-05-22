"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAdminTutors, useApproveTutor } from "@/hooks/use-Tutor";
import { formatDate } from "@/lib/dateFormat";
import { CheckCircle, Eye, Search, XCircle } from "lucide-react";
import { useState } from "react";

export default function AdminTutorsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [selectedTutor, setSelectedTutor] = useState<any>(null);

    const { data, isLoading } = useAdminTutors({
        search,
        status,
        page: String(page),
        limit: String(limit),
    });

    const { mutateAsync: approveTutor, isPending: isApproving } =
        useApproveTutor();

    const tutors = data?.data?.data ?? [];
    const totalPages = data?.data?.pagination?.totalPages ?? 1;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Approved
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        Pending
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        Rejected
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const handleApprove = async (
        tutorProfileId: string,
        status: "APPROVED" | "REJECTED",
    ) => {
        await approveTutor({ tutorProfileId, status });
        setSelectedTutor(null);
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Tutor Applications
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Review and approve tutor profile applications
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={status ?? "ALL"}
                        onValueChange={(val) => {
                            setStatus(val === "ALL" ? undefined : val);
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Status</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* TABLE */}
                {isLoading ? (
                    <p className="text-center text-muted-foreground py-20">
                        Loading...
                    </p>
                ) : tutors.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No tutor applications found.
                    </p>
                ) : (
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Tutor
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Email
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Applied
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {tutors.map((tutor: any) => (
                                        <tr
                                            key={tutor.id}
                                            className="hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {tutor.user.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {tutor.user.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {tutor.user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(tutor.status)}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(tutor.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setSelectedTutor(tutor)
                                                    }
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* PAGINATION */}
                {/* <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-muted-foreground">
                        Page <span className="font-medium">{page}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div> */}
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
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {[1, 5, 10, 20].map((opt) => (
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
                            onClick={() => setPage(page - 1)}
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
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* DETAIL DIALOG */}
            <Dialog
                open={!!selectedTutor}
                onOpenChange={(open) => !open && setSelectedTutor(null)}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tutor Application</DialogTitle>
                    </DialogHeader>

                    {selectedTutor && (
                        <div className="space-y-5">
                            {/* PROFILE */}
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold shrink-0">
                                    {selectedTutor.user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">
                                        {selectedTutor.user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedTutor.user.email}
                                    </p>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedTutor.status)}
                                    </div>
                                </div>
                            </div>

                            {/* BIO */}
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Bio</p>
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 leading-relaxed">
                                    {selectedTutor.bio}
                                </p>
                            </div>

                            {/* META */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Applied
                                    </p>
                                    <p className="font-medium">
                                        {formatDate(selectedTutor.createdAt)}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Role
                                    </p>
                                    <p className="font-medium">
                                        {selectedTutor.user.role}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Email Verified
                                    </p>
                                    <p className="font-medium">
                                        {selectedTutor.user.emailVerified
                                            ? "Yes"
                                            : "No"}
                                    </p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-muted-foreground text-xs mb-1">
                                        Account Status
                                    </p>
                                    <p className="font-medium">
                                        {selectedTutor.user.status}
                                    </p>
                                </div>
                            </div>

                            {/* SUBJECTS */}
                            {selectedTutor.tutorCategories?.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Subjects
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedTutor.tutorCategories.map(
                                            (cat: any) => (
                                                <Badge
                                                    key={cat.id}
                                                    variant="secondary"
                                                >
                                                    {cat.subject?.name}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FOOTER ACTIONS */}
                    {/* {selectedTutor?.status === "PENDING" && (
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                disabled={isApproving}
                                onClick={() =>
                                    handleApprove(selectedTutor.id, "REJECTED")
                                }
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isApproving}
                                onClick={() =>
                                    handleApprove(selectedTutor.id, "APPROVED")
                                }
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isApproving ? "Approving..." : "Approve"}
                            </Button>
                        </DialogFooter>
                    )} */}
                    {/* FOOTER ACTIONS */}
                    {selectedTutor?.status === "PENDING" && (
                        <DialogFooter className="gap-2">
                            <Button
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                disabled={isApproving}
                                onClick={() =>
                                    handleApprove(selectedTutor.id, "REJECTED")
                                }
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isApproving}
                                onClick={() =>
                                    handleApprove(selectedTutor.id, "APPROVED")
                                }
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isApproving ? "Approving..." : "Approve"}
                            </Button>
                        </DialogFooter>
                    )}

                    {selectedTutor?.status === "REJECTED" && (
                        <DialogFooter>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isApproving}
                                onClick={() =>
                                    handleApprove(selectedTutor.id, "APPROVED")
                                }
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {isApproving ? "Approving..." : "Re-approve"}
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
