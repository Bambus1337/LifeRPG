"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/navbar/Navbar";
interface Quest {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  type: "daily" | "weekly" | "monthly";
}
export default function QuestsPage() {
  const router = useRouter();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "daily" | "weekly" | "monthly">("all");
  const fetchQuests = useCallback(async () => {
    const mockQuests: Quest[] = [
      { id: "1", title: "Poranny spacer", description: "Wyjdź na 15-minutowy spacer rano", xp: 50, completed: true, type: "daily" },
      { id: "2", title: "5 minut medytacji", description: "Poświęć 5 minut na medytację lub głębokie oddychanie", xp: 40, completed: false, type: "daily" },
      { id: "3", title: "Pij wodę", description: "Wypij 8 szklanek wody dzisiaj", xp: 30, completed: false, type: "daily" },
      { id: "4", title: "Trening 3x", description: "Ćwicz przynajmniej 3 razy w tym tygodniu po 30 minut", xp: 200, completed: false, type: "weekly" },
      { id: "5", title: "Spotkaj się z przyjacielem", description: "Spotkaj się z kimś na żywo lub online", xp: 150, completed: false, type: "weekly" },
      { id: "6", title: "Mistrz nawyków", description: "Utrzymaj 21-dniowy streak dowolnego nawyku", xp: 500, completed: false, type: "monthly" },
    ];
    setQuests(mockQuests);
  }, []);
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/");
      return;
    }
    fetchQuests();
  }, [router, fetchQuests]);
  const generateQuest = async (type: "daily" | "weekly" | "monthly") => {
    setIsGenerating(type);

    try {
      const userTraitsStr = localStorage.getItem("userTraits");
      const userTraits = userTraitsStr ? JSON.parse(userTraitsStr) : null;

      const response = await fetch("/api/quest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traits: userTraits || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const generatedQuest = data.quest;

      const newQuest: Quest = {
        id: generatedQuest.id || `${type}-${Date.now()}`,
        title: generatedQuest.title || `Quest ${type}`,
        description: generatedQuest.description || "Nowy quest",
        xp: generatedQuest.rewards?.xp || (type === "daily" ? 50 : type === "weekly" ? 200 : 500),
        completed: false,
        type,
      };

      setQuests([...quests, newQuest]);
    } catch (error) {
      console.error("Błąd generowania:", error);
      const newQuest: Quest = {
        id: `${type}-${Date.now()}`,
        title: `Zadanie ${type === "daily" ? "dzienne" : type === "weekly" ? "tygodniowe" : "miesieczne"}`,
        description: "Quest wygenerowany lokalnie",
        xp: type === "daily" ? 50 : type === "weekly" ? 200 : 500,
        completed: false,
        type,
      };
      setQuests([...quests, newQuest]);
    } finally {
      setIsGenerating(null);
    }
  };
  const toggleComplete = (id: string) => {
    setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };
  const filteredQuests = activeTab === "all" ? quests : quests.filter(q => q.type === activeTab);
  const dailyQuests = quests.filter(q => q.type === "daily");
  const weeklyQuests = quests.filter(q => q.type === "weekly");
  const monthlyQuests = quests.filter(q => q.type === "monthly");
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50 to-emerald-100 dark:from-black dark:via-slate-900 dark:to-emerald-950">
      <Navbar />
      <div className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-emerald-300 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Twoje Zadania
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">Wszystkie zadania</h1>
          </header>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Dzisiejsze zadania</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{dailyQuests.filter(q => q.completed).length}/{dailyQuests.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40"><span className="text-xl">☀️</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-teal-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-teal-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Tygodniowe zadania</p>
                  <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/40"><span className="text-xl">📅</span></div>
              </div>
            </div>
            <div className="rounded-xl border border-cyan-100 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-cyan-900/40 dark:bg-slate-900/70">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Miesięczne zadania</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{monthlyQuests.filter(q => q.completed).length}/{monthlyQuests.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/40"><span className="text-xl">🎯</span></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 rounded-xl border border-emerald-100 bg-white/80 p-1 backdrop-blur dark:border-emerald-900/40 dark:bg-slate-900/70">
              {(["all", "daily", "weekly", "monthly"] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === tab ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}>
                  {tab === "all" ? "Wszystkie" : tab === "daily" ? "Dzienne" : tab === "weekly" ? "Tygodniowe" : "Miesięczne"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => generateQuest("daily")} disabled={isGenerating === "daily"} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {isGenerating === "daily" ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generuje...</> : <><span>+</span>Dzienne</>}
              </button>
              <button onClick={() => generateQuest("weekly")} disabled={isGenerating === "weekly"} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {isGenerating === "weekly" ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generuje...</> : <><span>+</span>Tygodniowe</>}
              </button>
              <button onClick={() => generateQuest("monthly")} disabled={isGenerating === "monthly"} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
                {isGenerating === "monthly" ? <><span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />Generuje...</> : <><span>+</span>Miesięczne</>}
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            {filteredQuests.length === 0 ? (
              <div className="rounded-xl border border-dashed border-emerald-200/60 bg-emerald-50/30 p-12 text-center dark:border-emerald-800/40 dark:bg-emerald-950/20">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Brak zadań w tej kategorii</p>
              </div>
            ) : (
              filteredQuests.map((quest) => (
                <div key={quest.id} className="group relative overflow-hidden rounded-xl border border-emerald-100/40 bg-white/70 p-4 shadow-sm backdrop-blur transition hover:border-emerald-400/60 hover:shadow-md dark:border-emerald-900/40 dark:bg-slate-900/70">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-teal-400/5 opacity-0 transition group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <button onClick={() => toggleComplete(quest.id)} className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${quest.completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 bg-white hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-800"}`}>
                        {quest.completed && <span className="text-xs">✓</span>}
                      </button>
                      <div className="flex-1 space-y-1">
                        <h3 className={`text-sm font-semibold ${quest.completed ? "text-emerald-600 dark:text-emerald-400 line-through" : "text-slate-800 dark:text-slate-100"}`}>{quest.title}</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{quest.description}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            <span className="text-xs">✦</span>{quest.xp} XP
                          </span>
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${quest.type === "daily" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : quest.type === "weekly" ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300" : "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"}`}>
                            {quest.type === "daily" ? "☀️ Dzienne" : quest.type === "weekly" ? "📅 Tygodniowe" : "🎯 Miesięczne"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
