"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register";

interface AuthRequestBody {
    email: string;
    password: string;
    name?: string;
}

interface AuthResponse {
    token?: string;
    error?: string;
}

export default function AuthForm() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<"error" | "success" | null>(null);

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setMessageType(null);

        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

            const body: AuthRequestBody = { email, password };
            if (mode === "register") body.name = name;

            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            let data: AuthResponse = {};

            try {
                data = await res.json();
            } catch {
                const text = await res.text();
                data = { error: text || "Brak JSON w odpowiedzi" };
            }

            if (!res.ok) {
                console.error("Auth error:", res.status, data);
                setMessage(data.error || `Błąd serwera (${res.status})`);
                setMessageType("error");
            } else {
                if (mode === "login") {
                    if (data.token) localStorage.setItem("token", data.token);
                    setMessage("Zalogowano");
                    setMessageType("success");
                    // PRZESUNIĘTO na pasującą ścieżkę do pliku `app/Dashboard/page.tsx`
                    router.push("/Dashboard");
                } else {
                    setMessage("Zarejestrowano pomyślnie. Możesz się teraz zalogować.");
                    setMessageType("success");
                    setMode("login");
                    setPassword("");
                }
            }
        } catch (err: unknown) {
            console.error("Network/fetch error:", err);
            setMessage("Błąd sieciowy: sprawdź konsolę i zakładkę Network");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md rounded-md border p-6 bg-white/80 dark:bg-black/70">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{mode === "login" ? "Logowanie" : "Rejestracja"}</h3>
                <div className="text-sm">
                    <button
                        className={`mr-2 ${mode === "login" ? "font-bold" : ""}`}
                        onClick={() => setMode("login")}
                        disabled={loading}
                        type="button"
                    >
                        Logowanie
                    </button>
                    <button
                        className={`${mode === "register" ? "font-bold" : ""}`}
                        onClick={() => setMode("register")}
                        disabled={loading}
                        type="button"
                    >
                        Rejestracja
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-3">
                {mode === "register" && (
                    <input
                        placeholder="Imię"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded border px-3 py-2"
                        required
                        disabled={loading}
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded border px-3 py-2"
                    required
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded border px-3 py-2"
                    required
                    disabled={loading}
                />

                <button
                    type="submit"
                    className="mt-2 rounded bg-foreground px-4 py-2 text-background disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Proszę czekać..." : mode === "login" ? "Zaloguj" : "Zarejestruj"}
                </button>

                {message && (
                    <div
                        className={`mt-2 text-sm ${
                            messageType === "error"
                                ? "text-red-600 dark:text-red-400"
                                : "text-green-600 dark:text-green-400"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
}