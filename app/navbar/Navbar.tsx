import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
    return (
        <nav className="flex items-center gap-4 p-4 px-16">
            <Image
                src="/logo.svg"
                alt="LifeRPG Logo"
                width={200}
                height={100}
            />
            <Link className="text-neutral-400 transition-colors hover:text-blue-500" href="/">
                Strona Główna
            </Link>
            <Link className="text-neutral-400 transition-colors hover:text-blue-500" href="/">
                Informacje o nas
            </Link>
            <button className="bg-white hover:bg-gray-400 text-black py-2 px-4 rounded-full ml-auto">
                Zaloguj się
            </button>
        </nav>

    );
}