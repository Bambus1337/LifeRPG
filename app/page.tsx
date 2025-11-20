
"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/navbar/Navbar";
import Typewriter from "@/app/Typewriter";
import AuthForm from "@/app/AuthForm";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // jeśli token już jest — przekierować
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            router.push("/dashboard");
            return;
        }

        // nasłuchiwanie zmian w localStorage (np. inna karta) — przekierowanie po zapisaniu tokena
        const onStorage = (e: StorageEvent) => {
            if (e.key === "token" && e.newValue) {
                router.push("/dashboard");
            }
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, [router]);

    const rotatingPhrases = [
        "Twoje ciało i umysł to twoje statystyki.",
        "Każdy ruch to +1 do doświadczenia.",
        "Ruszaj się. Awansuj.",
        "Pokonuj wyzwania, a w nagrodę zdobądź zdrowie. To gra, w której wygrywasz siebie.",
    ];

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <Navbar />
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-8 bg-white dark:bg-black sm:items-start">
                    <Image
                        className="dark:invert"
                        src="/next.svg"
                        alt="Next.js logo"
                        width={100}
                        height={20}
                        priority
                    />
                    <div className="flex w-full flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                            Zdobywaj levele w realu, nie przed ekranem.
                        </h1>

                        <Typewriter words={rotatingPhrases} typingSpeed={80} deletingSpeed={50} pause={1400} />

                        <div className="mt-6 w-full">
                            <AuthForm />
                        </div>

                        <Link href="/O nas" className="mt-8 w-full">
                            <div className="rounded-md border p-6 text-sm text-zinc-700 dark:text-zinc-300">
                                <h2 className="mb-2 font-semibold">O projekcie</h2>
                                <p>
                                    Nie tylko rozrywka, lecz pomoc:
                                    Nasz system rozwiązuje coś więcej niż nudę wśród młodych osób, rozwiązuje on problemy.
                                    Coraz więcej nastolatków cierpi na stany lękowe, fobie społeczne, depresje lub ataki paniki. Badania pokazują że reguralna aktywność fizyczna pomaga na walkę z depresja i zmniejsza szansę na występowanie ataków. Strona ta posiada również zadania dostosowane do osób z fobią spoleczną, co pomaga im małymi kroczkami pokonać strach przed ludźmi, a możliwość wykonywania zadań ze znajomymi pomaga z socjalizacją.
                                </p>
                            </div>
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}