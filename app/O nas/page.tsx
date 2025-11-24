import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-zinc-50 to-zinc-100 dark:from-black dark:via-gray-900 p-8">
            <main className="w-full max-w-3xl rounded-2xl bg-white/95 dark:bg-gray-900/80 border p-8 shadow-md">
                <h1 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-zinc-50">O projekcie</h1>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-6 mb-4">
                    Tutaj możesz wkleić pełny opis projektu: cel, sposób działania, korzyści dla użytkownika i
                    dodatkowe informacje o zadaniach oraz bezpieczeństwie danych.
                </p>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    <p>Możesz rozbudować tę stronę o sekcje: FAQ, Kontakt, Zespół itp.</p>
                </div>
                <div className="mt-6">
                    <Link href="/" className="text-sm text-foreground underline">
                        Powrót na stronę główną
                    </Link>
                </div>
            </main>
        </div>
    );
}