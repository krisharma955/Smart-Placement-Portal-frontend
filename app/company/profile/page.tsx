"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";

import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const companyProfileSchema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    website: z.string().optional().refine(val => !val || z.string().url().safeParse(val).success, "Must be a valid URL"),
    industry: z.string().min(2, "Industry is required"),
    description: z.string().min(10, "Description should be at least 10 characters"),
    location: z.string().min(2, "HQ Location is required"),
});

type CompanyProfileFormValues = z.infer<typeof companyProfileSchema>;

export default function CompanyProfile() {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { data: profile, isLoading } = useQuery({
        queryKey: ["company-profile"],
        queryFn: async () => {
            try {
                const response = await client.get("/companies/profile");
                return response.data;
            } catch (error) {
                return null; // Local mock init
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
    } = useForm<CompanyProfileFormValues>({
        resolver: zodResolver(companyProfileSchema),
        values: {
            companyName: profile?.companyName || "",
            website: profile?.website || "",
            industry: profile?.industry || "",
            description: profile?.description || "",
            location: profile?.location || "",
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (data: CompanyProfileFormValues) => {
            if (profile) {
                return await client.patch("/companies/profile", data);
            } else {
                return await client.post("/companies/profile", data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["company-profile"] });
            toast.success("Company profile saved successfully!");
            setIsEditing(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to save profile.");
        },
    });

    const onSubmit = (data: CompanyProfileFormValues) => {
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
                        <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
                        <p className="text-muted-foreground mt-2">
                            Your organization details that students will see when applying to your jobs.
                        </p>
                    </div>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="border-white/10 hover:bg-white/5 transition-colors">
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit Profile
                    </Button>
                </div>

                <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl border-white/5">
                    <CardHeader>
                        <CardTitle className="text-xl">Organization Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Company Name</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.companyName}</p>
                            </div>
                            {profile.website && (
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Website</span>
                                    <p className="font-medium text-lg text-foreground/90">
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                            {profile.website}
                                        </a>
                                    </p>
                                </div>
                            )}
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Industry</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.industry}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Headquarters Location</span>
                                <p className="font-medium text-lg text-foreground/90">{profile.location}</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 mt-2 border-t border-border/40">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">About the Company</span>
                                <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap mt-2">{profile.description}</p>
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
                    <h1 className="text-3xl font-bold tracking-tight">{profile ? "Edit Company Profile" : "Create Company Profile"}</h1>
                    <p className="text-muted-foreground mt-2">
                        Update the profile details that students will see when applying to your jobs.
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
                    <CardTitle>Organization Details</CardTitle>
                    <CardDescription>
                        Provide your basic company information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit, (errs) => console.log('Form errors:', errs))} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input
                                    id="companyName"
                                    placeholder="e.g. Acme Inc"
                                    {...register("companyName")}
                                />
                                {errors.companyName && <p className="text-xs text-destructive">{errors.companyName.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <Input
                                    id="website"
                                    placeholder="https://example.com"
                                    {...register("website")}
                                />
                                {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <Input
                                    id="industry"
                                    placeholder="e.g. Software, Finance, Healthcare"
                                    {...register("industry")}
                                />
                                {errors.industry && <p className="text-xs text-destructive">{errors.industry.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Headquarters Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. San Francisco, CA"
                                    {...register("location")}
                                />
                                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">About the Company</Label>
                            <Textarea
                                id="description"
                                placeholder="Briefly describe what your company does and why candidates should join."
                                className="min-h-[120px]"
                                {...register("description")}
                            />
                            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-border/40">
                            <Button type="submit" disabled={updateProfile.isPending}>
                                {updateProfile.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
