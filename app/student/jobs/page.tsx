"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Building2,
    MapPin,
    Banknote,
    BriefcaseIcon,
    Search,
    Filter,
    Loader2
} from "lucide-react";

import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function StudentJobsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ["all-jobs"],
        queryFn: async () => {
            try {
                const response = await client.get("/jobs");
                return response.data;
            } catch (error) {
                // Fallback mock jobs if API is unavailable
                return [
                    {
                        id: "1",
                        title: "Frontend Engineer",
                        company: { name: "Vercel" },
                        location: "Remote",
                        type: "FULL_TIME",
                        salaryRange: "$120k - $150k",
                        skills: ["React", "Next.js", "TypeScript"],
                        description: "Build the future of the web with us."
                    },
                    {
                        id: "2",
                        title: "Backend Developer",
                        company: { name: "Stripe" },
                        location: "San Francisco, CA",
                        type: "FULL_TIME",
                        salaryRange: "$140k - $170k",
                        skills: ["Node.js", "Go", "PostgreSQL"],
                        description: "Scale payment infrastructure globally."
                    },
                ];
            }
        },
    });

    const handleApply = async (jobId: string) => {
        try {
            await client.post(`/applications/${jobId}`);
            toast.success("Successfully applied to the job!");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to apply. You might have already applied.");
        }
    };

    const filteredJobs = jobs.filter((job: any) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
                    <p className="text-muted-foreground mt-2">
                        Discover and apply to open positions from top companies.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-card/50 p-4 rounded-2xl glass border-white/10 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by role or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-black/40 border-white/10 transition-all rounded-xl text-md focus-visible:ring-primary focus-visible:border-primary w-full"
                    />
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-12 px-6 bg-black/40 border-white/10 hover:bg-white/5 hover:text-white rounded-xl transition-all group">
                        <Filter className="h-4 w-4 mr-2 group-hover:text-primary transition-colors" />
                        Filters
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No jobs found matching your criteria.
                        </div>
                    ) : (
                        filteredJobs.map((job: any) => (
                            <Card key={job.id} className="flex flex-col glass border-white/5 relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-primary group">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-primary/20 pointer-events-none" />
                                <CardHeader className="p-5 pb-4 relative z-10 border-b border-white/5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center text-muted-foreground mt-1.5 border border-white/10 bg-black/20 w-max px-2.5 py-1 rounded-full text-xs font-medium">
                                                <Building2 className="h-3.5 w-3.5 mr-1.5 text-primary/70" />
                                                <span>{job.company?.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {job.type === "FULL_TIME" && (
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20">
                                                Full-Time
                                            </Badge>
                                        )}
                                        {job.type === "INTERNSHIP" && (
                                            <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border-violet-500/20">
                                                Internship
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 p-5 relative z-10">
                                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 text-primary">
                                                <MapPin className="h-4 w-4" />
                                            </div>
                                            {job.location}
                                        </div>
                                        {job.salaryRange && (
                                            <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                                <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center mr-3 text-emerald-500">
                                                    <Banknote className="h-4 w-4" />
                                                </div>
                                                {job.salaryRange}
                                            </div>
                                        )}
                                        <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                            <div className="w-8 h-8 rounded-md bg-violet-500/10 flex items-center justify-center mr-3 text-violet-500">
                                                <BriefcaseIcon className="h-4 w-4" />
                                            </div>
                                            {job.experienceLevel || "Entry Level"}
                                        </div>
                                    </div>

                                    {job.skills && job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {job.skills.slice(0, 3).map((skill: string) => (
                                                <Badge key={skill} variant="outline" className="bg-black/40 border-white/10 text-muted-foreground">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {job.skills.length > 3 && (
                                                <Badge variant="outline" className="bg-black/40 border-white/10 text-muted-foreground">
                                                    +{job.skills.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="p-5 pt-0 relative z-10">
                                    <Button
                                        className="w-full relative overflow-hidden group/btn h-11 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                                        onClick={() => handleApply(job.id)}
                                        variant="outline"
                                    >
                                        <span className="relative z-10 flex items-center font-semibold">
                                            Apply Now
                                            <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </span>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
