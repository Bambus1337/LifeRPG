// File: app/Typewriter.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  words: string[];
  typingSpeed?: number; // base ms per char when typing
  deletingSpeed?: number; // base ms per char when deleting whole word
  pause?: number; // pause after full word
  jitter?: number; // max +/- jitter ms
  mistakeRate?: number; // probability per character to make a typo
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

  // states for simulating a quick typo+correction
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

    // Helper: random delay around base +/- jitter, with min floor
    const pickDelay = (base: number) =>
      Math.max(20, base + Math.round((Math.random() - 0.5) * 2 * jitter));

    // Helper: random extra pause after punctuation or occasionally
    const extraPause = () => {
      const last = text.slice(-1);
      if (last === "." || last === "!" || last === "?") return 350; // natural pause after sentence
      if (last === "," || last === ";") return 180;
      // occasional thinking pause
      if (Math.random() < 0.02) return 300 + Math.random() * 500;
      return 0;
    };

    let timeout: ReturnType<typeof setTimeout>;
    // If we're correcting a typo: delete the wrong char quickly
    if (correctingRef.current && isDeleting) {
      const delay = pickDelay(Math.max(30, deletingSpeed * 0.5));
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setText((prev) => {
          const next = prev.slice(0, -1);
          // finished correcting
          if (next.length === correctingTargetLenRef.current) {
            correctingRef.current = false;
            // stop deleting so typing resumes
            setIsDeleting(false);
          }
          return next;
        });
      }, delay);
      return () => clearTimeout(timeout);
    }

    // Normal typing
    if (!isDeleting) {
      // If whole word is typed
      if (text === current) {
        const delay = pause + extraPause();
        timeout = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(true);
        }, delay);
        return () => clearTimeout(timeout);
      }

      // Decide whether to make a typo
      const nextChar = current.charAt(text.length);
      const willMakeMistake =
        Math.random() < mistakeRate && nextChar && /[^\s]/.test(nextChar);

      if (willMakeMistake) {
        // insert wrong char then mark correcting
        const wrongChar = randomWrongChar(nextChar);
        const delay = pickDelay(typingSpeed) + Math.round(Math.random() * 40);
        timeout = setTimeout(() => {
          if (!mounted.current) return;
          correctingRef.current = true;
          correctingTargetLenRef.current = text.length; // length before wrong char
          setText((prev) => prev + wrongChar);
          // immediately switch to deleting to remove the wrong char
          setIsDeleting(true);
        }, delay);
        return () => clearTimeout(timeout);
      }

      // Normal append next correct char
      const delay = pickDelay(typingSpeed) + extraPause();
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setText((prev) => prev + nextChar);
      }, delay);
      return () => clearTimeout(timeout);
    }

    // Deleting whole word
    if (isDeleting) {
      // If finished deleting word
      if (text.length === 0) {
        const delay = 80 + Math.random() * 120;
        timeout = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, delay);
        return () => clearTimeout(timeout);
      }

      // delete one char
      const delay = pickDelay(deletingSpeed);
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setText((prev) => prev.slice(0, -1));
      }, delay);
      return () => clearTimeout(timeout);
    }

    return undefined;
    // dependencies: text/isDeleting/wordIndex and settings
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

// Helper: pick a wrong char different from the intended one
function randomWrongChar(correct: string) {
  // try to pick visually plausible char (same case) or fallback to random
  const candidates = alphabet.split("").filter((c) => c !== correct);
  return candidates[Math.floor(Math.random() * candidates.length)] || "a";
}