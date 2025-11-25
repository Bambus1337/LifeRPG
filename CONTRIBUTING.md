# Contributing to LifeRPG

Thank you for your interest in contributing to LifeRPG! 🎉

## Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/LifeRPG.git
   cd LifeRPG
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up the database**
   ```bash
   pnpm db:start
   cp .env.example .env.local
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

## Development Workflow

1. Create a new branch for your feature/fix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes
3. Test your changes thoroughly
4. Commit your changes
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. Push to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Run `pnpm lint` before committing
- Use meaningful variable and function names
- Add comments for complex logic

## Project Structure

```
LifeRPG/
├── app/              # Next.js app directory
│   ├── api/         # API routes
│   ├── dashboard/   # Dashboard page
│   ├── quests/      # Quests page
│   └── ...
├── SQL/             # Database schema and seed data
├── docs/            # Documentation
└── public/          # Static assets
```

## Database Changes

If you need to modify the database schema:

1. Update `SQL/database_design.txt`
2. Update `SQL/seed.sql` if needed
3. Document the changes in your PR

## Testing

Before submitting a PR:

- [ ] Code compiles without errors
- [ ] All pages load correctly
- [ ] Database operations work as expected
- [ ] No console errors in the browser
- [ ] Mobile responsive design works

## Need Help?

- Check the `docs/` folder for detailed documentation
- Review existing issues and PRs
- Ask questions in PR comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow

Thank you for contributing! 🚀
# Database Configuration
DATABASE_URL="mysql://liferpg:liferpg123@localhost:3306/liferpg_db"

# Next.js Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# API Keys (add your keys here)
# OPENAI_API_KEY="your-openai-api-key-here"
# JWT_SECRET="your-jwt-secret-here"

# Email Configuration (optional)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-email-password"

