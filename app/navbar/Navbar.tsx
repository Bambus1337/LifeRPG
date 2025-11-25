"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const router = useRouter();
    const pathname = usePathname();

    // Don't show navbar on login page (root /)
    if (pathname === "/") {
        return null;
    }

    useEffect(() => {
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        const user = localStorage.getItem("username") || "";
        setIsLoggedIn(loggedIn);
        setUsername(user);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        setIsLoggedIn(false);
        router.push("/");
    };

    return (
        <nav className="flex items-center gap-4 p-4 px-6 sm:px-16 border-b border-emerald-100/20 dark:border-emerald-900/20 bg-white/50 dark:bg-slate-950/50 backdrop-blur">
            <Link href="/dashboard">
                <Image src="/logo.svg" alt="LifeRPG Logo" width={160} height={80} className="cursor-pointer" />
            </Link>
            <Link className="text-neutral-400 transition-colors hover:text-emerald-500 text-sm" href="/dashboard">
                Dashboard
            </Link>
            <Link className="text-neutral-400 transition-colors hover:text-emerald-500 text-sm" href="/quests">
                Zadania
            </Link>
            <Link className="text-neutral-400 transition-colors hover:text-emerald-500 text-sm" href="/about">
                O nas
            </Link>
            {isLoggedIn ? (
                <div className="ml-auto flex items-center gap-3">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                        {username}
                    </span>
                    <Link 
                        href="/profile"
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-full transition text-sm font-medium"
                    >
                        Profil
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="text-xs sm:text-sm text-neutral-400 hover:text-red-500 transition"
                    >
                        Wyloguj
                    </button>
                </div>
            ) : (
                <Link 
                    href="/"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-full ml-auto transition text-sm font-medium"
                >
                    Zaloguj sie
                </Link>
            )}
        </nav>
    );
}

export default Navbar;