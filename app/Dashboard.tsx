import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-black dark:via-gray-900 p-8">
            <main className="w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-gray-900/80 border p-8 shadow-md">
                <h1 className="text-2xl font-semibold mb-2 text-slate-900 dark:text-zinc-50">Dashboard (placeholder)</h1>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                    To jest placeholder dashboarda.
                </p>
                <div className="flex gap-3">
                    <Link href="/public" className="text-sm text-foreground underline">
                        Powrót na stronę główną
                    </Link>
                </div>
            </main>
        </div>
    );
}