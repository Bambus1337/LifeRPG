"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/app/navbar/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("username") || "Gracz";

    if (!loggedIn) {
      router.push("/");
      return;
    }

    setIsLoggedIn(loggedIn);
    setUsername(user);
  }, [router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 dark:from-black dark:via-slate-900 dark:to-emerald-950">
      <Navbar />

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Profil uzytkownika
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              {username}
            </h1>
          </header>

          <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Informacje o profilu
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>
                To jest placeholder strony profilu. Tutaj bedziesz mogl edytowac swoje dane,
                preferencje i ustawienia.
              </p>
              <div className="flex gap-3 pt-4">
                <button className="rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-emerald-600 hover:to-teal-600">
                  Edytuj profil (wkrotce)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
