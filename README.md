# LifeRPG - Gamifikowana Platforma Wellbeing 🎮

Przekształć swoje życie w grę RPG! Aplikacja Next.js, która gamifikuje zdrowie i dobrostan przez mechaniki RPG, funkcje społeczne i spersonalizowane questy.

## ✨ Funkcje

- 🎯 **Spersonalizowane Questy** - Zadania generowane AI na podstawie Twojego profilu
- 📊 **Śledzenie Postępu** - Zdobywaj XP i awansuj poziomy
- 👥 **Funkcje Społeczne** - Znajdź podobnych użytkowników i współpracuj
- 🎨 **Nowoczesny UI** - Piękny design w stylu glassmorphism (zieleń/turkus)
- 🤖 **AI Quest Generator** - Inteligentne generowanie zadań dopasowanych do Ciebie

## 🚀 Szybki Start

```bash
# 1. Zainstaluj zależności
pnpm install

# 2. Skonfiguruj środowisko
cp .env.example .env.local
# Dodaj swój klucz HF_API_KEY w .env.local

# 3. Uruchom bazę danych
pnpm db:start

# 4. Uruchom serwer deweloperski
pnpm dev
```

Otwórz [http://localhost:3000](http://localhost:3000) i zacznij swoją przygodę!

## 🔑 Konfiguracja API

Projekt używa Hugging Face dla generowania questów AI. Dodaj do `.env.local`:

```env
HF_API_KEY=twoj_klucz_huggingface
HF_TOKEN=twoj_klucz_huggingface  
HF_QUEST_MODEL_ID=meta-llama/Llama-3.1-8B-Instruct:novita
DATABASE_URL="mysql://liferpg:liferpg123@localhost:3306/liferpg_db"
```

## 🗄️ Komendy Bazy Danych

```bash
pnpm db:start     # Uruchom MariaDB
pnpm db:stop      # Zatrzymaj bazę
pnpm db:restart   # Restart bazy
pnpm db:reset     # Reset (⚠️ usuwa wszystkie dane)
pnpm db:shell     # Otwórz shell bazy
pnpm db:logs      # Zobacz logi
```

## 🛠️ Stack Technologiczny

- **Framework:** Next.js 16 (App Router)
- **Język:** TypeScript 5
- **Style:** Tailwind CSS 4
- **Baza:** MariaDB 11
- **AI:** Hugging Face Inference API
- **Menedżer pakietów:** pnpm

## 📁 Struktura Projektu

```
LifeRPG/
├── app/
│   ├── api/              # Endpointy API
│   │   ├── quest/        # Generowanie questów AI
│   │   ├── quiz/         # Zapisywanie quizu
│   │   └── ...
│   ├── dashboard/        # Główny dashboard
│   ├── quests/          # Zarządzanie questami
│   ├── kickstarter/     # Quiz osobowości
│   └── ...
├── SQL/                 # Schema i seed data
└── docs/                # Dokumentacja
```

## 🎮 Jak to działa

1. **Login** - Zaloguj się lub utwórz konto
2. **Kickstarter Quiz** - Odpowiedz na pytania o swój styl życia
3. **AI Analysis** - System analizuje Twoje odpowiedzi i identyfikuje obszary niepewności
4. **Generowanie Questów** - AI tworzy spersonalizowane zadania pomagające rozwijać słabsze obszary
5. **Wykonuj i Rozwijaj się** - Wykonuj questy, zdobywaj XP i zobacz postęp!

## 🤖 System Generowania Questów AI

Quest generator używa Hugging Face API do tworzenia zadań opartych na:

- **Niepewnych obszarach** - Wartości bliskie 0 w quizie oznaczają obszary do rozwoju
- **Mocnych stronach** - Pozytywne wartości = bardziej wymagające wyzwania
- **Słabych punktach** - Negatywne wartości = wspierające, budujące zadania

Questy są generowane w czasie rzeczywistym i dostosowane do Twojego obecnego poziomu.

## 🧪 Dane Testowe

Baza zawiera 10 użytkowników testowych:
- **Login:** testuser1 do testuser10  
- **Hasło:** test123

Każdy użytkownik ma unikalny profil, questy i znajomości.

## 📝 Dostępne Skrypty

```bash
pnpm dev          # Serwer deweloperski
pnpm build        # Build produkcyjny
pnpm start        # Serwer produkcyjny
pnpm lint         # Sprawdź kod
```

## 🔒 Uwaga Bezpieczeństwa

**⚠️ To jest build deweloperski - NIE produkcyjny!**

Przed wdrożeniem:
- [ ] Zaimplementuj haszowanie haseł bcrypt
- [ ] Dodaj autentykację JWT
- [ ] Włącz ochronę CSRF
- [ ] Dodaj rate limiting
- [ ] Waliduj wszystkie inputy
- [ ] Użyj HTTPS

## 📚 Dokumentacja

- [Dokumentacja Projektu](docs/PROJECT_SUMMARY.md) - Pełna dokumentacja funkcji
- [Schema Bazy](SQL/database_design.txt) - Dokumentacja bazy danych
- [Hugging Face Docs](https://huggingface.co/docs/api-inference/) - Dokumentacja API

## 🆘 Rozwiązywanie Problemów

### Błędy bazy danych
```bash
# Port 3306 już zajęty
sudo lsof -ti:3306 | xargs kill -9
pnpm db:start

# Baza nie startuje
pnpm db:reset
```

### Błędy TypeScript
```bash
# Wyczyść cache i przebuduj
rm -rf .next node_modules
pnpm install
pnpm dev
```

### Błędy API questów
- Sprawdź czy `HF_API_KEY` jest ustawiony w `.env.local`
- Sprawdź logi: `pnpm dev` i zobacz terminal
- Sprawdź model ID w .env.local

## 🎨 Strony

- `/` - Strona logowania
- `/kickstarter` - Quiz osobowości (12 pytań)
- `/dashboard` - Główny hub ze statystykami
- `/quests` - Zarządzanie wszystkimi questami
- `/profile` - Profil użytkownika

## 🙏 Podziękowania

- Zbudowane z [Next.js](https://nextjs.org/)
- Stylowane z [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [Hugging Face](https://huggingface.co/)
- Baza danych: [MariaDB](https://mariadb.org/)

---

**Zbudowane z ❤️ i ☕**

Jeśli projekt Ci się podoba, zostaw ⭐!

