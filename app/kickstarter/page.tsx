"use client";

import { useMemo, useState } from "react";
import Link from "next/link";


// Simple green-ish palette tokens so we can keep styles consistent
const palette = {
    bg: "from-emerald-950 via-slate-950 to-black",
    card: "bg-slate-900/70 border border-emerald-500/20 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.65)]",
    accent: "emerald-400",
    accentSoft: "emerald-300/20",
    textPrimary: "text-slate-50",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
};

const ANSWER_WEIGHTS = [1, 0.5, 0, -0.5, -1] as const;

type AnswerWeight = (typeof ANSWER_WEIGHTS)[number];

interface QuestionConfig {
    id: string;
    title: string;
    description: string;
    answers: string[]; // must be length 5
    infoText: string;
    helpText: string;
}

const QUESTIONS: QuestionConfig[] = [
    {
        id: "movement_level",
        title: "Jak bardzo jesteś aktualnie aktywny fizycznie?",
        description:
            "To pomoże nam dobrać intensywność zadań ruchowych tak, aby były realne, ale nadal lekko wymagające.",
        answers: [
            "Codziennie trenuję / uprawiam sport",
            "Ćwiczę kilka razy w tygodniu",
            "Ruszam się okazjonalnie",
            "Przeważnie siedzę, rzadko się ruszam",
            "Prawie wcale nie jestem aktywny fizycznie",
        ],
        infoText:
            "Wyższa aktywność oznacza bardziej dynamiczne wyzwania, niższa - spokojniejsze i bezpieczne wejście w ruch.",
        helpText:
            "Pomyśl o swoim przeciętnym tygodniu, nie o najlepszym ani najgorszym. Wybierz odpowiedź, która pasuje do większości dni.",
    },
    {
        id: "social_comfort",
        title: "Jak komfortowo czujesz się w sytuacjach społecznych?",
        description:
            "To pozwoli dobrać tempo zadań związanych z kontaktami z ludźmi.",
        answers: [
            "Uwielbiam nowe osoby i sytuacje",
            "Raczej lubię ludzi, czasem się stresuję",
            "Zależy od dnia, różnie bywa",
            "Często unikam nowych sytuacji społecznych",
            "Silnie unikam kontaktu z ludźmi",
        ],
        infoText:
            "Im niższy komfort, tym delikatniej i mniejszymi krokami będziemy budować zadania społeczne.",
        helpText:
            "Wyobraź sobie, że masz poznać nową osobę lub wejść do nowej grupy. Jak duży to dla Ciebie stres?",
    },
    {
        id: "stress_level",
        title: "Jak bardzo obecnie odczuwasz stres na co dzień?",
        description:
            "Stres wpływa na to, jak wymagające mogą być zadania.",
        answers: [
            "Prawie w ogóle się nie stresuję",
            "Czasem się stresuję, ale mam nad tym kontrolę",
            "Stres pojawia się regularnie",
            "Często czuję się przeciążony/a",
            "Prawie cały czas jestem spięty/a",
        ],
        infoText:
            "Większy stres oznacza więcej zadań regeneracyjnych i wspierających regulację emocji.",
        helpText:
            "Pomyśl o ostatnim tygodniu. Jak często Twoje ciało i głowa były w trybie 'napięcie'?",
    },
    {
        id: "sleep_quality",
        title: "Jak oceniasz jakość swojego snu?",
        description:
            "Sen mocno wpływa na nastrój, energię i motywację.",
        answers: [
            "Śpię głęboko i budzę się wypoczęty/a",
            "Na ogół śpię dobrze",
            "Bywa różnie, czasem dobrze, czasem źle",
            "Często mam problem ze snem",
            "Mój sen jest mocno rozregulowany",
        ],
        infoText:
            "Słabszy sen = więcej zadań wokół regeneracji, rutyny i wieczornego wyciszania.",
        helpText:
            "Zastanów się, jak często budzisz się z poczuciem 'jestem gotowy/a na dzień'.",
    },
    {
        id: "sun_exposure",
        title: "Ile czasu spędzasz w świetle dziennym (na dworze)?",
        description:
            "Słońce reguluje nasz nastrój, energię i motywację.",
        answers: [
            "Prawie codziennie co najmniej godzinę",
            "Kilka razy w tygodniu po kilkanaście minut",
            "Bywa, ale bez stałości",
            "Raczej rzadko wychodzę na dwór",
            "Prawie cały dzień spędzam w pomieszczeniach",
        ],
        infoText:
            "Mniej słońca = więcej delikatnych zadań na krótkie spacery i światło dzienne.",
        helpText:
            "Policz w głowie przeciętną liczbę minut dziennie na zewnątrz w ostatnim tygodniu.",
    },
    {
        id: "screen_time",
        title: "Jak dużo czasu spędzasz przy ekranie (poza nauką/pracą)?",
        description:
            "To pomoże nam zbalansować zadania offline i online.",
        answers: [
            "Mniej niż 1 godzinę dziennie",
            "1-2 godziny dziennie",
            "2-3 godziny dziennie",
            "3-5 godzin dziennie",
            "Ponad 5 godzin dziennie",
        ],
        infoText:
            "Więcej czasu przed ekranem = więcej mikrozadań zachęcających do małych przerw offline.",
        helpText:
            "Weź pod uwagę głównie czas rozrywkowy: social media, gry, filmy.",
    },
    {
        id: "competition_like",
        title: "Jak bardzo lubisz rywalizację?",
        description:
            "Rywalizacja może być motorem napędowym albo źródłem stresu.",
        answers: [
            "Uwielbiam rywalizację, ona mnie napędza",
            "Lubię zdrową rywalizację",
            "Jest mi obojętna",
            "Wolę jej unikać",
            "Rywalizacja bardzo mnie stresuje",
        ],
        infoText:
            "Większa chęć rywalizacji = więcej rankingów i wyzwań. Mniejsza = więcej trybu współpracy i łagodnych celów.",
        helpText:
            "Pomyśl o grach, testach, sportach. Czy wizja 'wyniku' Cię kręci, czy raczej się napinasz?",
    },
    {
        id: "internal_motivation",
        title: "Skąd najczęściej bierze się Twoja motywacja?",
        description:
            "Dzięki temu dopasujemy styl nagród i zadań.",
        answers: [
            "Z wewnętrznej satysfakcji i rozwoju",
            "Z poczucia postępu i odhaczania celów",
            "Zależy od dnia, różnie",
            "Z oczekiwań innych osób",
            "Głównie z poczucia winy lub presji",
        ],
        infoText:
            "Większa motywacja wewnętrzna = więcej zadań rozwojowych. Zewnętrzna = więcej widocznych nagród i poziomów.",
        helpText:
            "Przypomnij sobie, dlaczego ostatnio podjąłeś/podjęłaś jakąś zmianę (np. nauka, sport). Co Cię wtedy napędzało?",
    },
    {
        id: "consistency",
        title: "Jak dobrze udaje Ci się trzymać nowych nawyków?",
        description:
            "To wpłynie na wielkość i częstotliwość zadań.",
        answers: [
            "Zazwyczaj wytrzymuję miesiąc lub dłużej",
            "Kilka tygodni trzymam się planu",
            "Wytrzymuję kilka dni",
            "Często odpuszczam po 1-2 dniach",
            "Prawie zawsze rezygnuję bardzo szybko",
        ],
        infoText:
            "Im trudniej z konsekwencją, tym prostsze mikro-kroki na start.",
        helpText:
            "Pomyśl o ostatnich 2-3 próbach zmiany nawyku (np. dieta, nauka). Jak to zwykle się kończyło?",
    },
    {
        id: "mental_state",
        title: "Jak ogólnie oceniasz swój nastrój w ostatnich tygodniach?",
        description:
            "To pomoże dobrać ton zadań: bardziej energetyczny czy bardziej wspierający.",
        answers: [
            "Na ogół czuję się dobrze i stabilnie",
            "Czasem gorzej, ale raczej daję radę",
            "Często mam spadki nastroju",
            "Często czuję się przytłoczony/a",
            "Większość dni jest dla mnie bardzo ciężka",
        ],
        infoText:
            "Niższy nastrój = więcej łagodnych, budujących drobnych zwycięstw.",
        helpText:
            "Zadaj sobie pytanie: ile dni w ostatnim miesiącu uznasz za 'naprawdę dobre'?",
    },
    {
        id: "time_available",
        title: "Ile realnie czasu dziennie możesz przeznaczyć na Life RPG?",
        description:
            "Nie chodzi o ideal, ale o to, co jest dla Ciebie wykonalne.",
        answers: [
            "30+ minut dziennie",
            "15-25 minut dziennie",
            "10-15 minut dziennie",
            "5-10 minut dziennie",
            "Mniej niż 5 minut dziennie",
        ],
        infoText:
            "Więcej czasu = bardziej rozbudowane zadania. Mniej = strategie mikro-kroków.",
        helpText:
            "Pomyśl o najbardziej zabieganym dniu w tygodniu. Ile wtedy byłbyś/byłabyś w stanie realnie poświęcić?",
    },
    {
        id: "support_friends",
        title: "Czy masz osoby, z którymi chciał(a)byś wykonywać zadania razem?",
        description:
            "Wsparcie społeczne często ułatwia zmiany.",
        answers: [
            "Tak, mam silną paczkę znajomych",
            "Mam 1-2 bliskie osoby do takich rzeczy",
            "Mam kilka znajomości, ale rzadko coś razem robimy",
            "Na razie raczej działam sam(a)",
            "Czuję się raczej samotn(y/a) z takimi tematami",
        ],
        infoText:
            "Więcej wsparcia = więcej zadań kooperacyjnych. Mniej = samotne misje i delikatne kroki społeczne.",
        helpText:
            "Pomyśl, kogo realnie mógłbyś/mogłabyś poprosić: 'Hej, zrobimy razem takie małe wyzwanie?'.",
    },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

interface AnswerState {
    questionId: string;
    weight: AnswerWeight;
    index: number;
}

interface PersonaSummary {
    title: string;
    description: string;
    tags: string[];
}

function computePersonaSummary(answers: AnswerState[]): PersonaSummary {
    if (!answers.length) {
        return {
            title: "Odkrywamy Twój profil...",
            description:
                "Najpierw odpowiedz na kilka pytań, a potem pokażemy Ci, jaki typ gracza dobrostanu najbardziej do Ciebie pasuje.",
            tags: [],
        };
    }

    const total = answers.reduce((sum, a) => sum + a.weight, 0);
    const avg = total / answers.length;

    const movement = answers.find((a) => a.questionId === "movement_level")?.weight ?? 0;
    const social = answers.find((a) => a.questionId === "social_comfort")?.weight ?? 0;
    const stress = answers.find((a) => a.questionId === "stress_level")?.weight ?? 0;
    const motivation = answers.find((a) => a.questionId === "internal_motivation")?.weight ?? 0;
    const consistency = answers.find((a) => a.questionId === "consistency")?.weight ?? 0;

    // Choose a primary persona name based on overall average
    let title: string;
    if (avg >= 0.5) {
        title = "Stabilny Odkrywca";
    } else if (avg >= 0.1) {
        title = "Świadomy Gracz Zmiany";
    } else if (avg > -0.3) {
        title = "Startujący z Trybu Przetrwania";
    } else {
        title = "Cichy Wojownik na Trudnym Poziomie";
    }

    // Build a short description blending a few axes
    const descriptionParts: string[] = [];

    if (movement > 0.25) {
        descriptionParts.push("Masz potencjał ruchowy, który możemy przekuć w konkretne misje fizyczne.");
    } else if (movement < -0.25) {
        descriptionParts.push("Zaczynamy spokojnie z ruchem – stawiamy na mini-kroki i łagodne wyzwania.");
    } else {
        descriptionParts.push("Jesteś pomiędzy siedzącym a aktywnym trybem – idealny moment na lekkie upgrade'y.");
    }

    if (social > 0.25) {
        descriptionParts.push("Kontakty z ludźmi mogą być Twoim buffem, więc dodamy trochę misji społecznych.");
    } else if (social < -0.25) {
        descriptionParts.push("Szanujemy Twoje tempo społeczne – misje będą bardziej introwertyczne i bezpieczne.");
    } else {
        descriptionParts.push("Bywasz różnie nastawion(y/a) społecznie, więc damy Ci wybór między solo a ko-op.");
    }

    if (stress > 0.25) {
        descriptionParts.push("Twój poziom napięcia sugeruje, że najpierw wjedzą misje rozładowujące stres.");
    } else if (stress < -0.25) {
        descriptionParts.push("Masz całkiem niezłą regulację stresu – możemy sobie pozwolić na ambitniejsze wyzwania.");
    } else {
        descriptionParts.push("Stres pojawia się falami, więc miksujemy zadania regeneracyjne z zadaniami rozwojowymi.");
    }

    if (motivation > 0.25) {
        descriptionParts.push("Napędza Cię rozwój wewnętrzny, więc mocno podkreślimy feeling postępu i sensu.");
    } else if (motivation < -0.25) {
        descriptionParts.push("Często działasz z presji – Life RPG ma pomóc to zamienić na zdrowszą motywację.");
    }

    if (consistency > 0.25) {
        descriptionParts.push("Masz dobrą konsekwencję – odblokujesz dłuższe linie zadań i łańcuchy nawyków.");
    } else if (consistency < -0.25) {
        descriptionParts.push("Żeby nie spalić startu, planujemy ultra-małe kroki z szybkim poczuciem zwycięstwa.");
    }

    const description = descriptionParts.join(" ");

    const tags: string[] = [];
    if (movement > 0.25) tags.push("potencjał ruchowy");
    if (movement < -0.25) tags.push("start spokojny fizycznie");
    if (social > 0.25) tags.push("społeczny buff");
    if (social < -0.25) tags.push("tryb bardziej introwertyczny");
    if (stress > 0.25) tags.push("wysokie napięcie");
    if (stress < -0.25) tags.push("niezła regulacja stresu");
    if (motivation > 0.25) tags.push("motywacja wewnętrzna");
    if (motivation < -0.25) tags.push("presja/obowiązek");
    if (consistency > 0.25) tags.push("dobra konsekwencja");
    if (consistency < -0.25) tags.push("lepsze mikro-kroki");

    return {
        title,
        description,
        tags,
    };
}

export default function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<AnswerState[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHint, setShowHint] = useState(false);

    const currentQuestion = QUESTIONS[currentIndex];

    const progress = useMemo(
        () => ((currentIndex + (submitted ? 1 : 0)) / TOTAL_QUESTIONS) * 100,
        [currentIndex, submitted]
    );

    const motivationMessage = useMemo(() => {
        if (submitted) return "Dobra robota! Twój profil startowy został zapisany.";
        if (progress < 15) return "Pierwszy krok za Tobą. To właśnie tak zaczyna się zmiana.";
        if (progress < 40) return "Świetnie Ci idzie. Im dalej, tym lepiej dopasujemy Twoją przygodę.";
        if (progress < 70) return "Jesteś w najlepszym miejscu — środek misji — trzymaj tempo!";
        if (progress < 95) return "Prawie meta — ostatnie pytania zrobią ogromną różnicę.";
        return "Jeszcze odrobina skupienia i masz odblokowany spersonalizowany start.";
    }, [progress, submitted]);

    const personaSummary = useMemo(() => computePersonaSummary(answers), [answers]);

    const handleAnswer = (answerIndex: number) => {
        const weight = ANSWER_WEIGHTS[answerIndex];

        setAnswers((prev) => {
            const withoutCurrent = prev.filter((a) => a.questionId !== currentQuestion.id);
            return [
                ...withoutCurrent,
                { questionId: currentQuestion.id, weight, index: answerIndex },
            ];
        });

        if (currentIndex < TOTAL_QUESTIONS - 1) {
            setTimeout(() => {
                setCurrentIndex((prev) => Math.min(prev + 1, TOTAL_QUESTIONS - 1));
            }, 260);
        }
    };

    const handleBack = () => {
        setError(null);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        if (answers.length < TOTAL_QUESTIONS) {
            setError("Odpowiedz proszę na wszystkie pytania, żeby odblokować swój profil.");
            return;
        }
        setError(null);
        setSubmitting(true);

        try {
            // Przygotuj wektor cech użytkownika (normalizowane wartości -1 do 1)
            const traitsVector = [
                answers.find(a => a.questionId === "movement_level")?.weight ?? 0,
                answers.find(a => a.questionId === "social_comfort")?.weight ?? 0,
                answers.find(a => a.questionId === "sun_exposure")?.weight ?? 0,
                answers.find(a => a.questionId === "competition_like")?.weight ?? 0,
                answers.find(a => a.questionId === "consistency")?.weight ?? 0,
                answers.find(a => a.questionId === "mental_state")?.weight ?? 0,
                answers.find(a => a.questionId === "stress_level")?.weight ?? 0, // creativity placeholder
                answers.find(a => a.questionId === "internal_motivation")?.weight ?? 0, // learning
                answers.find(a => a.questionId === "sleep_quality")?.weight ?? 0, // routine
                answers.find(a => a.questionId === "time_available")?.weight ?? 0, // outdoors
                answers.find(a => a.questionId === "screen_time")?.weight ?? 0, // intensity
            ];

            const payload = {
                answers,
                meta: {
                    totalQuestions: TOTAL_QUESTIONS,
                    completedAt: new Date().toISOString(),
                    traitsVector,
                },
            };

            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("API error");
            }

            // Zapisz dane użytkownika do localStorage
            if (typeof window !== "undefined") {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userTraits", JSON.stringify(traitsVector));
                localStorage.setItem("personaTitle", personaSummary.title);
                localStorage.setItem("personaDescription", personaSummary.description);
            }

            setSubmitted(true);
        } catch (e) {
            console.error(e);
            setError("Nie udało się zapisać odpowiedzi. Spróbuj ponownie za chwilę.");
        } finally {
            setSubmitting(false);
        }
    };

    const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

    return (
        <div
            className={`min-h-screen w-full bg-gradient-to-b ${palette.bg} text-slate-50 flex items-center justify-center px-4 py-6`}
        >
            <main className="relative w-full max-w-5xl">
                {/* Glow background */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-40 left-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute -bottom-40 right-0 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl" />
                </div>

                <section
                    className={`relative ${palette.card} rounded-3xl px-4 py-4 sm:px-8 sm:py-6 text-[12px] sm:text-[13px] flex flex-col w-full`}
                >
                    {/* Header */}
                    <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1.5 max-w-2xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/60 px-3.5 py-1.5 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Life RPG Kickstart Quiz
                            </div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
                                Zbudujmy Twój profil przygody wellbeingowej
                            </h1>
                            <p className="max-w-3xl text-[12px] sm:text-[13px] text-slate-300 leading-relaxed">
                                Odpowiadasz na kilka szybkich pytań, a my na tej podstawie dopasujemy
                                zadania pod Twoją energię, nastrój i styl życia. Nie ma złych
                                odpowiedzi ściągaj jest tylko Twój punkt startu.
                            </p>
                            {/* Hint toggle under intro, aligned with text block */}
                            {!submitted && (
                                <div className="mt-2 flex justify-start">
                                    <button
                                        type="button"
                                        onClick={() => setShowHint((v) => !v)}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-slate-950/60 px-4 py-1.5 text-[10px] sm:text-[11px] font-medium text-emerald-100 transition hover:border-emerald-300 hover:text-emerald-50"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span>
                      {showHint
                          ? "Ukryj wsparcie podczas quizu"
                          : "Potrzebujesz delikatnej podpowiedzi?"}
                    </span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-1 flex flex-col items-end gap-1 text-right text-[10px] sm:text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/70 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Szacowany czas: 2-3 min</span>
              </span>
                            <span>Małe decyzje, duże efekty w realnym życiu.</span>
                        </div>
                    </header>

                    {/* Question & answers OR summary */}
                    {!submitted ? (
                        <div
                            className={
                                showHint
                                    ? "grid gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]"
                                    : "grid gap-4"
                            }
                        >
                            <div className={showHint ? "space-y-3" : "space-y-3 lg:col-span-2"}>
                                {/* Question block with aligned icons */}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                                            Pytanie {currentIndex + 1} z {TOTAL_QUESTIONS}
                                        </p>
                                        <h2 className="mt-1 text-lg sm:text-xl font-semibold text-slate-50">
                                            {currentQuestion.title}
                                        </h2>
                                        <p className="mt-1 text-[11px] sm:text-[12px] text-slate-300 leading-relaxed">
                                            {currentQuestion.description}
                                        </p>
                                    </div>
                                    {/* Info & help icons, vertically aligned */}
                                    <div className="flex flex-col items-end gap-1.5 text-xs text-slate-400">
                                        <div className="group relative flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-900/40 text-[11px] font-semibold text-emerald-200 shadow-sm transition hover:border-emerald-300 hover:text-emerald-100"
                                            >
                                                i
                                            </button>
                                            <div className="pointer-events-none invisible absolute right-0 top-8 z-20 w-60 rounded-2xl bg-slate-900/95 px-3.5 py-2.5 text-[11px] text-slate-200 shadow-xl opacity-0 ring-1 ring-emerald-500/20 backdrop-blur-xl transition group-hover:visible group-hover:opacity-100">
                                                <p className="font-medium text-emerald-200 mb-1">Jak to na Ciebie wpłynie?</p>
                                                <p className="leading-relaxed">{currentQuestion.infoText}</p>
                                            </div>
                                        </div>
                                        <div className="group relative flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/40 bg-slate-900/80 text-[11px] font-semibold text-emerald-200 shadow-sm transition hover:border-emerald-300 hover:text-emerald-100"
                                            >
                                                ?
                                            </button>
                                            <div className="pointer-events-none invisible absolute right-0 top-8 z-20 w-60 rounded-2xl bg-slate-900/95 px-3.5 py-2.5 text-[11px] text-slate-200 shadow-xl opacity-0 ring-1 ring-emerald-500/20 backdrop-blur-xl transition group-hover:visible group-hover:opacity-100">
                                                <p className="font-medium text-emerald-200 mb-1">Jak wybrać odpowiedź?</p>
                                                <p className="leading-relaxed">{currentQuestion.helpText}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Answers – centered text, no visible weights */}
                                <div className="space-y-2">
                                    {currentQuestion.answers.map((label, index) => {
                                        const isSelected = currentAnswer?.index === index;

                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => handleAnswer(index)}
                                                className={`group flex w-full items-center justify-center rounded-2xl border px-4 py-3.5 text-center text-sm sm:text-base transition-all duration-200
                          ${isSelected
                                                    ? "border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(34,197,94,0.35)] translate-y-0.5"
                                                    : "border-white/5 bg-slate-900/40 hover:border-emerald-400/60 hover:bg-emerald-500/5"}
                        `}
                                            >
                                                <span className="text-slate-100 leading-snug">{label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {showHint && (
                                <aside
                                    className="flex flex-col space-y-2.5 rounded-2xl bg-slate-950/70 p-3.5 sm:p-4 text-[12px] sm:text-[13px] text-slate-300 ring-1 ring-emerald-500/20 w-full max-w-none"
                                    style={{ WebkitFontSmoothing: "antialiased", hyphens: "none", WebkitHyphens: "none" }}
                                >
                                    <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                        Delikatne wsparcie
                                    </p>
                                    <div className="w-full text-left">
                                        <p className="text-slate-100 leading-relaxed">
                                            {motivationMessage}
                                        </p>
                                        <p className="mt-2 text-emerald-100/90 leading-relaxed">
                                            Mały hack dla mózgu: odpowiadaj tak, jak jest dziś, nie tak jak
                                            &quot;powinno być&quot;. Im bardziej realne odpowiedzi, tym celniej dobierzemy
                                            Twoje pierwsze misje.
                                        </p>
                                    </div>
                                </aside>
                            )}
                        </div>
                    ) : (
                        // Submitted state – personality analysis
                        <div className="grid gap-7 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                            <div className="space-y-4">
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                                    Twój startowy profil Life RPG
                                </p>
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
                                    {personaSummary.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                    {personaSummary.description}
                                </p>
                                {personaSummary.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {personaSummary.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-100 border border-emerald-500/30"
                                            >
                        {tag}
                      </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-[11px] text-slate-400">
                                    Ten opis powstał wyłącznie na podstawie Twoich odpowiedzi –
                                    ma Ci pokazać, że nawet kilka minut klikania zamienia się w
                                    konkretny obraz Twojej sytuacji startowej.
                                </p>
                            </div>

                            <aside className="space-y-3 rounded-2xl bg-slate-950/60 p-4 ring-1 ring-emerald-500/15">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    Co dalej?
                                </p>
                                <p className="text-xs text-slate-200 leading-relaxed">
                                    Na bazie tego profilu dobierzemy Ci pierwsze misje: część będzie
                                    szybka i lekka, część delikatnie wyjdzie poza strefę komfortu.
                                    Z czasem profil może się zmieniać wraz z Twoim progresem.
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Gdy dodasz kolejne dane (np. realne wykonanie zadań), system
                                    zacznie jeszcze precyzyjniej stroić poziom trudności.
                                </p>
                                {submitted && (
                                    <div className="pt-2">
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-md transition hover:from-emerald-600 hover:to-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                                        >
                                            Przejdz do dashboardu
                                        </Link>
                                    </div>
                                )}
                            </aside>
                        </div>
                    )}

                    {/* Footer: navigation, progress, submit */}
                    <footer className="mt-4 space-y-3 border-t border-white/5 pt-3 text-[11px] sm:text-[12px]">
                        {error && (
                            <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-100">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentIndex === 0}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-600/60 px-3 py-1 text-[11px] font-medium text-slate-200 transition disabled:border-slate-700/60 disabled:text-slate-500 disabled:opacity-60 hover:border-emerald-400/70 hover:text-emerald-100"
                                >
                                    <span className="text-sm">←</span>
                                    <span>Wstecz</span>
                                </button>
                                <span className="hidden sm:inline text-slate-500">/</span>
                                <span className="hidden sm:inline">
                   Twoje odpowiedzi służą tylko do personalizacji zadań.
                 </span>
                            </div>

                            <div className="flex items-center gap-2">
                                {!submitted && currentIndex === TOTAL_QUESTIONS - 1 && (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-950 shadow-[0_12px_40px_rgba(34,197,94,0.55)] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {submitting ? "Zapisuję profil..." : "Zakończ i zapisz profil"}
                                    </button>
                                )}
                                {submitted && (
                                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-medium text-emerald-200">
                     Profil zapisany. W następnym kroku dostaniesz pierwsze misje.
                   </span>
                                )}
                            </div>
                        </div>

                        {/* Progress bar with psychological cues */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                 <span>
                   Postęp misji startowej
                   <span className="ml-1 font-semibold text-emerald-300">
                     {Math.round(progress)}%
                   </span>
                 </span>
                                <span>
                   {progress < 20
                       ? "Najważniejsze fundamenty"
                       : progress < 50
                           ? "Kalibrujemy Twoją energię"
                           : progress < 80
                               ? "Precyzujemy poziom misji"
                               : "Ostatnie metry do spersonalizowanego startu"}
                 </span>
                            </div>

                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-800/80">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-500 shadow-[0_0_16px_rgba(34,197,94,0.75)] transition-all duration-500"
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.32),_transparent_55%)] mix-blend-screen opacity-40" />
                            </div>

                            <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-slate-500">
                                <span>Start</span>
                                <span>Środkowa faza</span>
                                <span>Meta</span>
                            </div>
                        </div>
                    </footer>
                </section>
            </main>
        </div>
    );
}
