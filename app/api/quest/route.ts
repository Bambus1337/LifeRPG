import { NextRequest, NextResponse } from 'next/server';
import { InferenceClient } from '@huggingface/inference';

export type TraitVector = number[];

export interface QuestPayload {
    id: string;
    title: string;
    description: string;
    category: string;
    estimatedDurationMinutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    focus: {
        physical: string;
        social: string;
        sunlight: string;
        mental: string;
        habit: string;
    };
    constraints: {
        mustBeCompletableInOneSession: boolean;
        maxRequiredSocialExposure: string;
        physicalSafety: string;
    };
    steps: {
        id: string;
        title: string;
        description: string;
        estimatedMinutes: number;
    }[];
    rewards: {
        xp: number;
        statsDelta: {
            activity: number;
            social: number;
            mood: number;
            resilience: number;
        };
        unlocks: string[];
    };
    safetyNotes: string[];
    meta: {
        source: string;
        traitVector: {
            activity: number;
            social: number;
            sun: number;
            competition: number;
            habits: number;
            mental: number;
            creativity: number;
            learning: number;
            routine: number;
            outdoors: number;
            intensity: number;
        };
    };
}

interface QuestResponseBody {
    quest: QuestPayload;
    hfRaw?: string | null;
}

const HF_MODEL_ID = process.env.HF_QUEST_MODEL_ID;
const HF_API_KEY = process.env.HF_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { traits } = body as { traits?: TraitVector };

        if (!Array.isArray(traits) || traits.length < 10) {
            return NextResponse.json(
                { error: 'Invalid traits payload. Expected an array of at least 10 numbers.' },
                { status: 400 }
            );
        }

        const clamped = traits.map((v) => {
            if (Number.isNaN(v as number)) return 0;
            const n = Number(v);
            return Math.max(-1, Math.min(1, n));
        });

        const activity = clamped[0] ?? 0;
        const social = clamped[1] ?? 0;
        const sun = clamped[2] ?? 0;
        const competition = clamped[3] ?? 0;
        const habits = clamped[4] ?? 0;
        const mental = clamped[5] ?? 0;
        const creativity = clamped[6] ?? 0;
        const learning = clamped[7] ?? 0;
        const routine = clamped[8] ?? 0;
        const outdoors = clamped[9] ?? 0;
        const intensity = clamped[10] ?? 0;

        const baseQuest: QuestPayload = {
            id: `quest-${Date.now()}`,
            title: 'Prototypowy quest lokalny (HF fallback)',
            description:
                '2–4 zdania opisujące główny cel zadania, z naciskiem na realne korzyści dla zdrowia fizycznego / psychicznego / dobrobytu.',
            category: 'one-shot',
            estimatedDurationMinutes: 25,
            difficulty: 'easy',
            focus: {
                physical: activity <= 0 ? 'łagodna aktywność, niski próg wejścia' : 'umiarkowana aktywność, może lekko zmęczyć',
                social:
                    social <= -0.5
                        ? 'mikro-ekspozycja społeczna, bardzo bezpieczna, 100% opcjonalna'
                        : social < 0
                            ? 'łagodne zachęcanie do kontaktu, bez presji'
                            : 'może zawierać zwykłą rozmowę, wiadomości, spotkanie',
                sunlight:
                    sun < 0
                        ? 'zadanie może zostać wykonane w domu, opcjonalne światło dzienne'
                        : 'lekka ekspozycja na słońce lub świeże powietrze, jeżeli to możliwe',
                mental:
                    mental < 0
                        ? 'delikatne wsparcie, skupienie na ukończeniu czegokolwiek bez presji'
                        : 'lekka praca nad dobrostanem psychicznym, wyciszenie, wdzięczność',
                habit:
                    habits <= 0
                        ? 'jeden bardzo mały krok w stronę zdrowszego nawyku (czas trwania < 5 min)'
                        : 'utrwalenie istniejących prozdrowotnych nawyków',
            },
            constraints: {
                mustBeCompletableInOneSession: true,
                maxRequiredSocialExposure:
                    social <= -0.5 ? 'brak kontaktu na żywo, maksymalnie komunikator / anonimowy kontakt' : 'krótka interakcja z jedną osobą maksymalnie',
                physicalSafety:
                    intensity <= 0
                        ? 'brak biegania, skakania, dźwigania. Tylko bardzo łagodne ruchy.'
                        : 'brak ćwiczeń ponad poziom lekkiego zadyszki. Użytkownik może przerwać w każdej chwili.',
            },
            steps: [
                {
                    id: 'step-1',
                    title: 'Krok 1',
                    description: 'Rozpocznij zadanie w bardzo prosty sposób, aby przełamać opór.',
                    estimatedMinutes: 5,
                },
                {
                    id: 'step-2',
                    title: 'Główna część questa',
                    description: 'Wykonaj główne działanie zadania, dostosowane do Twojego profilu.',
                    estimatedMinutes: 10,
                },
                {
                    id: 'step-3',
                    title: 'Zamknięcie i refleksja',
                    description: 'Zastanów się, jak się czujesz po zadaniu i co chciał(a)byś powtórzyć.',
                    estimatedMinutes: 5,
                },
            ],
            rewards: {
                xp: 70,
                statsDelta: {
                    activity: 0.1,
                    social: 0.1,
                    mood: 0.1,
                    resilience: 0.1,
                },
                unlocks: ['Potencjalna przyszła ścieżka questa oparta na Twoich wyborach.'],
            },
            safetyNotes: [
                'Nigdy nie rób niczego, co czuje się dla Ciebie zbyt trudne lub zagrażające.',
                'Jeśli poczujesz silny lęk lub ból – zatrzymaj zadanie i zadbaj o siebie.',
            ],
            meta: {
                source: HF_MODEL_ID && HF_API_KEY ? 'hf-model-or-fallback' : 'local-only',
                traitVector: {
                    activity,
                    social,
                    sun,
                    competition,
                    habits,
                    mental,
                    creativity,
                    learning,
                    routine,
                    outdoors,
                    intensity,
                },
            },
        };

        let hfRawContent: string | null = null;

        if (HF_MODEL_ID && HF_API_KEY) {
            try {
                const client = new InferenceClient(HF_API_KEY);

                const jsonTemplate = JSON.stringify(baseQuest, null, 2);

                // Identyfikuj obszary niepewności (wartości bliskie 0)
                const uncertainAreas: string[] = [];
                if (Math.abs(activity) < 0.3) uncertainAreas.push('aktywność fizyczna');
                if (Math.abs(social) < 0.3) uncertainAreas.push('komfort społeczny');
                if (Math.abs(sun) < 0.3) uncertainAreas.push('ekspozycja na światło dzienne');
                if (Math.abs(habits) < 0.3) uncertainAreas.push('budowanie nawyków');
                if (Math.abs(mental) < 0.3) uncertainAreas.push('stan psychiczny');

                const focusPrompt = uncertainAreas.length > 0
                    ? `SZCZEGÓLNIE SKUP SIĘ NA: ${uncertainAreas.join(', ')} - to obszary, w których użytkownik nie jest pewny swoich możliwości. Quest powinien delikatnie eksplorować te aspekty.`
                    : 'Quest powinien być zbalansowany i odpowiadać całemu profilowi użytkownika.';

                const completion = await client.chatCompletion({
                    model: HF_MODEL_ID,
                    messages: [
                        {
                            role: 'system',
                            content:
                                'Jesteś ekspertem od tworzenia questów rozwojowych w grze Life RPG. Twoje zadanie: stworzyć JEDEN konkretny, wykonalny quest dostosowany do profilu użytkownika.\n\n' +
                                'ZASADY:\n' +
                                '1. Odpowiedz TYLKO czystym JSON-em bez żadnego dodatkowego tekstu\n' +
                                '2. Użyj DOKŁADNIE tej samej struktury co poniższy szablon\n' +
                                '3. Wszystkie teksty PO POLSKU, naturalnym językiem\n' +
                                '4. Quest musi być:\n' +
                                '   - Wykonalny w jednej sesji (15-30 minut)\n' +
                                '   - Bezpieczny i dostosowany do poziomu użytkownika\n' +
                                '   - Konkretny (nie ogólnikowy)\n' +
                                '   - Motywujący ale realistyczny\n' +
                                '5. Dla wartości bliskich 0 w profilu: twórz delikatne, eksploracyjne zadania\n' +
                                '6. Dla wartości ujemnych: zadania wspierające i budujące\n' +
                                '7. Dla wartości dodatnich: bardziej wymagające wyzwania\n\n' +
                                'SZABLON (NADPISZ wartości):\n' +
                                jsonTemplate,
                        },
                        {
                            role: 'user',
                            content:
                                `Profil użytkownika (skala -1 do 1):\n` +
                                `- Aktywność fizyczna: ${activity.toFixed(2)}\n` +
                                `- Komfort społeczny: ${social.toFixed(2)}\n` +
                                `- Ekspozycja na słońce: ${sun.toFixed(2)}\n` +
                                `- Rywalizacja: ${competition.toFixed(2)}\n` +
                                `- Nawyki: ${habits.toFixed(2)}\n` +
                                `- Stan psychiczny: ${mental.toFixed(2)}\n` +
                                `- Kreatywność: ${creativity.toFixed(2)}\n` +
                                `- Nauka: ${learning.toFixed(2)}\n` +
                                `- Rutyna: ${routine.toFixed(2)}\n` +
                                `- Outdoors: ${outdoors.toFixed(2)}\n` +
                                `- Intensywność: ${intensity.toFixed(2)}\n\n` +
                                `${focusPrompt}\n\n` +
                                `Stwórz quest który:\n` +
                                `1. Pomoże użytkownikowi rozwinąć się w obszarach niepewności\n` +
                                `2. Będzie dostosowany do jego obecnych możliwości\n` +
                                `3. Da konkretne kroki do wykonania\n\n` +
                                `Odpowiedz TYLKO JSON-em z jednym questem.`,
                        },
                    ],
                    max_tokens: 1000,
                    temperature: 0.8,
                });

                const content = completion.choices?.[0]?.message?.content;
                if (content) {
                    hfRawContent = content;
                }
            } catch (e) {
                console.warn('HF chatCompletion failed, returning local quest only:', e);
            }
        }

        // Best-effort JSON extraction from hfRawContent (without extra HF calls)
        let questFromModel: QuestPayload | null = null;
        if (hfRawContent) {
            // hfRawContent is often a JSON string possibly wrapped or containing extra text.
            // We try to find the first JSON object and parse it.
            const firstBrace = hfRawContent.indexOf('{');
            const lastBrace = hfRawContent.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                const slice = hfRawContent.slice(firstBrace, lastBrace + 1).trim();
                try {
                    questFromModel = JSON.parse(slice) as QuestPayload;
                } catch (e) {
                    console.warn('Failed to parse hfRawContent JSON, keeping fallback quest:', e);
                }
            }
        }

        const quest: QuestPayload = questFromModel
            ? {
                ...baseQuest,
                ...questFromModel,
                meta: {
                    ...(questFromModel.meta || baseQuest.meta),
                    traitVector: baseQuest.meta.traitVector,
                },
            }
            : baseQuest;

        const responseBody: QuestResponseBody = { quest };
        if (hfRawContent) {
            responseBody.hfRaw = hfRawContent;
        }

        return NextResponse.json(responseBody);
    } catch (err) {
        console.error('Error in /api/generate-quest:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
