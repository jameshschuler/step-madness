import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { matchups, teams } from '@/db/schema'
import { eq, aliasedTable } from 'drizzle-orm'

export const getMatchups = createServerFn({ method: 'GET' }).handler(
  async () => {
    const team1 = aliasedTable(teams, 'team1')
    const team2 = aliasedTable(teams, 'team2')

    return await db
      .select({
        id: matchups.id,
        startDate: matchups.startDate,
        weekNumber: matchups.weekNumber,
        roundNumber: matchups.roundNumber,
        isPlayoff: matchups.isPlayoff,
        team1: {
          name: team1.name,
          avatar: team1.avatar,
        },
        team2: {
          name: team2.name,
          avatar: team2.avatar,
        },
      })
      .from(matchups)
      .leftJoin(team1, eq(matchups.team1Id, team1.id))
      .leftJoin(team2, eq(matchups.team2Id, team2.id))
      .orderBy(matchups.startDate)
  },
)
