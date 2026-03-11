"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Plus, X, Pencil } from "lucide-react";

import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const profileSchema = z.object({
    phoneNumber: z.string().optional(),
    college: z.string().min(2, "College name is required"),
    degree: z.string().min(2, "Degree is required"),
    branch: z.string().min(2, "Branch is required"),
    cgpa: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) <= 10 && parseFloat(val) >= 0, "Valid CGPA required (0-10)"),
    graduationYear: z.string().regex(/^\d{4}$/, "Valid year required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function StudentProfile() {
    const queryClient = useQueryClient();
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ["student-profile"],
        queryFn: async () => {
            try {
                const response = await client.get("/students/profile");
                // Update local skills state if profile exists
                if (response.data && response.data.skills) {
                    setSkills(response.data.skills);
                }
                return response.data;
            } catch {
                return null; // Initial state if no profile created
            }
        },
    });

    useEffect(() => {
        if (!isLoading && !profile) {
            setIsEditing(true);
        }
    }, [isLoading, profile]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        values: {
            phoneNumber: profile?.phoneNumber || "",
            college: profile?.college || "",
            degree: profile?.degree || "",
            branch: profile?.branch || "",
            cgpa: profile?.cgpa?.toString() || "",
            graduationYear: profile?.graduationYear?.toString() || "",
        },
    });

    const addSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
        if ("key" in e && e.key !== "Enter") return;
        e.preventDefault();
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const updateProfile = useMutation({
        mutationFn: async (data: ProfileFormValues) => {
            const payload = {
                ...data,
                cgpa: parseFloat(data.cgpa),
                graduationYear: parseInt(data.graduationYear, 10),
                skills,
            };

            if (profile) {
                return await client.patch("/students/profile", payload);
            } else {
                return await client.post("/students/profile", payload);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["student-profile"] });
            toast.success("Profile saved successfully!");
            setIsEditing(false);
        },
        onError: (error: Error & { response?: any }) => {
            toast.error(error.response?.data?.message || "Failed to save profile. Please try again.");
        },
    });

    const onSubmit = (data: ProfileFormValues) => {
        updateProfile.mutate(data);
    };

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isEditing && profile) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Academic Profile</h1>
                        <p className="text-muted-foreground mt-2">
                            Your current academic details and skills.
                        </p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 hover:bg-white/5 transition-colors">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl border-white/5">
                    <CardHeader>
                        <CardTitle className="text-xl">Education Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            {profile.phoneNumber && (
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Phone</span>
                                    <p className="font-medium text-lg text-foreground/90">{profile.phoneNumber}</p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">College/University</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.college}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Degree</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.degree}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Branch/Major</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.branch}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">CGPA</span>
                                <p className="font-medium text-lg text-emerald-400">{profile.cgpa} <span className="text-muted-foreground text-sm">/ 10</span></p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Graduation Year</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.graduationYear}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 mt-2 border-t border-border/40">
                            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Technical Skills</span>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.length ? (
                                    profile.skills.map((skill: string) => (
                                        <Badge key={skill} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border border-primary/20">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm italic text-muted-foreground">No skills added yet</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{profile ? "Edit Academic Profile" : "Create Academic Profile"}</h1>
                    <p className="text-muted-foreground mt-2">
                        Update your academic details and skills. This information is used by the ATS system.
                    </p>
                </div>
                {profile && (
                    <Button onClick={() => setIsEditing(false)} variant="ghost" className="text-muted-foreground hover:text-foreground">
                        Cancel
                    </Button>
                )}
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl border-white/5">
                <CardHeader>
                    <CardTitle>Education Details</CardTitle>
                    <CardDescription>
                        Provide your current college, degree, and GPA.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="e.g. +91 9876543210"
                                    {...register("phoneNumber")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="college">College/University</Label>
                                <Input
                                    id="college"
                                    placeholder="e.g. Stanford University"
                                    {...register("college")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.college && <p className="text-xs text-destructive">{errors.college.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input
                                    id="degree"
                                    placeholder="e.g. B.Tech"
                                    {...register("degree")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.degree && <p className="text-xs text-destructive">{errors.degree.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branch">Branch/Major</Label>
                                <Input
                                    id="branch"
                                    placeholder="e.g. Computer Science"
                                    {...register("branch")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.branch && <p className="text-xs text-destructive">{errors.branch.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cgpa">CGPA (out of 10)</Label>
                                <Input
                                    id="cgpa"
                                    placeholder="e.g. 8.5"
                                    {...register("cgpa")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.cgpa && <p className="text-xs text-destructive">{errors.cgpa.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="graduationYear">Graduation Year</Label>
                                <Input
                                    id="graduationYear"
                                    placeholder="e.g. 2025"
                                    maxLength={4}
                                    {...register("graduationYear")}
                                    className="bg-black/20 focus-visible:ring-primary h-12"
                                />
                                {errors.graduationYear && <p className="text-xs text-destructive">{errors.graduationYear.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="space-y-2">
                                <Label>Technical Skills</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. React, Python, Node.js"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={addSkill}
                                        className="flex-1 bg-black/20 focus-visible:ring-primary h-12"
                                    />
                                    <Button type="button" onClick={addSkill} variant="secondary" className="h-12 border border-white/10 hover:bg-white/5 text-foreground transition-all">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {skills.length === 0 && (
                                        <span className="text-sm text-muted-foreground italic">No skills added yet</span>
                                    )}
                                    {skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="px-3 py-1 flex items-center bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(skill)}
                                                className="ml-2 hover:text-destructive transition-colors outline-none"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={updateProfile.isPending} className="h-12 px-8 text-base shadow-glow-primary hover:scale-[1.02] transition-all">
                                {updateProfile.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Profile
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
