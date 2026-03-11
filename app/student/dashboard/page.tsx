"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Building2,
    BriefcaseIcon,
    CheckCircle2,
    Clock,
    TrendingUp,
    FileText
} from "lucide-react";

import { useAuthStore } from "@/lib/store/auth";
import { client } from "@/lib/api/client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
    const user = useAuthStore((state) => state.user);

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["student-applications"],
        queryFn: async () => {
            try {
                const response = await client.get("/applications/student");
                return response.data;
            } catch (e) {
                return [];
            }
        },
    });

    const stats = [
        {
            title: "Total Applications",
            value: applications.length.toString(),
            icon: FileText,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Shortlisted",
            value: applications.filter((a: any) => a.status === "SHORTLISTED").length.toString(),
            icon: CheckCircle2,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Under Review",
            value: applications.filter((a: any) => ["APPLIED", "UNDER_REVIEW"].includes(a.status)).length.toString(),
            icon: Clock,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            title: "Hired",
            value: applications.filter((a: any) => a.status === "HIRED").length.toString(),
            icon: TrendingUp,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative p-8 rounded-3xl overflow-hidden mb-8 border border-border/50 bg-card/30 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-50 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">{user?.name || "Student"}</span> 👋
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Here's an overview of your placement journey. Keep applying and tracking your progress!
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="glass group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-primary">
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${stat.bgColor.replace('/10', '')}`} />
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2.5 rounded-xl ${stat.bgColor} border border-white/5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-black tracking-tighter mt-2">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle>Recent Applications</CardTitle>
                    <CardDescription>
                        You have applied to {applications.length} jobs recently.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <BriefcaseIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">No applications yet</p>
                            <p className="text-sm text-muted-foreground max-w-sm mt-1">
                                Start applying to jobs to track your progress here.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Date Applied</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.slice(0, 5).map((app: any) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center space-x-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span>{app.job?.company?.name || "Company Name"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{app.job?.title || "Software Engineer"}</TableCell>
                                        <TableCell>
                                            {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "Recent"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
