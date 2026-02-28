// import { db } from "./db"; // Your drizzle db instance
// import { teams, players, teamPlayers, challenges, matchups } from "./schema";

// async function seed() {
//   console.log("🌱 Seeding tournament data...");

//   // 1. Create the Challenge
//   const [challenge] = await db.insert(challenges).values({
//     name: "Spring Step Showdown 2026",
//     startDate: new Date("2026-03-01"),
//     endDate: new Date("2026-03-31"),
//     slug: "spring-2026",
//   }).returning();

//   // 2. Create Teams
//   const teamData = [
//     { name: "The Side-Steppers" },
//     { name: "Pavement Pounders" },
//     { name: "Sole Survivors" },
//     { name: "Blister Sisters" },
//   ];

//   const createdTeams = await db.insert(teams).values(teamData).returning();

//   // 3. Create Players & Assign to Teams
//   const playerData = [
//     { name: "Alice", teamIdx: 0 }, { name: "Bob", teamIdx: 0 },
//     { name: "Charlie", teamIdx: 1 }, { name: "David", teamIdx: 1 },
//     { name: "Eve", teamIdx: 2 }, { name: "Frank", teamIdx: 2 },
//     { name: "Grace", teamIdx: 3 }, { name: "Heidi", teamIdx: 3 },
//   ];

//   for (const p of playerData) {
//     const [player] = await db.insert(players).values({ name: p.name }).returning();
//     await db.insert(teamPlayers).values({
//       playerId: player.id,
//       teamId: createdTeams[p.teamIdx].id,
//     });
//   }

//   // 4. Create the Matchup Schedule
//   const schedule = [
//     // WEEK 1: March 1 - March 7
//     { week: 1, t1: 0, t2: 1, start: "2026-03-01", end: "2026-03-07" },
//     { week: 1, t1: 2, t2: 3, start: "2026-03-01", end: "2026-03-07" },

//     // WEEK 2: March 8 - March 14
//     { week: 2, t1: 0, t2: 2, start: "2026-03-08", end: "2026-03-14" },
//     { week: 2, t1: 1, t2: 3, start: "2026-03-08", end: "2026-03-14" },

//     // WEEK 3: March 15 - March 21
//     { week: 3, t1: 0, t2: 3, start: "2026-03-15", end: "2026-03-21" },
//     { week: 3, t1: 1, t2: 2, start: "2026-03-15", end: "2026-03-21" },
//   ];

//   for (const m of schedule) {
//     await db.insert(matchups).values({
//       challengeId: challenge.id,
//       team1Id: createdTeams[m.t1].id,
//       team2Id: createdTeams[m.t2].id,
//       startDate: m.start,
//       endDate: m.end,
//       weekNumber: m.week,
//       isPlayoff: false,
//     });
//   }

//   // 5. Create Week 4 Placeholders (Seeds TBD)
//   // Round 1 (March 22 - March 26)
//   await db.insert(matchups).values([
//     {
//       challengeId: challenge.id,
//       startDate: "2026-03-22",
//       endDate: "2026-03-26",
//       roundNumber: 1,
//       isPlayoff: true,
//       seed1: 1, // You'll update the teamId later based on leaderboard
//       seed2: 4,
//     },
//     {
//       challengeId: challenge.id,
//       startDate: "2026-03-22",
//       endDate: "2026-03-26",
//       roundNumber: 1,
//       isPlayoff: true,
//       seed1: 2,
//       seed2: 3,
//     }
//   ]);

//   console.log("✅ Seeding complete!");
// }

// seed().catch(console.error);
