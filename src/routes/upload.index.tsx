import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Upload, Loader2 } from 'lucide-react'
import Papa from 'papaparse'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { dailyPerformance, players } from '@/db/schema'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

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

export const Route = createFileRoute('/upload/')({
  component: UploadComponent,
})

function UploadComponent() {
  const [secret, setSecret] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

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
    <div className="p-4 bg-[#fdfcf0] min-h-screen flex flex-col items-center justify-center pb-24">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 shadow-sm ring-1 ring-emerald-100">
        {/* SECRET INPUT FIELD */}
        <div className="mb-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40 ml-4 mb-2 block">
            Admin Secret
          </label>
          <div className="relative">
            <input
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter upload key..."
              className="w-full bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl px-5 py-3 text-sm font-bold text-emerald-950 focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
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

            <div className="text-center">
              <span className="text-xs font-black text-emerald-900 uppercase">
                {!secret ? 'Enter Key Above' : 'Upload CSV'}
              </span>
            </div>
          </div>
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading || !secret}
          />
        </label>

        {status === 'error' && (
          <div className="mt-4 text-center">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
              {errorMessage}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 text-center">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
              ✓ Matchup Data Updated
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
