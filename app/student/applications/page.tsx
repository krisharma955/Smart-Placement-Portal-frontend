"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Building2, Search, Filter, Loader2 } from "lucide-react";

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
import { useState } from "react";

export default function StudentApplicationsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["student-applications"],
        queryFn: async () => {
            try {
                const response = await client.get("/applications/student");
                return response.data;
            } catch (error) {
                // Fallback for mock environment
                return [
                    {
                        id: "1",
                        createdAt: new Date().toISOString(),
                        status: "SHORTLISTED",
                        job: {
                            title: "Frontend Developer",
                            company: { name: "Google" },
                            location: "Bangalore",
                        }
                    },
                    {
                        id: "2",
                        createdAt: new Date().toISOString(),
                        status: "UNDER_REVIEW",
                        job: {
                            title: "Software Engineer",
                            company: { name: "Microsoft" },
                            location: "Hyderabad",
                        }
                    },
                    {
                        id: "3",
                        createdAt: new Date().toISOString(),
                        status: "REJECTED",
                        job: {
                            title: "Data Analyst",
                            company: { name: "Meta" },
                            location: "Remote",
                        }
                    }
                ];
            }
        },
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPLIED": return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Applied</Badge>;
            case "UNDER_REVIEW": return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Under Review</Badge>;
            case "SHORTLISTED": return <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Shortlisted</Badge>;
            case "REJECTED": return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Rejected</Badge>;
            case "HIRED": return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Hired</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredApplications = applications.filter((app: any) =>
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
                    <p className="text-muted-foreground mt-2">
                        Track and manage all your job applications in one place.
                    </p>
                </div>
            </div>

            <Card className="glass border-white/10 relative overflow-hidden mt-6">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <CardHeader className="relative z-10 pb-6 border-b border-white/5 bg-black/20">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Application History</CardTitle>
                            <CardDescription className="text-muted-foreground/80 font-medium mt-1">
                                You have applied to <span className="text-foreground">{applications.length}</span> positions.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search applications..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10 bg-black/40 border-white/10 w-full md:w-[280px] focus-visible:ring-primary focus-visible:border-primary transition-all rounded-xl"
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
                            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            No applications found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-black/40 border-b border-white/10">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold text-muted-foreground h-12 px-6">Company</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Role</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Location</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12">Applied Date</TableHead>
                                        <TableHead className="font-semibold text-muted-foreground h-12 px-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApplications.map((app: any, idx: number) => (
                                        <TableRow key={app.id} className={`hover:bg-white/[0.02] transition-colors border-b border-white/5 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-black/10'}`}>
                                            <TableCell className="font-medium px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-primary/80 group-hover:bg-primary/10 transition-colors">
                                                        <Building2 className="h-5 w-5" />
                                                    </div>
                                                    <span className="text-foreground font-semibold">{app.job?.company?.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <span className="font-medium text-foreground/90">{app.job?.title}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground py-4 text-sm font-medium">{app.job?.location}</TableCell>
                                            <TableCell className="text-muted-foreground py-4 text-sm font-medium">
                                                {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                                            </TableCell>
                                            <TableCell className="py-4 px-6">
                                                {getStatusBadge(app.status)}
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
