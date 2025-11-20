import Link from "next/link";
import { Navbar } from "@/app/navbar/Navbar";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
            <Navbar />
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-20 px-8 bg-white dark:bg-black sm:items-start">
                    <h1 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-zinc-50">O projekcie</h1>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-6 mb-4">
                        Life RPG - Gra która nakłania do poprawy dobrobytu!
                        Założenia Projektu:
                        Zachęcić młode osoby do aktywnej poprawy swojego zdrowia fizycznego, psychicznego jak i ogólnie pojętego dobrobytu.
                        <p> Projekt zapewnia również stymulacje szerokiej gamy receptorow, w sposob nieosiągalny w normalnych grach, np: </p>
                        <p> receptory dopaminowe D1 i D2 - Są aktywowane ze względow iż w projekcie występuje rywalizacja i uczucie zwycięstwa </p>
                        <p> receptory opioidowe MOR i DOR - Są aktywowane podczas lekkich aktywności fizycznych do których system zachęca </p>
                        <p> receptory serotoninowe 5-HT1A i 5-HT2A - Są aktywowane podczas wystawienia na słońce oraz aktywności fizycznej </p>

                        <p> receptory kannabinoidowe w układzie endokannabinoidowym - Są odpowiedzialne za wzrost samopoczucia po aktywności fizycznej, szczególnie bieganiu </p>

                        <p> receptory adrenergiczne w układzie noradrenergicznym - Są aktywowane podczas rywalizacji, często są nadstymulowane podczas grania w gry co jest męczące i niezdrowe dla organizmu </p>

                        <p>
                        receptory układu neurotroficzny (TrkB) - Są aktywowane podczas aktywności fizycznej, zyskiwania nowych umiejętności oraz rzucania nałogów
                        Zaletą tego nad popularnymi w naszych czasach, czysto rozrywkowymi treściami oraz grami jest fakt iż nasz projekt pozwala w naturalny sposób odczuwać to, co czujemy grając w gry komputerowe lub korzystając z portali rozrywkowych. Na dodatek dostarcza on rozszerza gamę doznań ponad to co dostarcza sztuczna rozrywka.
                        </p>
                    </p>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        <p>Możesz rozbudować tę stronę o sekcje: FAQ, Kontakt, Zespół itp.</p>
                    </div>
                    <div className="mt-6 w-full sm:w-auto">
                        <Link href="/" className="text-sm text-foreground underline">
                            Powrót na stronę główną
                        </Link>
                    </div>
                </main>
            </div>
        </div>
    );
}