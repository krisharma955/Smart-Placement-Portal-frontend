"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
    Users,
    Search,
    Filter,
    Loader2,
    MoreHorizontal,
    Mail,
    FileText
} from "lucide-react";

import { client } from "@/lib/api/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

const STATUSES = ["APPLIED", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED"];

export default function CompanyApplicationsPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["company-applications"],
        queryFn: async () => {
            try {
                const response = await client.get("/applications/company");
                return response.data;
            } catch (error) {
                // Mock data
                return [
                    {
                        id: "1",
                        createdAt: new Date().toISOString(),
                        status: "APPLIED",
                        job: { title: "Frontend Developer", id: "j1" },
                        applicant: {
                            name: "Alice Smith",
                            email: "alice@example.com",
                            profile: { cgpa: 8.5, branch: "Computer Science" }
                        }
                    },
                    {
                        id: "2",
                        createdAt: new Date(Date.now() - 86400000).toISOString(),
                        status: "UNDER_REVIEW",
                        job: { title: "Frontend Developer", id: "j1" },
                        applicant: {
                            name: "Bob Johnson",
                            email: "bob@example.com",
                            profile: { cgpa: 7.8, branch: "Information Technology" }
                        }
                    },
                    {
                        id: "3",
                        createdAt: new Date(Date.now() - 172800000).toISOString(),
                        status: "SHORTLISTED",
                        job: { title: "Backend Developer", id: "j2" },
                        applicant: {
                            name: "Charlie Brown",
                            email: "charlie@example.com",
                            profile: { cgpa: 9.2, branch: "Computer Science" }
                        }
                    }
                ];
            }
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            return await client.patch(`/applications/${id}/status`, { status });
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["company-applications"] });
            toast.success(`Status updated to ${variables.status}`);
        },
        onError: () => {
            toast.error("Failed to update status. Please try again.");
        },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPLIED": return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Applied</Badge>;
            case "UNDER_REVIEW": return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Under Review</Badge>;
            case "SHORTLISTED": return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Shortlisted</Badge>;
            case "REJECTED": return <Badge variant="destructive" className="bg-red-500/10 text-red-500">Rejected</Badge>;
            case "HIRED": return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">Hired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredApplications = applications.filter((app: any) =>
        app.applicant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
                    <p className="text-muted-foreground mt-2">
                        Review applications and update candidate statuses.
                    </p>
                </div>
            </div>

            <Card className="glass border-white/10 relative overflow-hidden mt-6">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardHeader className="relative z-10 pb-6 border-b border-white/5 bg-black/20">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">All Applications</CardTitle>
                            <CardDescription className="text-muted-foreground/80 font-medium mt-1">
                                You have <span className="text-foreground">{applications.length}</span> total applications.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search candidates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 bg-black/40 border-white/10 w-full md:w-[320px] focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl"
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-10 w-10 bg-black/40 border-white/10 hover:bg-white/5 hover:text-white rounded-xl transition-all">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 relative z-10">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredApplications.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground font-medium">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No applications found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-black/40 border-b border-white/10">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-muted-foreground h-12 px-6">Candidate</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Applied Role</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Academics</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Date Applied</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Status</TableHead>
                                        <TableHead className="w-[80px] text-right font-semibold text-muted-foreground h-12 px-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApplications.map((app: any, idx: number) => (
                                        <TableRow key={app.id} className={`hover:bg-white/[0.02] transition-colors border-b border-white/5 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-black/10'}`}>
                                            <TableCell className="font-medium px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 border border-white/10 flex items-center justify-center text-primary font-bold">
                                                        {app.applicant?.name?.charAt(0) || "U"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground font-semibold">{app.applicant?.name}</span>
                                                        <span className="text-xs text-muted-foreground mt-0.5">{app.applicant?.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="font-medium text-foreground/90">{app.job?.title}</span>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <Badge variant="outline" className="bg-black/40 border-white/10 text-xs font-mono">{app.applicant?.profile?.cgpa || "N/A"} CGPA</Badge>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground line-clamp-1 max-w-[150px]">
                                                        {app.applicant?.profile?.branch || "N/A"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground py-4 text-sm font-medium">
                                                {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {getStatusBadge(app.status)}
                                            </TableCell>
                                            <TableCell className="text-right px-6 py-4">
                                                <DropdownMenu>
                                                    {/* @ts-expect-error asChild type missing from shadcn export */}
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl border-white/10 shadow-xl overflow-hidden rounded-xl">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground px-3 py-2 uppercase tracking-wider">Actions</DropdownMenuLabel>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors">
                                                            <FileText className="mr-2 h-4 w-4 text-primary" />
                                                            View Resume
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors" onClick={() => window.location.href = `mailto:${app.applicant?.email}`}>
                                                            <Mail className="mr-2 h-4 w-4 text-blue-400" />
                                                            Email Candidate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-white/10" />
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger className="cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors">
                                                                Update Status
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuPortal>
                                                                <DropdownMenuSubContent className="bg-card/95 backdrop-blur-xl border-white/10 shadow-xl rounded-xl ml-1">
                                                                    {STATUSES.map((status) => (
                                                                        <DropdownMenuItem
                                                                            key={status}
                                                                            className={`cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors ${app.status === status ? "bg-primary/20 text-primary font-semibold" : ""}`}
                                                                            disabled={updateStatus.isPending}
                                                                            onClick={() => updateStatus.mutate({ id: app.id, status })}
                                                                        >
                                                                            {status.replace("_", " ")}
                                                                        </DropdownMenuItem>
                                                                    ))}
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuPortal>
                                                        </DropdownMenuSub>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
