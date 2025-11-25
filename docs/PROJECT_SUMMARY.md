# LifeRPG - Project Summary & Implementation Guide

## 🎯 Overview
LifeRPG is a gamified wellness platform that motivates users to improve their health, habits, and well-being through RPG mechanics, social features, and personalized quests.

---

## 📁 Project Structure

```
LifeRPG/
├── app/
│   ├── page.tsx                    # Login page (root /)
│   ├── dashboard/page.tsx          # Main dashboard with stats & social features
│   ├── quests/page.tsx            # Dedicated quests management page
│   ├── profile/page.tsx           # User profile page
│   ├── kickstarter/page.tsx       # Onboarding quiz
│   ├── about/page.tsx             # About page
│   ├── navbar/Navbar.tsx          # Navigation component
│   └── api/
│       ├── login/route.ts         # Authentication API
│       ├── quiz/route.ts          # Quiz submission API
│       ├── quest/route.ts         # Quest generation API
│       ├── friends/suggested/route.ts  # Suggested friends API
│       └── invitations/route.ts   # Friend/quest invitations API
├── SQL/
│   ├── database_design.txt        # Complete database schema documentation
│   └── seed.sql                   # Database seed with test data
├── docker-compose.yml             # Docker setup for PostgreSQL
└── public/
    └── [assets]
```

---

## 🗄️ Database Design

### Core Tables

1. **users** - User accounts and profile data
   - id, username, email, password_hash, level, total_xp, current_streak

2. **user_stats** - Personalized stats from kickstarter quiz
   - movement_level, social_comfort, stress_level, persona_title, etc.

3. **quests** - Available quests catalog
   - title, description, quest_type (daily/weekly/monthly), xp_reward

4. **user_quests** - Assigned quests and completion tracking
   - user_id, quest_id, is_completed, progress, xp_earned

5. **friendships** - Friend connections
   - user_id, friend_id, status (pending/accepted/rejected)

6. **quest_collaborations** - Collaborative quest instances
   - quest_id, created_by, status, total_xp

7. **collaboration_participants** - Participants in collaborative quests
   - collaboration_id, user_id, status, xp_earned

8. **suggested_friends** - AI-matched users based on similarity
   - user_id, suggested_user_id, similarity_score, reason

9. **notifications** - User notifications system
   - user_id, notification_type, title, message, is_read

10. **achievements** & **user_achievements** - Gamification system

---

## 🎨 Key Features Implemented

### 1. **Dashboard (Overview-Focused)**
- **Stats Cards**: Level, XP, Streak, Daily completion
- **Social Scoreboard**: Suggested users with similarity scores
- **Quick Quest Preview**: Today's quests summary
- **Invite System**: Send invitations to suggested users
- Less cluttered, focuses on social and overview

### 2. **Dedicated Quests Page**
- **Full Quest Management**: Daily, Weekly, Monthly quests
- **Filterable Tabs**: View by quest type
- **Quest Generation**: Create new quests by type
- **Completion Tracking**: Check off completed quests
- **Detailed Stats**: Progress bars and counters

### 3. **Social Features**
- **Suggested Friends**: Algorithm-based user matching
- **Similarity Scores**: Based on kickstarter quiz stats
- **Invitation System**: Friend requests and quest invitations
- **Collaborative Quests**: Team up for challenges

### 4. **Authentication Flow**
- Login → Kickstarter Quiz → Dashboard
- LocalStorage-based auth (placeholder for JWT)
- Protected routes with redirect

### 5. **Navigation**
- Conditional navbar (hidden on login page)
- Shows "Profil" when logged in, "Zaloguj sie" when not
- Logout functionality

---

## 🎨 Design System

### Color Palette (Green/Teal Theme)
- **Primary**: Emerald-500 to Teal-500 gradients
- **Background**: Emerald-50 to Teal-50 gradients
- **Accents**: Cyan, Violet for variety
- **Dark Mode**: Slate-950, Emerald-950

### Components
- **Glassmorphism**: backdrop-blur with semi-transparent backgrounds
- **Glow Effects**: Subtle blur gradients
- **Modern Cards**: Rounded borders, shadows, hover states
- **Responsive**: Mobile-first design

---

## 🚀 Setup Instructions

### 1. Database Setup with Docker

```bash
# Start PostgreSQL with seed data
docker-compose up -d

# Verify it's running
docker-compose ps

# Access database
docker-compose exec postgres psql -U liferpg -d liferpg_db

# Connection string for .env.local:
DATABASE_URL="postgresql://liferpg:liferpg123@localhost:5432/liferpg_db"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

### 4. Access the App

```
http://localhost:3000
```

---

## 📝 TODO: API Integration Checklist

All API endpoints are marked with `// TODO: Replace with real API call` comments.

### Priority 1: Authentication
- [ ] `/api/login` - Connect to database for user authentication
- [ ] Implement JWT tokens or session cookies
- [ ] Hash passwords with bcrypt

### Priority 2: Quests System
- [ ] `/api/quest` - Implement AI quest generation
- [ ] Fetch user quests from `user_quests` table
- [ ] Update quest completion in database
- [ ] Calculate XP and level progression

### Priority 3: Social Features
- [ ] `/api/friends/suggested` - Implement similarity algorithm
  - Calculate cosine similarity between user_stats
  - Rank by similarity_score
- [ ] `/api/invitations` - Send and accept invitations
  - Create friendship records
  - Create collaboration records
  - Generate notifications

### Priority 4: User Profile
- [ ] Fetch user stats from database
- [ ] Update profile information
- [ ] Avatar upload system

### Priority 5: Notifications
- [ ] Real-time notification system
- [ ] Unread count badges
- [ ] Notification preferences

---

## 🧪 Test Data

The seed.sql file includes:
- **10 test users** with varied stats
- **20+ sample quests** (daily, weekly, monthly)
- **Assigned quests** with some completed
- **Friendships** and pending requests
- **Suggested friends** with similarity scores
- **Notifications** for testing
- **Achievements** system foundation

### Test Accounts
- Username: `testuser1` to `testuser10`
- Password: `test123` (placeholder hash in seed)
- Each has unique persona and stats profile

---

## 🔐 Security Considerations

### Current (Development)
- LocalStorage for auth state
- Placeholder password validation
- No encryption

### Production Requirements
- [ ] Implement JWT with httpOnly cookies
- [ ] Bcrypt password hashing (seed.sql has placeholders)
- [ ] CSRF protection
- [ ] Rate limiting on API routes
- [ ] Input validation and sanitization
- [ ] SQL injection prevention (use parameterized queries)
- [ ] XSS protection

---

## 📊 Similarity Algorithm (To Implement)

```sql
-- Example query for finding similar users
WITH user_vector AS (
  SELECT 
    movement_level, social_comfort, stress_level,
    sleep_quality, sun_exposure, screen_time,
    competition_preference, internal_motivation,
    consistency, mental_state, time_available, social_support
  FROM user_stats
  WHERE user_id = $1
),
other_vectors AS (
  SELECT 
    us.user_id,
    us.movement_level, us.social_comfort, /* ...other fields... */
  FROM user_stats us
  WHERE us.user_id != $1
)
SELECT 
  u.id, u.username, u.level, u.total_xp,
  /* Calculate cosine similarity here */
  (ov.movement_level * uv.movement_level + 
   ov.social_comfort * uv.social_comfort + 
   /* ...sum all products... */) /
  (SQRT(/* sum of squares for user */) * 
   SQRT(/* sum of squares for other */)) AS similarity_score
FROM other_vectors ov
CROSS JOIN user_vector uv
JOIN users u ON ov.user_id = u.id
ORDER BY similarity_score DESC
LIMIT 10;
```

---

## 🎮 Gamification Mechanics

### XP & Levels
- Daily quests: 30-60 XP
- Weekly quests: 150-250 XP
- Monthly quests: 450-700 XP
- Level up every ~500 XP (adjust as needed)

### Streaks
- Daily login bonus
- Quest completion streaks
- Penalties for breaking streaks (optional)

### Achievements
- First quest completion
- 7-day streak
- 30-day streak
- Social achievements (5 friends, 10 collabs)
- Category mastery (50 fitness quests)

---

## 🔄 Workflow

1. **User Sign Up/Login** → `/` (page.tsx)
2. **Complete Kickstarter Quiz** → `/kickstarter`
   - Saves user_stats to database
3. **View Dashboard** → `/dashboard`
   - See stats, streak, suggested friends
   - Quick glance at today's quests
4. **Manage Quests** → `/quests`
   - Generate new quests
   - Complete quests
   - Track progress
5. **Social Interaction**
   - Invite suggested users
   - Accept friend requests
   - Collaborate on quests
6. **Profile Management** → `/profile`
   - View/edit personal info
   - See achievements

---

## 📦 Dependencies

Current dependencies (from package.json):
- Next.js 16.0.3
- React 19.2.0
- Tailwind CSS 4
- TypeScript 5

### Additional Recommendations
- **Database ORM**: Prisma or Drizzle
- **Auth**: NextAuth.js or Clerk
- **Validation**: Zod
- **State Management**: Zustand (if needed)
- **Real-time**: Pusher or Socket.io (for notifications)

---

## 🐛 Known Issues & Improvements

### Current Limitations
- No real database connection (all placeholder data)
- LocalStorage auth (not secure)
- No password hashing
- No real-time updates
- No email verification
- No password reset

### Planned Improvements
- [ ] Connect to MariaDB database
- [ ] Implement proper authentication
- [ ] Add real-time notifications
- [ ] Quest AI generation with GPT
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Leaderboards
- [ ] Teams/Guilds
- [ ] In-app achievements display
- [ ] Analytics dashboard

---

## 📞 Support & Development

### File Organization
- **Components**: App Router structure in `/app`
- **API Routes**: RESTful endpoints in `/app/api`
- **Database**: SQL files in `/SQL`
- **Styles**: Tailwind utility classes
- **Types**: TypeScript interfaces in each file

### Code Style
- Client components: `"use client"`
- Server components: default
- API routes: `/app/api/[route]/route.ts`
- Naming: kebab-case for files, PascalCase for components

---

## 🎯 Success Metrics (Future Analytics)

- Daily Active Users (DAU)
- Quest completion rate
- Average streak length
- Friend connections made
- Collaborative quest participation
- User retention rate
- Time spent in app
- XP growth rate

---

## 📄 License

Check LICENSE file in root directory.

---

**Last Updated**: November 25, 2025
**Version**: 1.0.0
**Status**: Development (Database not connected)

