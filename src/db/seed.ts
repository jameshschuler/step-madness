import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import { config } from 'dotenv'

config({ path: ['.env.local', '.env'] })

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client)

async function main() {
  console.log('⏳ Seeding database...')

  // 1. Clean up (Optional - be careful in production!)
  await db.delete(schema.matchupResults)
  await db.delete(schema.matchups)
  await db.delete(schema.teamPlayers)
  await db.delete(schema.players)
  await db.delete(schema.teams)
  await db.delete(schema.challenges)

  // 2. Create a Challenge
  const [challenge] = await db
    .insert(schema.challenges)
    .values({
      name: 'Spring Step Challenge 2026',
      slug: 'spring-2026',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
    })
    .returning()

  // 3. Create Teams
  const teamData = [
    {
      name: 'Fish',
      avatar: 'Fish',
    },
    {
      name: 'Shrimp',
      avatar: 'Shrimp',
    },
    {
      name: 'Snail',
      avatar: 'Snail',
    },
    {
      name: 'Worm',
      avatar: 'Worm',
    },
  ]
  const insertedTeams = await db
    .insert(schema.teams)
    .values(teamData)
    .returning()

  // 4. Create Players and assign to teams
  const playersToCreate = [
    {
      name: 'Alice',
    },
  ]

  const insertedPlayers = await db
    .insert(schema.players)
    .values(playersToCreate)
    .returning()

  const teamMap = new Map(insertedTeams.map((team) => [team.name, team.id]))

  const playerMap = new Map([['Alice', 'Fish']])

  // Link players to team in junction table
  const junctionData = insertedPlayers.map((player) => {
    const teamName = playerMap.get(player.name)!
    const teamId = teamMap.get(teamName)!
    return {
      playerId: player.id,
      teamId: teamId,
    }
  })
  await db.insert(schema.teamPlayers).values(junctionData)

  // 5. Create a Matchup between Team 1 and Team 2
  await db.insert(schema.matchups).values([
    // Week 1 Matchups
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[0].id,
      team2Id: insertedTeams[3].id,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-07'),
      weekNumber: 1,
      isPlayoff: false,
    },
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[1].id,
      team2Id: insertedTeams[2].id,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-07'),
      weekNumber: 1,
      isPlayoff: false,
    },
    // Week 2 Matchups
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[0].id,
      team2Id: insertedTeams[2].id,
      startDate: new Date('2026-03-08'),
      endDate: new Date('2026-03-14'),
      weekNumber: 2,
      isPlayoff: false,
    },
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[1].id,
      team2Id: insertedTeams[3].id,
      startDate: new Date('2026-03-08'),
      endDate: new Date('2026-03-14'),
      weekNumber: 2,
      isPlayoff: false,
    },
    // Week 3 Matchups
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[0].id,
      team2Id: insertedTeams[1].id,
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-03-21'),
      weekNumber: 3,
      isPlayoff: false,
    },
    {
      challengeId: challenge.id,
      team1Id: insertedTeams[2].id,
      team2Id: insertedTeams[3].id,
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-03-21'),
      weekNumber: 3,
      isPlayoff: false,
    },
    // Playoff Matchups (Assuming top 2 teams advance, seeding based on week performance)
    // Round 1 - Semi-finals
    {
      challengeId: challenge.id,
      // team1Id: TBD
      // team2Id: TBD
      seed1: 1, // Placeholder - to be updated after week 3 results
      seed2: 4, // Placeholder - to be updated after week 3 results
      startDate: new Date('2026-03-22'),
      endDate: new Date('2026-03-26'),
      weekNumber: 4,
      roundNumber: 1,
      isPlayoff: true,
    },
    {
      challengeId: challenge.id,
      // team1Id: TBD
      // team2Id: TBD
      seed1: 2, // Placeholder - to be updated after week 3 results
      seed2: 3, // Placeholder - to be updated after week 3 results
      startDate: new Date('2026-03-22'),
      endDate: new Date('2026-03-26'),
      weekNumber: 4,
      roundNumber: 1,
      isPlayoff: true,
    },
    // Round 2 - Finals
    {
      challengeId: challenge.id,
      // team1Id: TBD (Winner of Semi-final 1)
      // team2Id: TBD (Winner of Semi-final 2)
      // seed1: 1, // Placeholder - to be updated after semi-finals
      // seed2: 2, // Placeholder - to be updated after semi-finals
      startDate: new Date('2026-03-27'),
      endDate: new Date('2026-03-31'),
      weekNumber: 4,
      roundNumber: 2,
      isPlayoff: true,
    },
    // Third Place Match (Optional)
    {
      challengeId: challenge.id,
      // team1Id: TBD (Loser of Semi-final 1)
      // team2Id: TBD (Loser of Semi-final 2)
      // seed1: 3, // Placeholder - to be updated after semi-finals
      // seed2: 4, // Placeholder - to be updated after semi-finals
      startDate: new Date('2026-03-27'),
      endDate: new Date('2026-03-31'),
      weekNumber: 4,
      roundNumber: 2,
      isPlayoff: true,
    },
  ])

  console.log('✅ Seeding complete!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed')
  console.error(err)
  process.exit(1)
})
