import {
  sqliteTable,
  integer,
  text,
  primaryKey,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// export const todos = sqliteTable('todos', {
//   id: integer({ mode: 'number' }).primaryKey({
//     autoIncrement: true,
//   }),
//   title: text().notNull(),
//   createdAt: integer('created_at', { mode: 'timestamp' }).default(
//     sql`(unixepoch())`,
//   ),
// })

// 1. Challenges (The overall event)
export const challenges = sqliteTable('challenges', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  slug: text('slug').unique().notNull(),
})

// 2. Teams
export const teams = sqliteTable('teams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatar: text('avatar'),
})

// 3. Players
export const players = sqliteTable('players', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  avatar: text('avatar'),
  stepUpId: text('step_up_id').unique(), // Reference for StepUp API
})

// 4. Team-Player Junction (Many-to-Many)
export const teamPlayers = sqliteTable(
  'team_players',
  {
    teamId: integer('team_id').references(() => teams.id),
    playerId: integer('player_id').references(() => players.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.teamId, t.playerId] }),
  }),
)

// 5. Daily Performance (Source of steps)
export const dailyPerformance = sqliteTable(
  'daily_performance',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    playerId: integer('player_id')
      .references(() => players.id)
      .notNull(),
    date: text('date').notNull(), // Store as 'YYYY-MM-DD' for easier SQLite grouping
    stepCount: integer('step_count').default(0).notNull(),
  },
  (table) => ({
    // Crucial: Prevents duplicate entries for the same player on the same day
    playerDateIdx: uniqueIndex('player_date_idx').on(
      table.playerId,
      table.date,
    ),
  }),
)

// 6. Matchups (Handles Weeks 1-3 AND Rounds 1-2)
export const matchups = sqliteTable('matchups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  challengeId: integer('challenge_id').references(() => challenges.id),
  team1Id: integer('team1_id').references(() => teams.id),
  team2Id: integer('team2_id').references(() => teams.id),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  weekNumber: integer('week_number'), // 1, 2, 3
  roundNumber: integer('round_number'), // 1, 2 (for Playoffs)
  isPlayoff: integer('is_playoff', { mode: 'boolean' }).default(false),
  seed1: integer('seed_1'), // e.g., 1
  seed2: integer('seed_2'), // e.g., 4
})

// 7. Matchup Results (The Scoreboard)
export const matchupResults = sqliteTable('matchup_results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  matchupId: integer('matchup_id').references(() => matchups.id),

  // Aggregate stats for the UI
  team1TotalSteps: integer('team1_total_steps').default(0),
  team2TotalSteps: integer('team2_total_steps').default(0),

  // Final calculated points for the Leaderboard
  team1Points: integer('team1_points').default(0), // (Win? 3 : 0) + (Loser? 1 : 0) + (Avg>6k? 1 : 0)
  team2Points: integer('team2_points').default(0),

  isFinalized: integer('is_finalized', { mode: 'boolean' }).default(false),
})

export const leaderboard = sqliteTable('leaderboard', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  challengeId: integer('challenge_id').references(() => challenges.id),
  teamId: integer('team_id').references(() => teams.id),

  // Aggregated Stats
  wins: integer('wins').default(0),
  losses: integer('losses').default(0),

  // Points System (Win=3, Partic=1, Bonus=1)
  totalPoints: integer('total_points').default(0),

  // Tie-breaker: Cumulative steps across all weeks
  cumulativeSteps: integer('cumulative_steps').default(0),

  lastUpdated: integer('last_updated', { mode: 'timestamp' }),
})
