"use client";

import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { CheckCircle2, Lightbulb, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
    score: number;
    sections: {
        skills: number;
        experience: number;
        education: number;
        formatting: number;
    };
    missingKeywords: string[];
    suggestions: string[];
    strengths: string[];
}

export function ScoreDisplay({
    score = 0,
    sections = { skills: 0, experience: 0, education: 0, formatting: 0 },
    missingKeywords = [],
    suggestions = [],
    strengths = [],
}: ScoreDisplayProps) {
    const count = useMotionValue(0);
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const controls = animate(count, score, {
            duration: 2.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayScore(Math.round(latest))
        });
        return controls.stop;
    }, [score, count]);

    const getColorClass = (value: number) => {
        if (value <= 40) return "text-red-500 stroke-red-500 shadow-red-500/20";
        if (value <= 70) return "text-yellow-500 stroke-yellow-500 shadow-yellow-500/20";
        return "text-emerald-400 stroke-emerald-500 shadow-emerald-500/20";
    };

    const getProgressColor = (value: number) => {
        if (value <= 40) return ["bg-red-500/10", "bg-red-500"];
        if (value <= 70) return ["bg-yellow-500/10", "bg-yellow-500"];
        return ["bg-emerald-500/10", "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"];
    };

    const circleLength = 339.29; // 2 * pi * r (r=54)
    const strokeDashoffset = circleLength - (score / 100) * circleLength;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 mt-8">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                <Card className="flex flex-col items-center justify-center p-8 glass border-white/5 relative overflow-hidden group hover:shadow-glow-primary transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <CardHeader className="text-center p-0 mb-8 relative z-10">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Overall Match</CardTitle>
                        <CardDescription className="text-primary/80 font-medium">ATS Compatibility Score</CardDescription>
                    </CardHeader>

                    <div className="relative w-64 h-64 flex items-center justify-center mb-4">
                        {/* Background Drop Shadow Glow */}
                        <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${getColorClass(displayScore).split(" ")[0].replace('text-', 'bg-')}`} />

                        {/* SVG Rings */}
                        <svg className="w-full h-full transform -rotate-90 pointer-events-none drop-shadow-2xl" viewBox="0 0 120 120">
                            {/* Inner Track */}
                            <circle
                                cx="60"
                                cy="60"
                                r="54"
                                className="stroke-white/5 fill-black/20"
                                strokeWidth="12"
                            />
                            {/* Animated Progress Circle */}
                            <motion.circle
                                cx="60"
                                cy="60"
                                r="54"
                                className={`fill-none ${getColorClass(score).split(" ")[1]}`}
                                strokeWidth="12"
                                strokeLinecap="round"
                                style={{
                                    filter: `drop-shadow(0 0 8px ${getColorClass(score).includes('emerald') ? 'rgba(16,185,129,0.6)' : getColorClass(score).includes('yellow') ? 'rgba(234,179,8,0.6)' : 'rgba(239,68,68,0.6)'})`
                                }}
                                initial={{ strokeDasharray: circleLength, strokeDashoffset: circleLength }}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }} // smooth apple-style spring ease
                            />
                        </svg>

                        {/* Center Score Text */}
                        <div className="absolute flex flex-col items-center justify-center">
                            <motion.span
                                className={`text-6xl font-black tracking-tighter tabular-nums ${getColorClass(displayScore).split(" ")[0]} drop-shadow-md`}
                            >
                                {displayScore}
                            </motion.span>
                            <span className="text-sm font-bold text-muted-foreground mt-1 tracking-widest uppercase">/ 100</span>
                        </div>
                    </div>
                </Card>

                <Card className="glass flex flex-col border-white/5 relative overflow-hidden group hover:shadow-glow-primary transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <CardHeader className="pb-4 relative z-10 z-10 border-b border-white/5 bg-black/20">
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">Section Breakdown</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">How your resume performs in each key area</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8 flex-1 flex flex-col justify-center">
                        {[
                            { label: "Skills Match", value: sections.skills },
                            { label: "Experience", value: sections.experience },
                            { label: "Education", value: sections.education },
                            { label: "Formatting & Layout", value: sections.formatting },
                        ].map((section, idx) => {
                            const [bg, fill] = getProgressColor(section.value);
                            return (
                                <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-center text-sm font-semibold">
                                        <span className="text-foreground/90">{section.label}</span>
                                        <span className={getColorClass(section.value).split(" ")[0]}>
                                            {section.value}%
                                        </span>
                                    </div>
                                    <div className={`h-3 w-full rounded-full overflow-hidden ${bg} shadow-inner`}>
                                        <motion.div
                                            className={`h-full ${fill} rounded-full relative overflow-hidden`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${section.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="glass flex flex-col border-white/5 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(239,68,68,0.1)] transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                    <CardHeader className="pb-4 relative z-10 border-b border-white/5 bg-black/20">
                        <CardTitle className="flex items-center text-red-500 font-bold">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            Missing Keywords
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Important terms missing from your resume</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 relative z-10">
                        {missingKeywords.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {missingKeywords.map((kw, i) => (
                                    <motion.div
                                        key={kw}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1 + i * 0.1 }}
                                    >
                                        <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10 px-3 py-1 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                            {kw}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm flex items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                                Your resume covers all key terms!
                            </p>
                        )}

                        <div className="mt-8 space-y-4">
                            <h4 className="font-semibold flex items-center text-yellow-500 text-sm tracking-wide uppercase">
                                <Lightbulb className="mr-2 h-4 w-4" />
                                Suggestions for Improvement
                            </h4>
                            <ul className="space-y-3">
                                {suggestions.map((suggestion, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.5 + idx * 0.1 }}
                                        className="flex gap-4 text-sm text-foreground/80 bg-black/40 p-4 rounded-xl border border-white/5"
                                    >
                                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-xs shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                            {idx + 1}
                                        </span>
                                        <span className="leading-relaxed">{suggestion}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass flex flex-col border-white/5 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all duration-500">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                    <CardHeader className="pb-4 relative z-10 border-b border-white/5 bg-black/20">
                        <CardTitle className="flex items-center text-emerald-500 font-bold">
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Your Strengths
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">What you did exceptionally well</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 relative z-10">
                        <ul className="space-y-4">
                            {strengths.map((str, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.5 + idx * 0.1 }}
                                    className="flex gap-4 text-sm text-foreground/90 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors"
                                >
                                    <div className="flex-shrink-0 mt-0.5">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    </div>
                                    <span className="leading-relaxed font-medium">{str}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
