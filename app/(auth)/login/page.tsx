"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Key, Eye, EyeOff } from "lucide-react";

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

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        try {
            const response = await client.post("/auth/login", data);

            // The backend returns AuthResponse = { accessToken, refreshToken, name, email, role }
            const user = response.data;
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken || "";

            if (!accessToken) {
                throw new Error("No authentication token received from the server.");
            }

            setAuth(user, accessToken, refreshToken);
            toast.success("Welcome back!");

            if (user?.role === "STUDENT") {
                router.push("/student/dashboard");
            } else {
                router.push("/company/dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-10">
            <div className="absolute inset-0 z-0 bg-grid-white/[0.02]" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="z-10 w-full max-w-[400px]"
            >
                <Card className="glass-elevated border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    <CardHeader className="text-center space-y-2 relative z-10">
                        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-2 shadow-glow-primary border border-primary/30">
                            <Key className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight text-white mb-1">Welcome back</CardTitle>
                        <CardDescription className="text-muted-foreground text-base">
                            Enter your email and password to access your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-foreground/80 font-medium">Password</Label>
                                </div>
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
                                    <></>
                                )}
                                Sign In
                            </Button>


                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-white/5 pt-6 pb-6 bg-black/10 mt-6 relative z-10">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1">
                                Sign up for free
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
