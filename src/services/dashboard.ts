import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  matchups,
  players,
  teamPlayers,
  dailyPerformance,
  teams,
} from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import z from 'zod'

export const getDashboardData = createServerFn({ method: 'GET' })
  .inputValidator(
    z.preprocess((val) => Number(val), z.number().min(1).catch(1)),
  )
  .handler(async ({ data: week }) => {
    const weeklyMatchups = await db
      .select({
        id: matchups.id,
        team1Id: matchups.team1Id,
        team2Id: matchups.team2Id,
        startDate: matchups.startDate,
      })
      .from(matchups)
      .where(eq(matchups.weekNumber, week))

    const dashboardMatchups = await Promise.all(
      weeklyMatchups.map(async (match) => {
        const getTeamDetails = async (teamId: number | null) => {
          if (!teamId)
            return {
              name: 'TBD',
              displayName: 'TBD',
              avatar: 'Target',
              avg: 0,
              total: 0,
              players: [],
            }

          // 1. Fetch Team Metadata
          const teamInfo = await db
            .select({ name: teams.name, avatar: teams.avatar })
            .from(teams)
            .where(eq(teams.id, teamId))
            .then((res) => res[0])

          // 2. Fetch Player Stats for this team
          const stats = await db
            .select({
              name: players.name,
              id: players.id,
              steps: sql<number>`sum(${dailyPerformance.stepCount})`,
            })
            .from(players)
            .innerJoin(teamPlayers, eq(players.id, teamPlayers.playerId))
            .leftJoin(
              dailyPerformance,
              eq(players.id, dailyPerformance.playerId),
            )
            .where(eq(teamPlayers.teamId, teamId))
            .groupBy(players.id)

          const total = stats.reduce(
            (acc, p) => acc + (Number(p.steps) || 0),
            0,
          )
          const avg =
            stats.length > 0 ? (total / stats.length / 1000).toFixed(1) : 0

          return {
            name: teamInfo?.name ?? 'Unknown',
            displayName: `Team ${teamInfo?.name ?? 'Unknown'}`,
            avatar: teamInfo?.avatar ?? 'Target',
            avg,
            total,
            players: stats,
          }
        }

        const [team1, team2] = await Promise.all([
          getTeamDetails(match.team1Id),
          getTeamDetails(match.team2Id),
        ])

        return {
          id: match.id,
          startDate: match.startDate,
          team1,
          team2,
        }
      }),
    )

    return dashboardMatchups
  })
