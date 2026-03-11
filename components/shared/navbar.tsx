"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Briefcase, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const getDashboardLink = () => {
        if (user?.role === "STUDENT") return "/student/dashboard";
        if (user?.role === "COMPANY") return "/company/dashboard";
        return "/";
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <Briefcase className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            Smart Placement Portal
                        </span>
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        {!user ? (
                            <>
                                <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                                    Log in
                                </Link>
                                <Link href="/signup" className={buttonVariants({ size: "sm" })}>
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="rounded-full outline-none hover:ring-2 hover:ring-primary/20 transition-all">
                                    <Avatar className="h-8 w-8 border border-primary/20">
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <Link href={getDashboardLink()} className="w-full h-full block">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Dashboard</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 cursor-pointer">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </nav>
                </div>
            </div>
        </nav>
    );
}
