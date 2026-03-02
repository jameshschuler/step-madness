import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { teams, teamPlayers, players } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const getTeamsWithPlayers = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Fetch teams and manually join players (or use Drizzle Relational API)
    const result = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        teamAvatar: teams.avatar,
        playerId: players.id,
        playerName: players.name,
        playerAvatar: players.avatar,
      })
      .from(teams)
      .leftJoin(teamPlayers, eq(teams.id, teamPlayers.teamId))
      .leftJoin(players, eq(teamPlayers.playerId, players.id))

    // Group the flat rows into a nested structure
    const groupedTeams = result.reduce(
      (acc, row) => {
        const { teamId, teamName, teamAvatar, ...player } = row
        if (!acc[teamId]) {
          acc[teamId] = {
            id: teamId,
            name: teamName,
            displayName: `Team ${teamName}`,
            avatar: teamAvatar,
            players: [],
          }
        }
        if (player.playerId) {
          acc[teamId].players.push({
            id: player.playerId,
            name: player.playerName,
            avatar: player.playerAvatar,
          })
        }
        return acc
      },
      {} as Record<number, any>,
    )

    return Object.values(groupedTeams)
  },
)
