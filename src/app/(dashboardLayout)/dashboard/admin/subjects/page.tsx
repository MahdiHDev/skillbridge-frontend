"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    useCreateSubject,
    useDeleteSubject,
    useSubjects,
    useUpdateSubject,
} from "@/hooks/useSubjects";
import { Subject } from "@/types/subject.types";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SubjectPage() {
    const { data, isLoading, isError } = useSubjects();
    const { mutate: createSubject, isPending: isCreating } = useCreateSubject();
    const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
    const { mutate: deleteSubject, isPending: isDeleting } = useDeleteSubject();

    const subjects: Subject[] = data?.data ?? [];

    // Create modal
    const [createOpen, setCreateOpen] = useState(false);
    const [createName, setCreateName] = useState("");

    // Edit modal
    const [editOpen, setEditOpen] = useState(false);
    const [editSubject, setEditSubject] = useState<Subject | null>(null);
    const [editName, setEditName] = useState("");

    // Delete modal
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);

    const handleCreate = () => {
        if (!createName.trim()) return;
        createSubject(
            { subject: createName.trim() },
            {
                onSuccess: () => {
                    setCreateOpen(false);
                    setCreateName("");
                },
            },
        );
    };

    const handleEditOpen = (subject: Subject) => {
        setEditSubject(subject);
        setEditName(subject.name);
        setEditOpen(true);
    };

    const handleUpdate = () => {
        if (!editSubject || !editName.trim()) return;
        updateSubject(
            { id: editSubject.id, data: { subject: editName.trim() } },
            {
                onSuccess: () => {
                    setEditOpen(false);
                    setEditSubject(null);
                },
            },
        );
    };

    const handleDeleteOpen = (subject: Subject) => {
        setDeleteTarget(subject);
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteSubject(deleteTarget.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setDeleteTarget(null);
            },
        });
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Subjects</h1>
                        <p className="text-sm text-muted-foreground">
                            {subjects.length} total subjects
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateOpen(true)}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Subject
                    </Button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <p className="text-center text-muted-foreground py-20 animate-pulse">
                        Loading subjects...
                    </p>
                ) : isError ? (
                    <p className="text-center text-red-500 py-20">
                        Failed to load subjects.
                    </p>
                ) : subjects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-20">
                        No subjects found. Add one to get started.
                    </p>
                ) : (
                    <div className="border rounded-xl  overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-left">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        #
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Created
                                    </th>
                                    <th className="px-4 py-3 font-medium text-muted-foreground">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {subjects.map((subject, index) => (
                                    <tr
                                        key={subject.id}
                                        className="bg-white dark:bg-[#141414] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors"
                                    >
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {subject.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {new Date(
                                                subject.createdAt,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEditOpen(subject)
                                                    }
                                                    className="p-1.5 rounded-md border text-blue-500 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteOpen(
                                                            subject,
                                                        )
                                                    }
                                                    className="p-1.5 rounded-md border text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Subject</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="create-name">Subject Name</Label>
                        <Input
                            id="create-name"
                            placeholder="e.g. Mathematics"
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleCreate()
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCreateOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={isCreating || !createName.trim()}
                        >
                            {isCreating ? "Creating..." : "Create"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Subject</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <Label htmlFor="edit-name">Subject Name</Label>
                        <Input
                            id="edit-name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleUpdate()
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            disabled={isUpdating || !editName.trim()}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Subject</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground py-2">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-foreground">
                            {deleteTarget?.name}
                        </span>
                        ? This action cannot be undone.
                    </p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
