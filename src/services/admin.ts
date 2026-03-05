import { db } from '@/db'
import {
  matchups,
  dailyPerformance,
  teamPlayers,
  matchupResults,
  leaderboard,
} from '@/db/schema'
import { createServerFn } from '@tanstack/react-start'
import { eq, and, between, sql } from 'drizzle-orm'
import { z } from 'zod'

export const finalizeWeek = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ weekNumber: z.number() }))
  .handler(async ({ data: { weekNumber } }) => {
    return await db.transaction(async (tx) => {
      // 1. Fetch all matchups for the specified week
      const weeklyMatchups = await tx
        .select()
        .from(matchups)
        .where(
          and(eq(matchups.weekNumber, weekNumber), eq(matchups.status, 'live')),
        )

      for (const match of weeklyMatchups) {
        const startStr = match.startDate.toISOString().split('T')[0]
        const endStr = match.endDate.toISOString().split('T')[0]
        // Helper to get stats for a team during the match dates
        const getTeamStats = async (teamId: number) => {
          const stats = await tx
            .select({
              totalSteps: sql<number>`COALESCE(SUM(${dailyPerformance.stepCount}), 0)`,
              playerCount: sql<number>`COUNT(DISTINCT ${teamPlayers.playerId})`,
              daysActive: sql<number>`COUNT(DISTINCT ${dailyPerformance.date})`,
            })
            .from(teamPlayers)
            .leftJoin(
              dailyPerformance,
              eq(teamPlayers.playerId, dailyPerformance.playerId),
            )
            .where(
              and(
                eq(teamPlayers.teamId, teamId),
                between(dailyPerformance.date, startStr, endStr),
              ),
            )
            .then((res) => res[0])

          const steps = Number(stats.totalSteps)
          const members = Number(stats.playerCount) || 1
          const days = Number(stats.daysActive) || 1
          const dailyAvg = steps / members / days

          return { steps, dailyAvg }
        }

        const t1 = await getTeamStats(match.team1Id!)
        const t2 = await getTeamStats(match.team2Id!)

        // 2. Calculate Points Logic
        // Base: Win (2) or Loss (1). Bonus: +1 if Avg > 6000
        let t1Points =
          (t1.steps > t2.steps ? 2 : 1) + (t1.dailyAvg > 6000 ? 1 : 0)
        let t2Points =
          (t2.steps > t1.steps ? 2 : 1) + (t2.dailyAvg > 6000 ? 1 : 0)

        // Handle Draw (Rare, but safety first)
        if (t1.steps === t2.steps) {
          t1Points = 1 + (t1.dailyAvg > 6000 ? 1 : 0)
          t2Points = 1 + (t2.dailyAvg > 6000 ? 1 : 0)
        }

        // 3. Record Matchup Results
        await tx.insert(matchupResults).values({
          matchupId: match.id,
          team1TotalSteps: t1.steps,
          team2TotalSteps: t2.steps,
          team1Points: t1Points,
          team2Points: t2Points,
          isFinalized: true,
        })

        // 4. Update Matchup Status
        await tx
          .update(matchups)
          .set({ status: 'completed' })
          .where(eq(matchups.id, match.id))

        // 5. Update Leaderboard for both teams
        const updateTeamLeaderboard = async (
          teamId: number,
          points: number,
          steps: number,
          won: boolean,
        ) => {
          const existing = await tx
            .select()
            .from(leaderboard)
            .where(
              and(
                eq(leaderboard.teamId, teamId),
                eq(leaderboard.challengeId, match.challengeId!),
              ),
            )
            .then((res) => res[0])

          if (existing) {
            await tx
              .update(leaderboard)
              .set({
                wins: won ? existing.wins! + 1 : existing.wins,
                losses: !won ? existing.losses! + 1 : existing.losses,
                totalPoints: existing.totalPoints! + points,
                cumulativeSteps: existing.cumulativeSteps! + steps,
                lastUpdated: new Date(),
              })
              .where(eq(leaderboard.id, existing.id))
          } else {
            await tx.insert(leaderboard).values({
              challengeId: match.challengeId,
              teamId: teamId,
              wins: won ? 1 : 0,
              losses: !won ? 1 : 0,
              totalPoints: points,
              cumulativeSteps: steps,
              lastUpdated: new Date(),
            })
          }
        }

        await updateTeamLeaderboard(
          match.team1Id!,
          t1Points,
          t1.steps,
          t1.steps > t2.steps,
        )
        await updateTeamLeaderboard(
          match.team2Id!,
          t2Points,
          t2.steps,
          t2.steps > t1.steps,
        )
      }

      return { success: true, message: `Week ${weekNumber} finalized.` }
    })
  })
