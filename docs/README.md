# LifeRPG Documentation Index

Welcome to the LifeRPG documentation! This index will help you find the information you need.

## 📚 Quick Links

### Getting Started
- [README](../README.md) - Project overview and quick start
- [Setup Guide](SETUP_COMPLETE.md) - Detailed installation instructions
- [Contributing](../CONTRIBUTING.md) - How to contribute to the project
- [Changelog](../CHANGELOG.md) - Version history and changes

### Technical Documentation
- [Project Summary](PROJECT_SUMMARY.md) - Complete feature list and architecture
- [Database Schema](../SQL/database_design.txt) - Full database documentation
- [MariaDB Migration](MARIADB_MIGRATION.md) - PostgreSQL to MariaDB conversion guide

### Database
- [Schema Design](../SQL/database_design.txt) - All tables, relationships, and indexes
- [Seed Data](../SQL/seed.sql) - Test data and sample users

## 🎯 Documentation by Topic

### For Developers

#### Setup & Configuration
- **Installation:** See [README Quick Start](../README.md#-quick-start)
- **Database Setup:** See [Setup Guide - Database Section](SETUP_COMPLETE.md#-database-setup)
- **Environment Variables:** See [.env.example](../.env.example)

#### Architecture
- **Project Structure:** See [Project Summary - Structure](PROJECT_SUMMARY.md#-project-structure)
- **Database Design:** See [Database Schema](../SQL/database_design.txt)
- **API Routes:** See [Project Summary - API Routes](PROJECT_SUMMARY.md#-api-routes)

#### Development
- **NPM Scripts:** See [README - Scripts](../README.md#-available-scripts)
- **Code Style:** See [Contributing - Code Style](../CONTRIBUTING.md#code-style)
- **Git Workflow:** See [Contributing - Workflow](../CONTRIBUTING.md#development-workflow)

### For Contributors

#### Getting Started
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Fork the repository
3. Follow [Setup Guide](SETUP_COMPLETE.md)
4. Check [Changelog](../CHANGELOG.md) for current version

#### Making Changes
- **Commit Messages:** [Conventional Commits](../CONTRIBUTING.md#commit-message-convention)
- **Testing:** [Testing Checklist](../CONTRIBUTING.md#testing)
- **Database Changes:** [Database Guidelines](../CONTRIBUTING.md#database-changes)

### For Users

#### Features
- **Quest System:** See [Project Summary - Features](PROJECT_SUMMARY.md#-key-features-implemented)
- **Social Features:** Friend suggestions, collaborations
- **Gamification:** XP, levels, streaks, achievements

#### Getting Help
- **Troubleshooting:** See [README - Troubleshooting](../README.md#-troubleshooting)
- **Support:** Report issues on GitHub

## 📖 Documentation Files

### Core Documentation
| File | Description |
|------|-------------|
| [README.md](../README.md) | Main project readme with quick start |
| [SETUP_COMPLETE.md](SETUP_COMPLETE.md) | Comprehensive setup and deployment guide |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Detailed feature documentation |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |

### Technical Documentation
| File | Description |
|------|-------------|
| [MARIADB_MIGRATION.md](MARIADB_MIGRATION.md) | Database migration guide |
| [database_design.txt](../SQL/database_design.txt) | Complete database schema |
| [seed.sql](../SQL/seed.sql) | Database seed with test data |
| [.env.example](../.env.example) | Environment variables template |

## 🔍 Search by Topic

### Authentication
- Setup: [Setup Guide](SETUP_COMPLETE.md#-authentication)
- API: [Project Summary - Login API](PROJECT_SUMMARY.md#priority-1-authentication)
- Security: [README - Security](../README.md#️-security-notice)

### Database
- Schema: [Database Design](../SQL/database_design.txt)
- Connection: [Setup Guide - Database](SETUP_COMPLETE.md#-database-connection-info)
- Commands: [README - Database](../README.md#️-database-commands)
- Migration: [MariaDB Migration](MARIADB_MIGRATION.md)

### Quests
- Features: [Project Summary - Quests](PROJECT_SUMMARY.md#2-dedicated-quests-page)
- API: [Project Summary - Quest API](PROJECT_SUMMARY.md#priority-2-quests-system)
- Database: [Database Design - Quests Table](../SQL/database_design.txt)

### Social Features
- Friend Suggestions: [Project Summary - Social](PROJECT_SUMMARY.md#3-social-features)
- Invitations API: [Project Summary - API](PROJECT_SUMMARY.md#priority-3-social-features)
- Collaborations: [Database Design - Collaborations](../SQL/database_design.txt)

### UI/UX
- Design System: [Project Summary - Design](PROJECT_SUMMARY.md#-design-system)
- Pages: [README - Pages](../README.md#-pages)
- Styling: [README - Tech Stack](../README.md#️-tech-stack)

## 🚀 Common Tasks

### Start Development
```bash
pnpm install
pnpm db:start
cp .env.example .env.local
pnpm dev
```
See: [README Quick Start](../README.md#-quick-start)

### Database Operations
```bash
pnpm db:start    # Start
pnpm db:stop     # Stop
pnpm db:reset    # Reset
pnpm db:shell    # Access
```
See: [README Database](../README.md#️-database-commands)

### Make Changes
1. Create branch
2. Make changes
3. Test
4. Commit
5. Push
6. Create PR

See: [Contributing Workflow](../CONTRIBUTING.md#development-workflow)

## 📞 Need Help?

- 📖 Check documentation above
- 🐛 [Report a bug](../../issues)
- 💬 [Ask a question](../../discussions)
- 🤝 [Contribute](../CONTRIBUTING.md)

## 🔄 Keep Updated

Check the [CHANGELOG](../CHANGELOG.md) for:
- Latest features
- Bug fixes
- Breaking changes
- Planned features

---

**Last Updated:** November 25, 2024  
**Version:** 0.1.0  
**Maintained by:** LifeRPG Contributors

