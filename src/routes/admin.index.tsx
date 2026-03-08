import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Upload, Loader2, CheckCircle2, Zap } from 'lucide-react'
import Papa from 'papaparse'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { challenges, dailyPerformance, players } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { finalizeWeek } from '@/services/admin'
import { useMutation } from '@tanstack/react-query'

// Server function to process the parsed data
const uploadStepData = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      secret: z.string(),
      data: z.array(z.any()),
    }),
  )
  .handler(async ({ data: { secret, data } }) => {
    if (secret !== process.env.CSV_UPLOAD_SECRET) {
      throw new Error('Unauthorized: Invalid Secret Key')
    }

    await db.transaction(async (tx) => {
      await tx
        .update(challenges)
        .set({ lastSynced: new Date() })
        .where(eq(challenges.slug, 'spring-2026'))

      for (const row of data) {
        // 1. Get the Player
        // We use the name as a unique identifier for this simplified tournament
        const existingPlayer = await tx
          .select()
          .from(players)
          .where(eq(players.name, row.name))
          .get()

        if (!existingPlayer) {
          // Don't create a missing player
          console.log(`Player not found for name: ${row.name}, skipping...`)
          continue
        }

        const dailyEntries = Object.entries(row.dailySteps)

        for (const [dateString, stepCount] of dailyEntries) {
          await tx
            .insert(dailyPerformance)
            .values({
              playerId: existingPlayer.id,
              date: dateString,
              stepCount: stepCount as number,
            })
            .onConflictDoUpdate({
              target: [dailyPerformance.playerId, dailyPerformance.date],
              set: { stepCount: stepCount as number },
            })
        }
      }
    })

    return { success: true, count: data.length }
  })

export const Route = createFileRoute('/admin/')({
  component: UploadComponent,
})

function UploadComponent() {
  const [secret, setSecret] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [week, setWeek] = useState(1)

  const {
    mutate: handleFinalize,
    isPending,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (data: { weekNumber: number; secret: string }) =>
      finalizeWeek({ data }),
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !secret) {
      if (!secret) setErrorMessage('Please enter the secret key first')
      return
    }

    setIsUploading(true)
    setStatus('idle')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const processedData = results.data.map((row: any) => {
            const name = row['Name']
            const dailySteps: Record<string, number> = {}
            Object.keys(row).forEach((key) => {
              if (/\d{4}-\d{2}-\d{2}/.test(key) && row[key] !== 'N.A') {
                dailySteps[key] = parseInt(row[key], 10) || 0
              }
            })
            return { name, dailySteps }
          })

          // Send both the secret and the data to the server
          await uploadStepData({ data: { secret, data: processedData } })
          setStatus('success')
        } catch (err: any) {
          setStatus('error')
          setErrorMessage(
            err.message.includes('Unauthorized')
              ? 'Invalid Secret Key'
              : 'Failed to process CSV',
          )
        } finally {
          setIsUploading(false)
        }
      },
    })
  }

  return (
    <div className="p-6 bg-[#fdfcf0] min-h-screen flex flex-col gap-6 items-center justify-start pt-12 pb-24 font-sans">
      {/* SHARED SECRET INPUT */}
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-sm ring-1 ring-emerald-100">
        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40 ml-4 mb-2 block">
          Admin Secret Key
        </label>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="••••••••"
          className="w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl px-5 py-3 text-sm font-bold text-emerald-950 focus:outline-none focus:border-emerald-400 transition-colors"
        />
      </div>

      {/* FINALIZE WEEK CARD */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
            <Zap size={20} fill="currentColor" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight text-emerald-950">
            Finalize Standings
          </h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40 ml-4 mb-2 block">
              Week No.
            </label>
            <input
              type="number"
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-emerald-950 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
          <button
            onClick={() => handleFinalize({ weekNumber: week, secret })}
            disabled={isPending || !secret}
            className="flex-[2] self-end h-[52px] bg-emerald-950 hover:bg-emerald-800 disabled:bg-emerald-900/20 text-emerald-50 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Finalize Now'
            )}
          </button>
        </div>

        {isSuccess && (
          <p className="mt-4 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <CheckCircle2 size={12} /> Week {week} Results Published
          </p>
        )}
        {error && (
          <p className="mt-4 text-center text-[10px] font-black text-rose-500 uppercase tracking-widest">
            {error.message}
          </p>
        )}
      </div>

      {/* UPLOAD CARD */}
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-emerald-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
            <Upload size={20} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-tight text-emerald-950">
            Step Data Sync
          </h2>
        </div>

        <label
          className={`relative group cursor-pointer ${!secret && 'opacity-50 grayscale'}`}
        >
          <div
            className={`
            border-2 border-dashed rounded-[2rem] p-10 transition-all
            flex flex-col items-center justify-center gap-3
            ${isUploading ? 'border-emerald-200 bg-emerald-50/30' : 'border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50'}
          `}
          >
            {isUploading ? (
              <Loader2 className="animate-spin text-emerald-500" size={40} />
            ) : (
              <Upload
                className="text-emerald-300 group-hover:text-emerald-500"
                size={40}
              />
            )}
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">
              {!secret ? 'Enter Key Above' : 'Drop CSV Here'}
            </span>
          </div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading || !secret}
          />
        </label>

        {status === 'success' && (
          <div className="mt-4 text-center">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-1">
              <CheckCircle2 size={12} /> Sync Complete
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
