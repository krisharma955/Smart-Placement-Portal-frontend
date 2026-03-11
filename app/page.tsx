"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { BriefcaseIcon, GraduationCap, ArrowRight, Zap, Target, ShieldCheck, Code, PenTool, BarChart, Database, Star } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function LandingPage() {
  const { user } = useAuthStore();

  const getDashboardLink = () => {
    if (user?.role === "STUDENT") return "/student/dashboard";
    if (user?.role === "COMPANY") return "/company/dashboard";
    return "/";
  };
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Simplified Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-[#0A0A0F]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-grid-white/[0.02]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-1 w-full pt-28 pb-32 md:pt-40 md:pb-40 z-10">
        <div className="container flex flex-col items-center text-center px-4 md:px-6 relative">

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center px-4 py-2 mb-8 text-sm border rounded-full text-foreground/80 border-white/10 glass shadow-sm backdrop-blur-md"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-3 shadow-glow-primary animate-pulse" />
            V2: The Ultimate Upgrade
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem] max-w-5xl leading-[1.05]"
          >
            Launch Your Career <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-cyan-400 drop-shadow-sm">
              Smarter with AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-[700px] mt-8 text-lg text-muted-foreground sm:text-xl leading-relaxed"
          >
            The definitive platform bridging the gap between exceptional talent and hyper-growth companies. Beautiful, intelligent, and absurdly fast.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col w-full sm:w-auto sm:flex-row gap-6 mt-12"
          >
            {!user ? (
              <>
                <Link
                  href="/signup?role=STUDENT"
                  className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-medium group transition-all duration-300 shadow-glow-primary active:scale-[0.98]")}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Get Started as Student
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/signup?role=COMPANY"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gradient-border h-14 px-8 text-lg font-medium text-foreground hover:bg-white/5 backdrop-blur-md transition-all duration-300 active:scale-[0.98]")}
                >
                  <BriefcaseIcon className="w-5 h-5 mr-3" />
                  Post Jobs as Company
                </Link>
              </>
            ) : (
              <Link
                href={getDashboardLink()}
                className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg font-medium group transition-all duration-300 shadow-glow-primary active:scale-[0.98]")}
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
            className="w-full max-w-5xl mt-20 relative glass-elevated rounded-xl p-2 border-t border-white/10 shadow-2xl"
          >
            <div className="absolute inset-x-10 -bottom-10 h-10 bg-primary/20 blur-[100px] z-[-1]" />
            <div className="w-full h-8 flex items-center gap-2 px-4 border-b border-white/5 bg-black/40 rounded-t-lg backdrop-blur-md">
              <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
              <div className="ml-4 h-4 w-48 bg-white/5 rounded-full flex items-center px-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white/30 mr-2" />
                <div className="h-1.5 w-24 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="bg-[#0B0B10] w-full h-[400px] md:h-[550px] rounded-b-lg overflow-hidden relative flex flex-col md:flex-row text-left">

              {/* Fake Sidebar */}
              <div className="w-full md:w-56 h-full border-r border-white/5 p-4 flex flex-col gap-4 hidden md:flex bg-black/20">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <BriefcaseIcon className="w-5 h-5 text-primary" />
                  <span className="font-bold text-sm text-foreground/90">Placement Portal</span>
                </div>
                <div className="w-full py-2 px-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <BarChart className="w-4 h-4 text-primary" />
                  <div className="h-2 w-16 bg-primary/60 rounded-full" />
                </div>
                <div className="w-full py-2 px-3 rounded-lg hover:bg-white/5 flex items-center gap-3 opacity-60">
                  <Target className="w-4 h-4 text-white" />
                  <div className="h-2 w-20 bg-white/40 rounded-full" />
                </div>
                <div className="w-full py-2 px-3 rounded-lg hover:bg-white/5 flex items-center gap-3 opacity-60">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <div className="h-2 w-14 bg-white/40 rounded-full" />
                </div>
              </div>

              {/* Fake Main Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.05)_0%,transparent_80%)]">

                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Company Dashboard</h3>
                    <div className="h-2 w-48 bg-muted-foreground/30 rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div className="h-8 w-24 rounded-lg bg-white/10" />
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: "Total Views", val: "24,592", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
                    { label: "Applications", val: "1,204", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
                    { label: "Interviews", val: "86", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
                  ].map((stat, idx) => (
                    <div key={idx} className="flex-1 min-w-[140px] h-28 rounded-xl border border-white/5 bg-black/40 p-4 flex flex-col relative overflow-hidden">
                      <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl ${stat.bg} -mr-4 -mt-4`} />
                      <div className="h-2 w-20 bg-muted-foreground/40 rounded-full mb-auto" />
                      <div className={`text-3xl font-black ${stat.color} mb-1`}>{stat.val}</div>
                      <div className="h-1.5 w-12 bg-white/20 rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Fake Table / List */}
                <div className="flex-1 rounded-xl border border-white/5 bg-black/40 overflow-hidden flex flex-col">
                  <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-4 gap-4">
                    <div className="h-2 w-16 bg-muted-foreground/50 rounded-full" />
                    <div className="h-2 w-24 bg-muted-foreground/30 rounded-full ml-auto" />
                    <div className="h-2 w-12 bg-muted-foreground/30 rounded-full" />
                  </div>
                  <div className="p-4 flex flex-col gap-3">
                    {[1, 2, 3].map(row => (
                      <div key={row} className="h-14 rounded-lg bg-white/[0.02] border border-white/5 flex items-center px-4 gap-4 hover:bg-white/[0.04] transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
                        <div className="flex flex-col gap-2 flex-1">
                          <div className="h-2 w-32 bg-white/60 rounded-full" />
                          <div className="h-1.5 w-20 bg-muted-foreground/40 rounded-full" />
                        </div>
                        <div className={`h-6 w-20 rounded-full border flex items-center justify-center shrink-0 ${row === 1 ? 'border-emerald-500/30 bg-emerald-500/10' : row === 2 ? 'border-amber-500/30 bg-amber-500/10' : 'border-blue-500/30 bg-blue-500/10'}`}>
                          <div className={`h-1.5 w-8 rounded-full ${row === 1 ? 'bg-emerald-400' : row === 2 ? 'bg-amber-400' : 'bg-blue-400'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 z-10 relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-border/40" />
        <div className="container px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground w-full max-w-2xl mx-auto">
              Powerful tools designed to streamline the hiring process for both applicants and technical recruiters.
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 md:grid-cols-3 lg:gap-10"
          >
            {[
              {
                title: "Smart Job Search",
                description: "Find the perfect role with advanced filtering and matching algorithms that align your skills to the right jobs.",
                icon: Target,
                color: "text-blue-500",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                title: "AI Resume Scoring",
                description: "Upload your resume and get instant ATS compatibility feedback with actionable suggestions to improve your chances.",
                icon: Zap,
                color: "text-violet-500",
                bg: "bg-violet-500/10 border-violet-500/20",
              },
              {
                title: "Unified Tracking",
                description: "Keep tabs on all your applications in one unified dashboard. Know exactly where you stand with every company.",
                icon: ShieldCheck,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                className="group flex flex-col p-8 space-y-5 border border-border/40 rounded-3xl bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`p-4 rounded-2xl w-fit ${feature.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section (Logos) */}
      <section className="w-full py-16 border-t border-white/5 bg-[#0f0f13] z-10 relative">
        <div className="container px-4 md:px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-10 uppercase tracking-widest">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Mock Company Texts/Logos */}
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Google</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Microsoft</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Amazon</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Meta</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Netflix</h3>
            <h3 className="text-2xl font-bold tracking-tight text-white/80 hover:text-white transition-colors">Apple</h3>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="w-full py-24 z-10 relative bg-[#0A0A0F]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Explore Popular Categories
              </h2>
              <p className="mt-4 text-lg text-muted-foreground w-full max-w-2xl">
                Find the role that fits your passion and expertise.
              </p>
            </div>
            <Link href={user ? getDashboardLink() : "/signup"} className="text-primary hover:text-primary/80 font-medium flex items-center mt-4 md:mt-0 transition-colors">
              Browse all jobs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Software Engineering", icon: Code, count: "1,240 open roles", bg: "bg-blue-500/10", color: "text-blue-500", border: 'group-hover:border-blue-500/30' },
              { name: "Design & UX", icon: PenTool, count: "430 open roles", bg: "bg-fuchsia-500/10", color: "text-fuchsia-500", border: 'group-hover:border-fuchsia-500/30' },
              { name: "Marketing & Sales", icon: BarChart, count: "850 open roles", bg: "bg-emerald-500/10", color: "text-emerald-500", border: 'group-hover:border-emerald-500/30' },
              { name: "Data Science", icon: Database, count: "620 open roles", bg: "bg-amber-500/10", color: "text-amber-500", border: 'group-hover:border-amber-500/30' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  href="/signup"
                  className={`group flex items-start p-6 rounded-2xl glass transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block ${cat.border}`}
                >
                  <div className={`p-3 rounded-xl mr-4 ${cat.bg} group-hover:scale-110 transition-transform`}>
                    <cat.icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground/90 group-hover:text-foreground transition-colors">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-24 glass border-y border-white/5 relative z-10 overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-glow text-white">How placement works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Your journey to your dream job, simplified.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-white/5 border-dashed border-t border-white/10" />

            {[
              { step: "01", title: "Create Your Profile", desc: "Sign up and build your portfolio, update your academic details, and upload your resume for ATS scoring." },
              { step: "02", title: "Discover & Apply", desc: "Browse through hundreds of curated job posts. Apply with one click when your profile matches the requirements." },
              { step: "03", title: "Get Hired", desc: "Track your application status in real-time. Interview with top companies and land your dream offer." },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#0A0A0F] border border-white/10 flex items-center justify-center text-2xl font-bold text-primary z-10 shadow-glow-primary relative shrink-0">
                  {item.step}
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10" />
                </div>
                <h3 className="text-xl font-bold mt-4 text-foreground/90">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed max-w-[280px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 z-10 relative bg-[#0A0A0F]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center mb-16 text-glow text-white">
            Loved by students and recruiters
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Sharma", role: "Software Engineer @ Google", quote: "The ATS scoring feature completely changed my approach. I tailored my resume based on the feedback and landed 5 interviews in a week." },
              { name: "Priya Patel", role: "HR Manager @ Meta", quote: "As a recruiter, the quality of candidates we source from this portal is unmatched. The application filtering saves us countless hours." },
              { name: "Amit Kumar", role: "Frontend Developer @ Amazon", quote: "I love how easy it is to track all my applications in one dashboard. The UI is incredibly beautiful and intuitive." },
            ].map((test, i) => (
              <div key={i} className="glass hover:bg-white/[0.03] transition-colors p-8 flex flex-col justify-between rounded-3xl hover:-translate-y-2 duration-300">
                <div>
                  <div className="flex gap-1 text-yellow-500/80 mb-6">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />)}
                  </div>
                  <p className="text-muted-foreground italic mb-8 leading-relaxed text-lg">"{test.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-lg border border-primary/30 shadow-glow-primary">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base tracking-tight text-foreground/90">{test.name}</h4>
                    <p className="text-sm text-muted-foreground">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full py-32 relative z-10 overflow-hidden border-t border-white/5 bg-[#0f0f13]">
        <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

        <div className="container px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-[1.1] text-glow text-white">
            Ready to accelerate your career?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Join thousands of students and companies actively hiring on our platform today. It only takes 2 minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            {!user ? (
              <>
                <Link href="/signup?role=STUDENT" className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 text-lg font-bold shadow-glow-primary active:scale-[0.98] transition-all")}>
                  Create Student Profile
                </Link>
                <Link href="/signup?role=COMPANY" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gradient-border h-14 px-10 text-lg font-bold text-foreground hover:bg-white/5 backdrop-blur-md active:scale-[0.98] transition-all")}>
                  Post a Job Opening
                </Link>
              </>
            ) : (
              <Link href={getDashboardLink()} className={cn(buttonVariants({ size: "lg" }), "h-14 px-10 text-lg font-bold shadow-glow-primary active:scale-[0.98] transition-all")}>
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
