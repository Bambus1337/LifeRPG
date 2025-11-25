"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null as unknown);
        const message = (data as { error?: string } | null)?.error || "Blad logowania";
        throw new Error(message);
      }

      // Set logged in status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", login);
      
      router.push("/kickstarter");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cos poszlo nie tak. Sprobuj ponownie.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-emerald-50 font-sans dark:bg-black">
      <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 dark:from-black dark:via-slate-900 dark:to-emerald-950 px-4 py-12">
        <main className="relative w-full max-w-md overflow-hidden rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-emerald-900/50 dark:bg-slate-950/80">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-40 w-40 rounded-full bg-teal-500/15 blur-3xl" />
          </div>

          <div className="relative flex flex-col items-center gap-2 mb-8">
            <Image src="/logo.svg" alt="LifeRPG Logo" width={180} height={80} />
            <h1 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
              Zaloguj sie do LifeRPG
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
              Wykorzystaj mechaniki gry, aby poprawic swoje zdrowie, nawyki i dobrostan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="login" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Login
              </label>
              <input
                id="login"
                type="text"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-emerald-800 dark:bg-slate-900 dark:text-zinc-50"
                placeholder="Twoj login"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Haslo
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-emerald-800 dark:bg-slate-900 dark:text-zinc-50"
                placeholder="Wpisz swoje haslo"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 dark:bg-red-900/20 dark:border-red-900/40">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-emerald-600 hover:to-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-black"
            >
              {isLoading ? "Logowanie..." : "Zaloguj sie"}
            </button>

            <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Na razie logowanie jest testowe. W przyszlosci podlaczymy tu prawdziwa baze danych.
            </p>
          </form>
        </main>
      </div>
    </div>
  );
}
