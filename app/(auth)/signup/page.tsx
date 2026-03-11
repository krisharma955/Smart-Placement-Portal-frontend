"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { GraduationCap, Building2, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

import { useAuthStore } from "@/lib/store/auth";
import { client } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Role } from "@/lib/types";

const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [role, setRole] = useState<Role>("STUDENT");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        try {
            const response = await client.post("/auth/signup", {
                ...data,
                role,
            });

            let loggedInUser = response.data;
            let accToken = response.data.accessToken;
            let refToken = response.data.refreshToken || "";

            // If API didn't return tokens with signup, auto-login them immediately
            if (!accToken) {
                try {
                    const loginRes = await client.post("/auth/login", {
                        email: data.email,
                        password: data.password,
                    });
                    loggedInUser = loginRes.data;
                    accToken = loginRes.data.accessToken;
                    refToken = loginRes.data.refreshToken || "";
                } catch (loginErr) {
                    toast.success("Account created successfully! Please log in.");
                    router.push("/login");
                    setIsLoading(false);
                    return;
                }
            }

            if (loggedInUser && accToken) {
                setAuth(loggedInUser, accToken, refToken);
                toast.success("Account created successfully!");

                if (role === "STUDENT") {
                    router.push("/student/dashboard");
                } else {
                    router.push("/company/dashboard");
                }
            } else {
                toast.success("Account created successfully! Please log in.");
                router.push("/login");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-10">
            <div className="absolute inset-0 z-0 pointer-events-none bg-grid-white/[0.02]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <Card className="glass-elevated border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <CardHeader className="text-center space-y-2 relative z-10 pt-8 pb-4">
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-white mb-1">Create an account</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                            Choose your role and enter your details to get started.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 relative z-10 px-6 sm:px-8">
                        {/* Segmented Control */}
                        <div className="flex p-1 space-x-1 bg-black/40 border border-white/5 rounded-xl relative">
                            <button
                                type="button"
                                onClick={() => setRole("STUDENT")}
                                className={`relative flex-1 flex items-center justify-center py-3 text-sm font-semibold transition-all rounded-lg z-10 ${role === "STUDENT" ? "text-primary shadow-sm" : "text-muted-foreground hover:text-white"
                                    }`}
                            >
                                {role === "STUDENT" && (
                                    <motion.div
                                        layoutId="signup-role-bg"
                                        className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10 backdrop-blur-md"
                                    />
                                )}
                                <span className="relative z-10 flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Student
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("COMPANY")}
                                className={`relative flex-1 flex items-center justify-center py-3 text-sm font-semibold transition-all rounded-lg z-10 ${role === "COMPANY" ? "text-primary shadow-sm" : "text-muted-foreground hover:text-white"
                                    }`}
                            >
                                {role === "COMPANY" && (
                                    <motion.div
                                        layoutId="signup-role-bg"
                                        className="absolute inset-0 bg-white/10 rounded-lg shadow-sm border border-white/10 backdrop-blur-md"
                                    />
                                )}
                                <span className="relative z-10 flex items-center">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Company
                                </span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2 text-left">
                                <Label htmlFor="name" className="text-foreground/80 font-medium">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="h-12 bg-black/20 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-base placeholder:text-muted-foreground/50"
                                    disabled={isLoading}
                                    {...register("name")}
                                />
                                {errors.name && (
                                    <p className="text-xs text-destructive font-medium">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 text-left">
                                <Label htmlFor="email" className="text-foreground/80 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-12 bg-black/20 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-base placeholder:text-muted-foreground/50"
                                    disabled={isLoading}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2 text-left">
                                <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="h-12 bg-black/20 border-white/10 focus-visible:ring-primary focus-visible:border-primary transition-all text-base placeholder:text-muted-foreground/50 pr-10"
                                        disabled={isLoading}
                                        {...register("password")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-destructive font-medium">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all mt-6" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                )}
                                Create account
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-white/5 pt-6 pb-6 bg-black/10 mt-2 relative z-10">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
