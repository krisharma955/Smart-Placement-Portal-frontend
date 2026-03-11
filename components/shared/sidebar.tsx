"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Building2,
    Briefcase,
    FileText,
    LayoutDashboard,
    Users,
    UserCircle
} from "lucide-react";

interface SidebarProps {
    role: "STUDENT" | "COMPANY";
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const studentLinks = [
        { href: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/student/profile", icon: UserCircle, label: "Profile" },
        { href: "/student/jobs", icon: Briefcase, label: "Jobs" },
        { href: "/student/applications", icon: FileText, label: "Applications" },
        { href: "/student/resume", icon: FileText, label: "Resume & ATS" },
    ];

    const companyLinks = [
        { href: "/company/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/company/profile", icon: Building2, label: "Company Profile" },
        { href: "/company/jobs", icon: Briefcase, label: "Job Postings" },
        { href: "/company/applications", icon: Users, label: "Applications" },
    ];

    const links = role === "STUDENT" ? studentLinks : companyLinks;

    return (
        <nav className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-border/40 bg-background/95 backdrop-blur md:block">
            <div className="flex h-full flex-col py-6 pl-4 pr-3">
                <div className="space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;

                        return (
                            <Button
                                key={link.href}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start font-medium h-12 px-4 mb-2 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                )}
                                // @ts-expect-error asChild missing from ButtonProps
                                asChild
                            >
                                <Link href={link.href}>
                                    <Icon className={cn("mr-3 h-5 w-5 transition-transform duration-200", isActive && "scale-110")} />
                                    <span className="text-base">{link.label}</span>
                                </Link>
                            </Button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
