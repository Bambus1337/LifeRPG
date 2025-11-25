"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/app/navbar/Navbar";

interface SuggestedUser {
  id: number;
  username: string;
  level: number;
  totalXp: number;
  similarityScore: number;
  reason: string;
  personaTitle: string;
}

interface QuestPreview {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [todayQuests, setTodayQuests] = useState<QuestPreview[]>([]);
  const [invitingUser, setInvitingUser] = useState<number | null>(null);
  const [userLevel, setUserLevel] = useState(5);
  const [userXp, setUserXp] = useState(1250);
  const [currentStreak, setCurrentStreak] = useState(7);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/");
      return;
    }

    const user = localStorage.getItem("username") || "Gracz";
    setUsername(user);

    fetchSuggestedUsers();
    fetchTodayQuests();
  }, [router]);

  const fetchSuggestedUsers = async () => {
    // TODO: Replace with real API call
    const mockSuggested: SuggestedUser[] = [
      { id: 3, username: "Consistent Chris", level: 7, totalXp: 2100, similarityScore: 85.5, reason: "Podobny poziom aktywności i konsekwencji", personaTitle: "Stabilny Odkrywca" },
      { id: 7, username: "Competitive Carlos", level: 6, totalXp: 1890, similarityScore: 78.3, reason: "Obaj lubicie rywalizację i jesteście aktywni", personaTitle: "Stabilny Odkrywca" },
      { id: 9, username: "Energetic Emma", level: 5, totalXp: 1420, similarityScore: 76.8, reason: "Wysoka energia i dobry stan psychiczny", personaTitle: "Stabilny Odkrywca" },
      { id: 5, username: "Motivated Maya", level: 6, totalXp: 1650, similarityScore: 74.2, reason: "Wysoka motywacja wewnętrzna", personaTitle: "Stabilny Odkrywca" },
    ];
    setSuggestedUsers(mockSuggested);
  };

  const fetchTodayQuests = async () => {
    // TODO: Replace with real API call
    const mockQuests: QuestPreview[] = [
      { id: "1", title: "Poranny spacer", xp: 50, completed: true },
      { id: "2", title: "5 minut medytacji", xp: 40, completed: false },
      { id: "3", title: "Pij wodę", xp: 30, completed: false },
    ];
    setTodayQuests(mockQuests);
  };

  const handleInvite = async (userId: number) => {
    setInvitingUser(userId);

    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 800));

    alert(`Wysłano zaproszenie do użytkownika!`);
    setInvitingUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 dark:from-black dark:via-slate-900 dark:to-emerald-950">
      <Navbar />

      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-20 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute -bottom-40 right-20 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Dashboard
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
              Witaj ponownie, {username}!
            </h1>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Przegląd Twojego postępu, statystyki i rekomendowani użytkownicy do współpracy.
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⭐</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Poziom</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{userLevel}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{userXp} XP razem</p>
            </div>

            <div className="rounded-xl border border-teal-100 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-teal-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔥</span>
                <span className="text-xs font-medium text-teal-600 dark:text-teal-400">Streak</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{currentStreak} dni</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Aktywny łańcuch</p>
            </div>

            <div className="rounded-xl border border-cyan-100 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-cyan-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">✓</span>
                <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Dzisiaj</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                {todayQuests.filter(q => q.completed).length}/{todayQuests.length}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Zadań ukończonych</p>
            </div>

            <div className="rounded-xl border border-violet-100 bg-white/80 p-5 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🤝</span>
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Społeczność</span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{suggestedUsers.length}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sugerowanych znajomych</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Social Scoreboard - Suggested People */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Sugerowani użytkownicy
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Osoby o podobnych statystykach - zaproś ich do wspólnych questów!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {suggestedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="group relative overflow-hidden rounded-xl border border-emerald-100/40 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:border-emerald-400/60 hover:shadow-md dark:border-emerald-900/40 dark:bg-slate-900/70"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-teal-400/5 opacity-0 transition group-hover:opacity-100" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-lg font-bold text-white">
                            {user.username.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {user.username}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {user.personaTitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            <span>⭐</span>
                            Lvl {user.level}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2 py-0.5 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                            <span>✦</span>
                            {user.totalXp} XP
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                            <span>🎯</span>
                            {user.similarityScore}% match
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                          "{user.reason}"
                        </p>
                      </div>

                      <button
                        onClick={() => handleInvite(user.id)}
                        disabled={invitingUser === user.id}
                        className="shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:from-emerald-600 hover:to-teal-600 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {invitingUser === user.id ? (
                          <span className="flex items-center gap-1.5">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Wysyłam...
                          </span>
                        ) : (
                          "Zaproś"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/social"
                  className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition"
                >
                  Zobacz wszystkich użytkowników
                  <span>→</span>
                </Link>
              </div>
            </section>

            {/* Quick Quest Summary */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                    Dzisiejsze zadania
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {todayQuests.filter(q => q.completed).length} z {todayQuests.length} ukończonych
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {todayQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="flex items-center gap-3 rounded-xl border border-emerald-100/40 bg-white/70 p-3 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70"
                  >
                    <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      quest.completed
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-slate-300 dark:border-slate-700"
                    }`}>
                      {quest.completed && <span className="text-xs">✓</span>}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        quest.completed
                          ? "text-emerald-600 dark:text-emerald-400 line-through"
                          : "text-slate-800 dark:text-slate-100"
                      }`}>
                        {quest.title}
                      </p>
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      +{quest.xp} XP
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/quests"
                className="block w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-center text-sm font-medium text-white shadow-md transition hover:from-emerald-600 hover:to-teal-600"
              >
                Zobacz wszystkie zadania
              </Link>

              {/* Quick Stats */}
              <div className="rounded-xl border border-emerald-100 bg-white/70 p-4 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Postęp tego tygodnia
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Zadania dzienne</span>
                      <span className="text-slate-900 dark:text-slate-50 font-medium">5/7</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full w-[71%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Zadania tygodniowe</span>
                      <span className="text-slate-900 dark:text-slate-50 font-medium">2/3</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div className="h-full w-[67%] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

