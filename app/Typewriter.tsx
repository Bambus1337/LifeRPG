"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
    words: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pause?: number;
    jitter?: number;
    mistakeRate?: number;
};

const alphabet = "abcdefghijklmnopqrstuvwxyząćęłńóśżźABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?-() ";

export default function Typewriter({
                                       words,
                                       typingSpeed = 140,
                                       deletingSpeed = 80,
                                       pause = 1500,
                                       jitter = 60,
                                       mistakeRate = 0.06,
                                   }: Props) {
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);
    const [caretVisible, setCaretVisible] = useState(true);

    const correctingRef = useRef(false);
    const correctingTargetLenRef = useRef(0);

    const mounted = useRef(true);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        const current = words[wordIndex % words.length];

        const pickDelay = (base: number) =>
            Math.max(20, base + Math.round((Math.random() - 0.5) * 2 * jitter));

        const extraPause = () => {
            const last = text.slice(-1);
            if (last === "." || last === "!" || last === "?") return 350;
            if (last === "," || last === ";") return 180;
            if (Math.random() < 0.02) return 300 + Math.random() * 500;
            return 0;
        };

        let timeout: ReturnType<typeof setTimeout>;

        if (correctingRef.current && isDeleting) {
            const delay = pickDelay(Math.max(30, deletingSpeed * 0.5));
            timeout = setTimeout(() => {
                if (!mounted.current) return;
                setText((prev) => {
                    const next = prev.slice(0, -1);
                    if (next.length === correctingTargetLenRef.current) {
                        correctingRef.current = false;
                        setIsDeleting(false);
                    }
                    return next;
                });
            }, delay);
            return () => clearTimeout(timeout);
        }

        if (!isDeleting) {
            if (text === current) {
                const delay = pause + extraPause();
                timeout = setTimeout(() => {
                    if (!mounted.current) return;
                    setIsDeleting(true);
                }, delay);
                return () => clearTimeout(timeout);
            }

            const nextChar = current.charAt(text.length);
            const willMakeMistake =
                Math.random() < mistakeRate && nextChar && /[^\s]/.test(nextChar);

            if (willMakeMistake) {
                const wrongChar = randomWrongChar(nextChar);
                const delay = pickDelay(typingSpeed) + Math.round(Math.random() * 40);
                timeout = setTimeout(() => {
                    if (!mounted.current) return;
                    correctingRef.current = true;
                    correctingTargetLenRef.current = text.length;
                    setText((prev) => prev + wrongChar);
                    setIsDeleting(true);
                }, delay);
                return () => clearTimeout(timeout);
            }

            const delay = pickDelay(typingSpeed) + extraPause();
            timeout = setTimeout(() => {
                if (!mounted.current) return;
                setText((prev) => prev + nextChar);
            }, delay);
            return () => clearTimeout(timeout);
        }

        if (isDeleting) {
            if (text.length === 0) {
                const delay = 80 + Math.random() * 120;
                timeout = setTimeout(() => {
                    if (!mounted.current) return;
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }, delay);
                return () => clearTimeout(timeout);
            }

            const delay = pickDelay(deletingSpeed);
            timeout = setTimeout(() => {
                if (!mounted.current) return;
                setText((prev) => prev.slice(0, -1));
            }, delay);
            return () => clearTimeout(timeout);
        }

        return undefined;
    }, [text, isDeleting, wordIndex, typingSpeed, deletingSpeed, pause, jitter, mistakeRate, words]);

    useEffect(() => {
        const iv = setInterval(() => setCaretVisible((v) => !v), 500);
        return () => clearInterval(iv);
    }, []);

    return (
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <span>{text}</span>
            <span aria-hidden style={{ opacity: caretVisible ? 1 : 0 }}>
        │
      </span>
        </p>
    );
}

function randomWrongChar(correct: string) {
    const candidates = alphabet.split("").filter((c) => c !== correct);
    return candidates[Math.floor(Math.random() * candidates.length)] || "a";
}
