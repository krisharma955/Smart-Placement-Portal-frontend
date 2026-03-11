import { Sidebar } from "@/components/shared/sidebar";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-1">
            <Sidebar role="STUDENT" />
            <main className="flex-1 overflow-y-auto px-4 py-6 md:pl-72 md:pr-8">
                {children}
            </main>
        </div>
    );
}
