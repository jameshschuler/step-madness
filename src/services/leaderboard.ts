import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  teams,
  players,
  teamPlayers,
  dailyPerformance,
  leaderboard,
} from '@/db/schema'
import { eq, sql, desc, asc } from 'drizzle-orm'

export const getIndividualLeaderboard = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db
    .select({
      id: players.id,
      name: players.name,
      avatar: players.avatar,
      teamName: teams.name,
      teamAvatar: teams.avatar,
      totalSteps: sql<number>`sum(${dailyPerformance.stepCount})`,
    })
    .from(players)
    .leftJoin(teamPlayers, eq(players.id, teamPlayers.playerId))
    .leftJoin(teams, eq(teamPlayers.teamId, teams.id))
    .leftJoin(dailyPerformance, eq(players.id, dailyPerformance.playerId))
    .groupBy(players.id)
    .orderBy(desc(sql`sum(${dailyPerformance.stepCount})`), asc(players.name))
    .limit(50)
})

export const getTeamLeaderboard = createServerFn({ method: 'GET' }).handler(
  async () => {
    const result = await db
      .select({
        id: teams.id,
        name: teams.name,
        avatar: teams.avatar,
        // Points and Record from the leaderboard table
        totalPoints: leaderboard.totalPoints,
        wins: leaderboard.wins,
        losses: leaderboard.losses,
        // Calculated Stats
        dailyAvg: sql<number>`round(avg(${dailyPerformance.stepCount}), 1)`,
        totalSteps: sql<number>`sum(${dailyPerformance.stepCount})`,
        playerCount: sql<number>`count(distinct ${players.id})`,
      })
      .from(teams)
      // Join with the leaderboard table to get points/record
      .leftJoin(leaderboard, eq(teams.id, leaderboard.teamId))
      .leftJoin(teamPlayers, eq(teams.id, teamPlayers.teamId))
      .leftJoin(players, eq(teamPlayers.playerId, players.id))
      .leftJoin(dailyPerformance, eq(players.id, dailyPerformance.playerId))
      .groupBy(
        teams.id,
        leaderboard.totalPoints,
        leaderboard.wins,
        leaderboard.losses,
      )
      .orderBy(
        // Primary sort: Points (3 for Win, 1 for Participation, etc.)
        desc(leaderboard.totalPoints),
        // Secondary sort: Average steps (Tie-breaker)
        desc(sql`avg(${dailyPerformance.stepCount})`),
      )

    return result
  },
)
