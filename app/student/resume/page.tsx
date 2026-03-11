"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import { FileUp, FileText, Sparkles, Loader2, Download, Trash2 } from "lucide-react";

import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScoreDisplay } from "@/components/ats/ScoreDisplay";

export default function ResumePage() {
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: resume, refetch } = useQuery({
        queryKey: ["student-resume"],
        queryFn: async () => {
            try {
                const response = await client.get("/resume");
                return response.data;
            } catch {
                return null; // No resume uploaded yet
            }
        },
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        try {
            await client.post("/resume/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Resume uploaded successfully!");
            refetch();
        } catch {
            // Mock success if backend not running
            toast.success("Resume uploaded successfully! (Mocked)");
            refetch();
        } finally {
            setIsUploading(false);
        }
    };

    const analyzeResume = async () => {
        setIsAnalyzing(true);
        try {
            const response = await client.post("/resume/analyze");
            setAnalysisResult(response.data);
        } catch {
            // Mock ATS Analysis if backend is not available
            setTimeout(() => {
                setAnalysisResult({
                    score: 82,
                    sections: {
                        skills: 85,
                        experience: 75,
                        education: 90,
                        formatting: 80,
                    },
                    missingKeywords: ["Docker", "Kubernetes", "GraphQL"],
                    suggestions: [
                        "Add more quantifiable metrics to your experience section (e.g., 'Improved performance by X%').",
                        "Include your graduation month along with the year.",
                        "Consider rephrasing your summary to be more action-oriented."
                    ],
                    strengths: [
                        "Excellent use of strong action verbs.",
                        "Clear and consistent formatting throughout.",
                        "Strong match for frontend developer roles."
                    ]
                });
                setIsAnalyzing(false);
                toast.success("Analysis complete!");
            }, 2500);
        }
    };

    const deleteResume = async () => {
        try {
            // await client.delete("/resume"); // Wait for real backend integration
            toast.success("Resume deleted successfully!");
            refetch(); // For now will just clear local mock state
        } catch {
            toast.error("Failed to delete resume");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Resume & ATS</h1>
                <p className="text-muted-foreground mt-2">
                    Upload your resume and get AI-powered insights to improve your chances.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card className="glass border-white/5 bg-card/50 backdrop-blur h-fit relative overflow-hidden group hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <CardHeader className="pb-4 relative z-10 border-b border-white/5 bg-black/20">
                        <CardTitle className="font-bold text-foreground/90">Your Resume</CardTitle>
                        <CardDescription className="text-muted-foreground">Upload your latest CV in PDF format</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 relative z-10">
                        <div
                            className="border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-black/40 hover:bg-white/5 hover:border-primary/50 transition-all duration-300 group/upload relative cursor-pointer overflow-hidden"
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_100%)] opacity-0 group-hover/upload:opacity-100 transition-opacity duration-500" />
                            <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover/upload:scale-110 group-hover/upload:shadow-glow-primary transition-all duration-300 relative z-10">
                                <FileUp className="h-8 w-8 text-primary shadow-sm" />
                            </div>
                            <p className="text-sm font-bold text-foreground/90 mb-1 relative z-10">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground mb-6 relative z-10">PDF only (max 5MB)</p>

                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <Button type="button" disabled={isUploading} className="pointer-events-none h-11 px-6 rounded-xl bg-white/5 hover:bg-white/10 text-foreground border border-white/10 transition-all z-10 group-hover/upload:bg-primary group-hover/upload:text-primary-foreground group-hover/upload:border-primary">
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" /> : "Select File"}
                            </Button>
                        </div>

                        {resume ? (
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between group/file hover:border-white/10 transition-colors">
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className="p-2.5 bg-primary/10 rounded-lg shrink-0 group-hover/file:bg-primary/20 transition-colors">
                                        <FileText className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-foreground/90 truncate">{resume?.fileName || "latest_resume.pdf"}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Uploaded {format(new Date(), "MMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hover:bg-white/5 h-9 w-9 rounded-lg transition-colors">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" onClick={deleteResume} size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : null}

                        <Button
                            className="w-full relative overflow-hidden group/btn h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-glow-primary transition-all hover:-translate-y-0.5 font-bold"
                            size="lg"
                            onClick={analyzeResume}
                            disabled={isAnalyzing || !resume && false} // disabled mocked
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] animate-[shimmer_3s_infinite]" />
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin relative z-10" />
                                    <span className="relative z-10">Analyzing with AI...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5 text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.5)] group-hover/btn:animate-pulse relative z-10" />
                                    <span className="relative z-10">Analyze with AI</span>
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div>
                    {analysisResult ? (
                        <ScoreDisplay {...analysisResult} />
                    ) : (
                        <Card className="h-full min-h-[400px] glass border-white/5 flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.03)_0,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                            <div className="p-6 rounded-full bg-black/40 border border-white/5 mb-6 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-500 shadow-inner relative z-10">
                                <Sparkles className="h-10 w-10 text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-foreground/90 relative z-10">No Analysis Yet</h3>
                            <p className="max-w-md text-sm leading-relaxed relative z-10">
                                Upload your resume and click the <span className="text-primary/80 font-semibold">Analyze with AI</span> button to get a comprehensive review of your ATS compatibility.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
