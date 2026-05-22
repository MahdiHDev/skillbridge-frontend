"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/dateFormat";
import { useState } from "react";

const ROLE_COLORS: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-700",
    TUTOR: "bg-blue-100 text-blue-700",
    STUDENT: "bg-green-100 text-green-700",
};

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    BANNED: "bg-red-100 text-red-700",
};

export default function AdminUsersPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    const { data, isLoading } = useAdminUsers({
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
        role: role || undefined,
        sortOrder: "asc",
    });

    const { mutate: updateStatus, isPending } = useUpdateUserStatus();

    const users = data?.data?.data ?? [];
    const total = data?.data?.pagination.total ?? 0;
    const totalPages = data?.data?.pagination?.totalPages ?? 1;

    const handleStatusToggle = (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";
        updateStatus({ userId, status: newStatus });
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p className="text-sm text-muted-foreground">
                            {total} total users
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    />

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="BANNED">Banned</option>
                    </select>

                    <select
                        value={role}
                        onChange={(e) => {
                            setRole(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:bg-[#141414]"
                    >
                        <option value="">All Roles</option>
                        <option value="STUDENT">Student</option>
                        <option value="TUTOR">Tutor</option>
                        <option value="ADMIN">Admin</option>
                    </select>

                    {(search || status || role) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setRole("");
                                setPage(1);
                            }}
                            className="text-sm text-red-500 border border-red-200 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Table */}
                {isLoading ? (
                    <p className="text-center text-muted-foreground py-20 animate-pulse">
                        Loading users...
                    </p>
                ) : users.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No users found.
                    </p>
                ) : (
                    <div className="border rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Joined
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((user: any) => (
                                    <tr
                                        key={user.id}
                                        className="bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors overflow-x-scroll"
                                    >
                                        {/* Avatar + Name */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-stone-700 text-gray-600 dark:text-gray-300 flex items-center justify-center font-semibold text-sm shrink-0">
                                                    {user.name?.charAt(0) ??
                                                        "?"}
                                                </div>
                                                <span className="font-medium">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {user.email}
                                        </td>

                                        {/* Role */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-700"}`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[user.status] ?? "bg-gray-100 text-gray-700"}`}
                                            >
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* Joined */}
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDate(user.createdAt)}
                                        </td>

                                        {/* Action */}
                                        <td className="px-4 py-3">
                                            {user.role !== "ADMIN" && (
                                                <button
                                                    onClick={() =>
                                                        handleStatusToggle(
                                                            user.id,
                                                            user.status,
                                                        )
                                                    }
                                                    disabled={isPending}
                                                    className={`text-xs px-3 py-1.5 rounded-md border cursor-pointer disabled:opacity-50 transition-colors ${
                                                        user.status === "ACTIVE"
                                                            ? "text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                                                            : "text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950"
                                                    }`}
                                                >
                                                    {user.status === "ACTIVE"
                                                        ? "Ban"
                                                        : "Unban"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
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
        </section>
    );
}
