import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full py-6 border-t border-white/[0.06] bg-[#0A0A0F] mt-auto z-40 relative">
            <div className="container flex items-center justify-center text-sm text-muted-foreground">
                <span>Developed by </span>
                <Link
                    href="https://github.com/krisharma955"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center ml-1.5 font-medium transition-colors duration-200 hover:text-[#6366F1]"
                >
                    <span className="transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]">
                        Krish Sharma
                    </span>
                    <Github className="w-4 h-4 ml-1.5 transition-all duration-200 group-hover:text-[#6366F1] group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                </Link>
            </div>
        </footer>
    );
}
