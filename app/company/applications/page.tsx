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
                // Since there is no /applications/company endpoint,
                // we first fetch all company jobs, then fetch applications for each job
                const jobsRes = await client.get("/jobs");
                const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.content || []);

                if (!jobs || jobs.length === 0) return [];

                // Fetch applications for all active/previous jobs
                const appPromises = jobs.map((job: any) =>
                    client.get(`/applications/job/${job.id}`)
                        .then(res => res.data)
                        // Ignore 404s/errors for individual jobs to continue loading others
                        .catch(() => [])
                );

                const allResponses = await Promise.all(appPromises);

                // Flatten and return all applications
                return allResponses.flat();
            } catch (error) {
                console.error("Failed to fetch applications:", error);
                return [];
            }
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await client.patch(`/applications/${id}/status`, { applicationStatus: status });
            return res.data;
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData(["company-applications"], (oldData: any[]) => {
                const current = oldData || [];
                return current.map((app: any) =>
                    app.id === variables.id ? { ...app, applicationStatus: variables.status } : app
                );
            });
            toast.success(`Status updated to ${variables.status.replace("_", " ")}`);
        },
        onError: () => {
            toast.error("Failed to update status. Please try again.");
        },
    });

    const viewResume = async (applicantName: string) => {
        try {
            // Note: The backend endpoint /resume/download does not take an applicant ID
            // in the path. It downloads the current logged-in user's resume.
            // Assuming there's a different way to view applicant resumes or this needs a backend change.
            // Using a generic GET or showing error for now.
            toast.info(`Resume download is not fully supported in the backend yet. Needs an endpoint that accepts applicandId.`);
        } catch {
            toast.error(`Could not load resume for ${applicantName}.`);
        }
    };

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
        (app.studentName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                                                        {app.studentName?.charAt(0) || "U"}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-foreground font-semibold">{app.studentName || "Unknown Applicant"}</span>
                                                        <span className="text-xs text-muted-foreground mt-0.5">{app.studentEmail}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground/90">{app.jobTitle}</span>
                                                    {app.jobType && <span className="text-xs text-muted-foreground">{app.jobType.replace("_", " ")}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-1 text-muted-foreground text-sm">
                                                    Not provided in API
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground py-4 text-sm font-medium">
                                                {app.appliedAt ? format(new Date(app.appliedAt), "MMM d, yyyy") : "N/A"}
                                            </TableCell>
                                            <TableCell className="py-4">
                                                {getStatusBadge(app.applicationStatus)}
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
                                                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors" onClick={() => viewResume(app.studentName)}>
                                                            <FileText className="mr-2 h-4 w-4 text-primary" />
                                                            View Resume
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors" onClick={() => window.location.href = `mailto:${app.studentEmail}`}>
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
                                                                            className={`cursor-pointer focus:bg-white/10 focus:text-white px-3 py-2 transition-colors ${app.applicationStatus === status ? "bg-primary/20 text-primary font-semibold" : ""}`}
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
