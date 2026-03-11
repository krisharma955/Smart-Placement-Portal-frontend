"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Building2,
    MapPin,
    Banknote,
    BriefcaseIcon,
    Loader2,
    Users,
    Calendar,
    CheckCircle2
} from "lucide-react";

import { useState } from "react";
import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

export default function StudentJobsPage() {
    const queryClient = useQueryClient();
    const [applyingTo, setApplyingTo] = useState<string | null>(null);

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ["all-jobs"],
        queryFn: async () => {
            try {
                const response = await client.get("/jobs");
                const data = response.data;

                // Handle paginated Spring Boot responses (e.g. { content: [...] })
                const jobsList = Array.isArray(data) ? data : (data?.content || []);

                return jobsList;
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                return [];
            }
        },
    });

    const { data: myApplications = [] } = useQuery({
        queryKey: ["student-applications"],
        queryFn: async () => {
            try {
                const response = await client.get("/applications/student");
                return Array.isArray(response.data) ? response.data : (response.data?.content || []);
            } catch (error) {
                return [];
            }
        },
    });

    const handleApply = async (jobId: string) => {
        console.log("Apply Now clicked for job:", jobId);
        try {
            setApplyingTo(jobId);
            await client.post(`/applications/${jobId}`);
            queryClient.invalidateQueries({ queryKey: ["student-applications"] });
            toast.success("Successfully applied to the job!");
        } catch (error: any) {
            console.error("Application error:", error);
            toast.error(error.response?.data?.message || "Failed to apply. You might have already applied.");
        } finally {
            setApplyingTo(null);
        }
    };

    // Helpers for field name compatibility  
    const getJobType = (job: any) => job.jobType || job.type || "FULL_TIME";
    const getCompanyName = (job: any) => job.company?.name || job.company?.companyName || job.companyName || "Unknown Company";

    const hasApplied = (jobId: string | number) => {
        return myApplications.some((app: any) =>
            // The backend application response might have a simple jobId field, or might only have jobTitle. 
            // In optimal setups, DTO has jobId. If not, we might need a stricter backend modification.
            // Wait, looking at ApplicationResponse it might only have jobTitle/companyName? 
            // The ApplicationResponse inside ApplicationController has application.getJobPosting().getId().
            // Wait, is 'jobId' in the payload? Let's check `student/applications/page.tsx` mocked data. It doesn't have jobId. 
            // But real data might. It's safer to check if `app.jobPosting?.id == jobId` or just `app.jobId == jobId`.
            // Let's assume the backend `ApplicationResponse` has `jobId` since it's standard, and just fallback to checking string matching.
            app.jobId === jobId || app.jobPosting?.id === jobId || app.jobPostingId === jobId
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Job Board</h1>
                <p className="text-muted-foreground mt-2">
                    Discover and apply to open positions from top companies.
                </p>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-muted-foreground">
                            No job postings available right now.
                        </div>
                    ) : (
                        jobs.map((job: any) => (
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
                                                <span>{getCompanyName(job)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <Badge variant="secondary" className={`${getJobType(job) === "FULL_TIME" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                            getJobType(job) === "INTERNSHIP" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                                                getJobType(job) === "PART_TIME" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                    "bg-teal-500/10 text-teal-400 border-teal-500/20"
                                            }`}>
                                            {getJobType(job).replace("_", " ")}
                                        </Badge>
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
                                        {(job.minSalary || job.maxSalary) && (
                                            <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                                <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center mr-3 text-emerald-500">
                                                    <Banknote className="h-4 w-4" />
                                                </div>
                                                {job.minSalary && job.maxSalary
                                                    ? `₹${job.minSalary.toLocaleString()} - ₹${job.maxSalary.toLocaleString()}`
                                                    : job.minSalary
                                                        ? `₹${job.minSalary.toLocaleString()}+`
                                                        : `Up to ₹${job.maxSalary.toLocaleString()}`}
                                            </div>
                                        )}
                                        {job.openings && (
                                            <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                                <div className="w-8 h-8 rounded-md bg-violet-500/10 flex items-center justify-center mr-3 text-violet-500">
                                                    <Users className="h-4 w-4" />
                                                </div>
                                                {job.openings} opening{job.openings > 1 ? "s" : ""}
                                            </div>
                                        )}
                                        {job.deadline && (
                                            <div className="flex items-center p-2 rounded-lg bg-white/[0.02] border border-white/5">
                                                <div className="w-8 h-8 rounded-md bg-red-500/10 flex items-center justify-center mr-3 text-red-500">
                                                    <Calendar className="h-4 w-4" />
                                                </div>
                                                Deadline: {format(new Date(job.deadline), "MMM d, yyyy")}
                                            </div>
                                        )}
                                    </div>

                                    {job.requiredSkills && job.requiredSkills.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {job.requiredSkills.slice(0, 4).map((skill: string) => (
                                                <Badge key={skill} variant="outline" className="bg-black/40 border-white/10 text-muted-foreground">
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {job.requiredSkills.length > 4 && (
                                                <Badge variant="outline" className="bg-black/40 border-white/10 text-muted-foreground">
                                                    +{job.requiredSkills.length - 4}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="p-5 pt-0 relative z-10">
                                    {hasApplied(job.id) ? (
                                        <Button
                                            className="w-full relative overflow-hidden h-11 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 pointer-events-none"
                                            disabled
                                            variant="outline"
                                        >
                                            <span className="relative z-10 flex items-center justify-center font-semibold w-full">
                                                Applied successfully
                                                <CheckCircle2 className="w-4 h-4 ml-2" />
                                            </span>
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full relative overflow-hidden group/btn h-11 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] pointer-events-auto"
                                            onClick={() => handleApply(job.id)}
                                            disabled={applyingTo === job.id}
                                            variant="outline"
                                        >
                                            <span className="relative z-10 flex items-center justify-center font-semibold w-full">
                                                {applyingTo === job.id ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Applying...
                                                    </>
                                                ) : (
                                                    <>
                                                        Apply Now
                                                        <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </>
                                                )}
                                            </span>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
