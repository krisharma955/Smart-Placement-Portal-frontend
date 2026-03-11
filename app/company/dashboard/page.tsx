"use client";

import { useQuery } from "@tanstack/react-query";
import {
    BriefcaseIcon,
    Users,
    CheckCircle2,
    TrendingUp,
    Building2,
    Clock
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
import { format } from "date-fns";

export default function CompanyDashboard() {
    const user = useAuthStore((state) => state.user);

    // Fetch company stats
    const { data: statsData, isLoading } = useQuery({
        queryKey: ["company-stats"],
        queryFn: async () => {
            try {
                const response = await client.get("/company/stats");
                return response.data;
            } catch (error) {
                // Mock data
                return {
                    activeJobs: 3,
                    totalApplications: 145,
                    shortlisted: 28,
                    hired: 5,
                };
            }
        },
    });

    const { data: recentApplications = [], isLoading: isAppsLoading } = useQuery({
        queryKey: ["company-recent-applications"],
        queryFn: async () => {
            try {
                const response = await client.get("/applications/company?limit=5");
                return response.data;
            } catch (error) {
                return [
                    {
                        id: "1",
                        applicant: { name: "Alice Smith", email: "alice@example.com" },
                        job: { title: "Frontend Developer" },
                        status: "APPLIED",
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: "2",
                        applicant: { name: "Bob Johnson", email: "bob@example.com" },
                        job: { title: "Backend Developer" },
                        status: "SHORTLISTED",
                        createdAt: new Date(Date.now() - 86400000).toISOString()
                    }
                ];
            }
        },
    });

    const stats = [
        {
            title: "Active Jobs",
            value: statsData?.activeJobs || 0,
            icon: BriefcaseIcon,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Total Applications",
            value: statsData?.totalApplications || 0,
            icon: Users,
            color: "text-violet-500",
            bgColor: "bg-violet-500/10",
        },
        {
            title: "Shortlisted",
            value: statsData?.shortlisted || 0,
            icon: CheckCircle2,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
        },
        {
            title: "Hired",
            value: statsData?.hired || 0,
            icon: TrendingUp,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative p-8 rounded-3xl overflow-hidden mb-8 border border-border/50 bg-card/30 backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 opacity-50 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">{user?.name || "Company"}</span> 👋
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Here's an overview of your hiring pipeline. Review applications and find the best talent.
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
                            <div className="text-4xl font-black tracking-tighter mt-2">
                                {isLoading ? (
                                    <div className="h-10 w-20 bg-muted/50 animate-pulse rounded-md" />
                                ) : (
                                    stat.value
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                    <CardTitle>Recent Candidates</CardTitle>
                    <CardDescription>
                        The latest candidates who applied to your open positions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isAppsLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : recentApplications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <div className="p-4 rounded-full bg-muted/50 mb-4">
                                <Users className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-lg font-medium">No candidates yet</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Once candidates apply to your jobs, they'll appear here.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Candidate</TableHead>
                                    <TableHead>Applied For</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentApplications.map((app: any) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{app.applicant?.name}</span>
                                                <span className="text-xs text-muted-foreground">{app.applicant?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{app.job?.title}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "N/A"}
                                        </TableCell>
                                        <TableCell className="capitalize text-muted-foreground text-xs font-medium">
                                            {app.status.replace("_", " ")}
                                        </TableCell>
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
