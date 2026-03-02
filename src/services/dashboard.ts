import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import {
  matchups,
  players,
  teamPlayers,
  dailyPerformance,
  teams,
} from '@/db/schema'
import { and, between, eq, sql } from 'drizzle-orm'
import z from 'zod'

export const getDashboardData = createServerFn({ method: 'GET' })
  .inputValidator(
    z.preprocess((val) => Number(val), z.number().min(1).catch(1)),
  )
  .handler(async ({ data: week }) => {
    // 1. Fetch the matchups for the specific week to get their date ranges
    const weeklyMatchups = await db
      .select({
        id: matchups.id,
        team1Id: matchups.team1Id,
        team2Id: matchups.team2Id,
        startDate: matchups.startDate,
        endDate: matchups.endDate, // Added this to define the filter range
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

          const teamInfo = await db
            .select({ name: teams.name, avatar: teams.avatar })
            .from(teams)
            .where(eq(teams.id, teamId))
            .then((res) => res[0])

          const startStr = match.startDate.toISOString().split('T')[0]
          const endStr = match.endDate.toISOString().split('T')[0]

          // 2. Fetch Player Stats FILTERED by the matchup dates
          const stats = await db
            .select({
              name: players.name,
              id: players.id,
              // We use a null check for steps because leftJoin might return null for no-activity days
              steps: sql<number>`COALESCE(SUM(${dailyPerformance.stepCount}), 0)`,
            })
            .from(players)
            .innerJoin(teamPlayers, eq(players.id, teamPlayers.playerId))
            .leftJoin(
              dailyPerformance,
              and(
                eq(players.id, dailyPerformance.playerId),
                // Only sum steps between the matchup's start and end date
                between(dailyPerformance.date, startStr, endStr),
              ),
            )
            .where(eq(teamPlayers.teamId, teamId))
            .groupBy(players.id)

          const total = stats.reduce(
            (acc, p) => acc + (Number(p.steps) || 0),
            0,
          )

          // Calculate the number of days in the matchup to get an accurate daily average
          const diffTime = Math.abs(
            match.endDate.getTime() - match.startDate.getTime(),
          )
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1

          const avg =
            stats.length > 0
              ? (total / stats.length / diffDays / 1000).toFixed(1)
              : '0.0'

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
          endDate: match.endDate,
          team1,
          team2,
        }
      }),
    )

    return dashboardMatchups
  })
