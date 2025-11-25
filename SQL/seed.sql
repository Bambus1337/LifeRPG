-- LifeRPG Database Seed File
-- MariaDB Seed Data for Testing
-- Run this after creating the schema to populate with test data

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- 1. DROP AND CREATE TABLES
-- =============================================================================

DROP TABLE IF EXISTS user_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS suggested_friends;
DROP TABLE IF EXISTS collaboration_participants;
DROP TABLE IF EXISTS quest_collaborations;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS user_quests;
DROP TABLE IF EXISTS quests;
DROP TABLE IF EXISTS user_stats;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active TINYINT(1) DEFAULT 1,
  total_xp INT DEFAULT 0,
  level INT DEFAULT 1,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  INDEX idx_total_xp (total_xp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_stats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  movement_level DECIMAL(3,2) DEFAULT 0,
  social_comfort DECIMAL(3,2) DEFAULT 0,
  stress_level DECIMAL(3,2) DEFAULT 0,
  sleep_quality DECIMAL(3,2) DEFAULT 0,
  sun_exposure DECIMAL(3,2) DEFAULT 0,
  screen_time DECIMAL(3,2) DEFAULT 0,
  competition_preference DECIMAL(3,2) DEFAULT 0,
  internal_motivation DECIMAL(3,2) DEFAULT 0,
  consistency DECIMAL(3,2) DEFAULT 0,
  mental_state DECIMAL(3,2) DEFAULT 0,
  time_available DECIMAL(3,2) DEFAULT 0,
  social_support DECIMAL(3,2) DEFAULT 0,
  persona_title VARCHAR(100),
  persona_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  quest_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard'),
  xp_reward INT NOT NULL,
  category ENUM('physical', 'mental', 'social', 'learning'),
  requirements JSON,
  is_collaborative TINYINT(1) DEFAULT 0,
  max_participants INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active TINYINT(1) DEFAULT 1,
  INDEX idx_quest_type (quest_type),
  INDEX idx_category (category),
  INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_quests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quest_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  is_completed TINYINT(1) DEFAULT 0,
  progress INT DEFAULT 0,
  expires_at TIMESTAMP NULL,
  xp_earned INT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
  INDEX idx_user_assigned (user_id, assigned_at),
  INDEX idx_quest_id (quest_id),
  INDEX idx_user_completed (user_id, is_completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE friendships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  friend_id INT NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'blocked') NOT NULL,
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  created_by INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id),
  UNIQUE KEY unique_friendship (user_id, friend_id),
  INDEX idx_user_status (user_id, status),
  INDEX idx_friend_status (friend_id, status),
  CONSTRAINT chk_friendship CHECK (user_id != friend_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE quest_collaborations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quest_id INT NOT NULL,
  created_by INT NOT NULL,
  status ENUM('active', 'completed', 'cancelled') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  total_xp INT DEFAULT 0,
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_quest_id (quest_id),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE collaboration_participants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  collaboration_id INT NOT NULL,
  user_id INT NOT NULL,
  status ENUM('invited', 'accepted', 'declined', 'completed') NOT NULL,
  invited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  contribution_score INT DEFAULT 0,
  xp_earned INT DEFAULT 0,
  FOREIGN KEY (collaboration_id) REFERENCES quest_collaborations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_participant (collaboration_id, user_id),
  INDEX idx_user_status (user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE suggested_friends (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  suggested_user_id INT NOT NULL,
  similarity_score DECIMAL(5,2),
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_dismissed TINYINT(1) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (suggested_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_suggestion (user_id, suggested_user_id),
  INDEX idx_user_score (user_id, similarity_score DESC),
  CONSTRAINT chk_suggestion CHECK (user_id != suggested_user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  related_id INT,
  related_type VARCHAR(50),
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at DESC),
  INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  requirements JSON,
  xp_reward INT DEFAULT 0,
  rarity ENUM('common', 'rare', 'epic', 'legendary'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rarity (rarity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE user_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  achievement_id INT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_achievement (user_id, achievement_id),
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. INSERT TEST USERS (password: 'test123' - use bcrypt in production)
-- =============================================================================

-- Password for all test users: test123
-- bcrypt hash: $2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi
INSERT INTO users (username, email, password_hash, display_name, total_xp, level, current_streak, longest_streak) VALUES
('testuser1', 'test1@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Active Alex', 1250, 5, 7, 15),
('testuser2', 'test2@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Social Sarah', 890, 4, 3, 10),
('testuser3', 'test3@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Consistent Chris', 2100, 7, 14, 20),
('testuser4', 'test4@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Beginner Ben', 320, 2, 2, 5),
('testuser5', 'test5@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Motivated Maya', 1650, 6, 9, 18),
('testuser6', 'test6@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Zen Zoe', 775, 3, 5, 8),
('testuser7', 'test7@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Competitive Carlos', 1890, 6, 11, 16),
('testuser8', 'test8@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Introvert Ivy', 560, 3, 4, 7),
('testuser9', 'test9@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Energetic Emma', 1420, 5, 8, 12),
('testuser10', 'test10@liferpg.com', '$2a$10$rXqvhL5FHQlYJCjZvHZ3JOGVqX.ByPmF8nBvXn5YLZ5YZYzQjZ3Bi', 'Learning Leo', 990, 4, 6, 11);

-- =============================================================================
-- 3. INSERT USER STATS (from kickstarter quiz)
-- =============================================================================

INSERT INTO user_stats (user_id, movement_level, social_comfort, stress_level, sleep_quality, sun_exposure,
                        screen_time, competition_preference, internal_motivation, consistency, mental_state,
                        time_available, social_support, persona_title, persona_description) VALUES
(1, 0.75, 0.50, -0.25, 0.50, 0.75, -0.50, 0.80, 0.60, 0.70, 0.40, 0.50, 0.60, 'Stabilny Odkrywca', 'Masz potencjał ruchowy i dobrą konsekwencję.'),
(2, 0.25, 0.85, 0.00, 0.25, 0.50, -0.25, 0.30, 0.40, 0.50, 0.30, 0.40, 0.90, 'Świadomy Gracz Zmiany', 'Kontakty z ludźmi mogą być Twoim buffem.'),
(3, 0.60, 0.40, -0.50, 0.70, 0.80, -0.75, 0.50, 0.80, 0.90, 0.60, 0.70, 0.50, 'Stabilny Odkrywca', 'Masz doskonałą konsekwencję i regulację stresu.'),
(4, -0.50, -0.25, 0.50, -0.25, -0.50, 0.75, -0.30, -0.20, -0.60, -0.30, -0.25, -0.40, 'Cichy Wojownik', 'Zaczynasz z trudnego miejsca, ale każdy krok się liczy.'),
(5, 0.50, 0.60, 0.25, 0.40, 0.60, -0.40, 0.70, 0.90, 0.65, 0.50, 0.55, 0.65, 'Stabilny Odkrywca', 'Napędza Cię rozwój wewnętrzny.'),
(6, 0.10, -0.40, 0.60, 0.20, 0.30, 0.20, -0.50, 0.50, 0.30, -0.20, 0.25, -0.30, 'Startujący z Trybu Przetrwania', 'Szanujemy Twoje tempo społeczne.'),
(7, 0.85, 0.70, -0.40, 0.60, 0.70, -0.60, 0.95, 0.70, 0.75, 0.55, 0.65, 0.70, 'Stabilny Odkrywca', 'Rywalizacja jest Twoim paliwem.'),
(8, 0.20, -0.60, 0.40, 0.10, 0.20, 0.60, -0.70, 0.30, 0.40, 0.00, 0.30, -0.50, 'Startujący z Trybu Przetrwania', 'Lepiej czujesz się w samotności.'),
(9, 0.80, 0.75, -0.10, 0.65, 0.85, -0.55, 0.60, 0.65, 0.70, 0.70, 0.60, 0.75, 'Stabilny Odkrywca', 'Masz wysoką energię i dobry stan psychiczny.'),
(10, 0.40, 0.45, 0.20, 0.35, 0.40, -0.20, 0.40, 0.75, 0.55, 0.40, 0.50, 0.55, 'Świadomy Gracz Zmiany', 'Uczysz się i rozwijasz swoim tempem.');

-- =============================================================================
-- 4. INSERT SAMPLE QUESTS
-- =============================================================================

INSERT INTO quests (title, description, quest_type, difficulty, xp_reward, category, is_collaborative, max_participants) VALUES
-- Daily Quests
('Poranny spacer', 'Wyjdź na 15-minutowy spacer rano', 'daily', 'easy', 50, 'physical', 0, 1),
('5 minut medytacji', 'Poświęć 5 minut na medytację lub głębokie oddychanie', 'daily', 'easy', 40, 'mental', 0, 1),
('Pij wodę', 'Wypij 8 szklanek wody dzisiaj', 'daily', 'easy', 30, 'physical', 0, 1),
('Zdrowy posiłek', 'Zjedz przynajmniej jeden pełnowartościowy posiłek', 'daily', 'easy', 45, 'physical', 0, 1),
('Nauka 20 min', 'Poświęć 20 minut na naukę czegoś nowego', 'daily', 'medium', 60, 'learning', 0, 1),
('Bez telefonu przed snem', 'Nie używaj telefonu godzinę przed snem', 'daily', 'medium', 55, 'mental', 0, 1),
('Podziękuj komuś', 'Wyraź wdzięczność jednej osobie dzisiaj', 'daily', 'easy', 35, 'social', 0, 1),

-- Weekly Quests
('Trening 3x', 'Ćwicz przynajmniej 3 razy w tym tygodniu po 30 minut', 'weekly', 'medium', 200, 'physical', 0, 1),
('Spotkaj się z przyjacielem', 'Spotkaj się z kimś na żywo lub online', 'weekly', 'medium', 150, 'social', 1, 4),
('Przeczytaj artykuł', 'Przeczytaj 3 artykuły edukacyjne', 'weekly', 'medium', 180, 'learning', 0, 1),
('Dobry sen', 'Śpij minimum 7 godzin przez 5 dni w tygodniu', 'weekly', 'hard', 250, 'physical', 0, 1),
('Outdoor time', 'Spędź łącznie 2 godziny na świeżym powietrzu', 'weekly', 'medium', 170, 'physical', 1, 3),
('Nowy skill', 'Zacznij naukę nowej umiejętności lub hobby', 'weekly', 'hard', 220, 'learning', 0, 1),

-- Monthly Quests
('Mistrz nawyków', 'Utrzymaj 21-dniowy streak dowolnego nawyku', 'monthly', 'hard', 500, 'mental', 0, 1),
('Fitness challenge', 'Ukończ 20 treningów w miesiącu', 'monthly', 'hard', 600, 'physical', 0, 1),
('Książka miesiąca', 'Przeczytaj całą książkę', 'monthly', 'medium', 450, 'learning', 0, 1),
('Social butterfly', 'Poznaj 5 nowych osób', 'monthly', 'hard', 550, 'social', 1, 2),
('Mindfulness master', 'Medytuj codziennie przez cały miesiąc', 'monthly', 'hard', 650, 'mental', 0, 1),
('Team quest', 'Wspólnie z kimś osiągnijcie cel fitness', 'monthly', 'hard', 700, 'physical', 1, 5);

-- =============================================================================
-- 5. ASSIGN SOME QUESTS TO USERS
-- =============================================================================

INSERT INTO user_quests (user_id, quest_id, is_completed, progress, completed_at, xp_earned, expires_at) VALUES
-- User 1 quests
(1, 1, 1, 100, DATE_SUB(NOW(), INTERVAL 2 HOUR), 50, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 5, 0, 60, NULL, 0, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(1, 8, 0, 33, NULL, 0, DATE_ADD(NOW(), INTERVAL 5 DAY)),

-- User 2 quests
(2, 2, 1, 100, DATE_SUB(NOW(), INTERVAL 5 HOUR), 40, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 7, 1, 100, DATE_SUB(NOW(), INTERVAL 3 HOUR), 35, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(2, 9, 0, 50, NULL, 0, DATE_ADD(NOW(), INTERVAL 4 DAY)),

-- User 3 quests
(3, 1, 1, 100, DATE_SUB(NOW(), INTERVAL 1 HOUR), 50, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(3, 3, 1, 100, DATE_SUB(NOW(), INTERVAL 6 HOUR), 30, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(3, 4, 1, 100, DATE_SUB(NOW(), INTERVAL 4 HOUR), 45, DATE_ADD(NOW(), INTERVAL 1 DAY)),
(3, 14, 0, 75, NULL, 0, DATE_ADD(NOW(), INTERVAL 20 DAY));

-- =============================================================================
-- 6. CREATE FRIENDSHIPS
-- =============================================================================

INSERT INTO friendships (user_id, friend_id, status, created_by, accepted_at) VALUES
(1, 2, 'accepted', 1, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 3, 'accepted', 1, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 3, 'accepted', 2, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(4, 5, 'pending', 4, NULL),
(6, 7, 'accepted', 6, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(8, 9, 'pending', 8, NULL),
(1, 5, 'accepted', 5, DATE_SUB(NOW(), INTERVAL 12 DAY));

-- =============================================================================
-- 7. CREATE SUGGESTED FRIENDS (based on similar stats)
-- =============================================================================

INSERT INTO suggested_friends (user_id, suggested_user_id, similarity_score, reason) VALUES
(1, 3, 85.50, 'Podobny poziom aktywności i konsekwencji'),
(1, 7, 78.30, 'Obaj lubicie rywalizację i jesteście aktywni'),
(2, 9, 82.10, 'Podobny komfort społeczny i energia'),
(4, 6, 71.20, 'Startujecie z podobnego poziomu'),
(5, 7, 76.90, 'Wysoka motywacja i rywalizacja'),
(6, 8, 79.40, 'Introwertyczne podejście do zadań'),
(3, 5, 80.60, 'Wysoka konsekwencja i motywacja wewnętrzna'),
(2, 10, 73.50, 'Podobne podejście do nauki i rozwoju');

-- =============================================================================
-- 8. CREATE SAMPLE COLLABORATIVE QUEST
-- =============================================================================

INSERT INTO quest_collaborations (quest_id, created_by, status, total_xp) VALUES
(9, 2, 'active', 0);

INSERT INTO collaboration_participants (collaboration_id, user_id, status, accepted_at) VALUES
(1, 2, 'accepted', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 3, 'accepted', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 1, 'invited', NULL);

-- =============================================================================
-- 9. CREATE NOTIFICATIONS
-- =============================================================================

INSERT INTO notifications (user_id, notification_type, title, message, related_id, related_type) VALUES
(1, 'quest_invite', 'Zaproszenie do wspólnego questu', 'Social Sarah zaprasza Cię do questu: Spotkaj się z przyjacielem', 1, 'collaboration'),
(4, 'friend_request', 'Nowa prośba o znajomość', 'Active Alex chce dodać Cię do znajomych', 1, 'friendship'),
(8, 'friend_request', 'Nowa prośba o znajomość', 'Introvert Ivy wysłał Ci zaproszenie', 6, 'friendship'),
(1, 'quest_complete', 'Quest ukończony!', 'Gratulacje! Ukończyłeś "Poranny spacer" i zdobyłeś 50 XP', 1, 'quest'),
(2, 'achievement', 'Nowe osiągnięcie!', 'Odblokowałeś osiągnięcie: Social Butterfly', NULL, 'achievement');

-- =============================================================================
-- 10. CREATE ACHIEVEMENTS
-- =============================================================================

INSERT INTO achievements (name, description, icon, xp_reward, rarity) VALUES
('First Steps', 'Ukończ swój pierwszy quest', '🎯', 100, 'common'),
('Week Warrior', 'Utrzymaj 7-dniowy streak', '🔥', 250, 'common'),
('Social Butterfly', 'Dodaj 5 znajomych', '🦋', 200, 'common'),
('Team Player', 'Ukończ wspólny quest', '🤝', 300, 'rare'),
('Consistency King', 'Utrzymaj 30-dniowy streak', '👑', 500, 'epic'),
('Level 10', 'Osiągnij poziom 10', '⭐', 400, 'rare'),
('Quest Master', 'Ukończ 100 questów', '🏆', 1000, 'legendary'),
('Fitness Fanatic', 'Ukończ 50 questów fizycznych', '💪', 600, 'epic'),
('Learning Legend', 'Ukończ 50 questów edukacyjnych', '📚', 600, 'epic'),
('Zen Master', 'Ukończ 50 questów mentalnych', '🧘', 600, 'epic');

-- =============================================================================
-- 11. ASSIGN SOME ACHIEVEMENTS TO USERS
-- =============================================================================

INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES
(1, 1, DATE_SUB(NOW(), INTERVAL 20 DAY)),
(1, 2, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 1, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 3, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 2, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(7, 4, DATE_SUB(NOW(), INTERVAL 3 DAY));

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- VERIFICATION QUERIES (uncomment to test)
-- =============================================================================

-- SELECT u.username, u.level, u.total_xp, us.persona_title
-- FROM users u
-- JOIN user_stats us ON u.id = us.user_id
-- ORDER BY u.total_xp DESC;

-- SELECT u1.username as user, u2.username as suggested_friend, sf.similarity_score, sf.reason
-- FROM suggested_friends sf
-- JOIN users u1 ON sf.user_id = u1.id
-- JOIN users u2 ON sf.suggested_user_id = u2.id
-- WHERE u1.username = 'testuser1';

-- SELECT u.username, q.title, q.quest_type, uq.progress, uq.is_completed
-- FROM user_quests uq
-- JOIN users u ON uq.user_id = u.id
-- JOIN quests q ON uq.quest_id = q.id
-- WHERE u.username = 'testuser1';

