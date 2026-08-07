import { createSupabaseClient } from '@/app/lib/supabase'
import SongleClient from './SongleClient'
import Link from 'next/link'

export const metadata = {
  title: 'Songle — SixByFive Studio',
  description: 'Guess the song from its attributes. A new puzzle every day.',
}

export const dynamic = 'force-dynamic'

async function getPuzzleData(playDate) {
  try {
    const supabase = createSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    const [puzzleRes, songsRes, archiveRes] = await Promise.all([
      supabase
        .from('daily_puzzle')
        .select('song:songs(*)')
        .eq('play_date', playDate)
        .single(),
      supabase
        .from('songs')
        .select('id, title, artist, album, genre, year, image_url, country_of_origin, record_label, uk_chart_peak, us_chart_peak, weeks_on_chart, weeks_at_number_one')
        .order('title'),
      supabase
        .from('daily_puzzle')
        .select('play_date')
        .neq('play_date', today)
        .order('play_date', { ascending: false })
        .limit(200),
    ])

    return {
      puzzle: puzzleRes.data?.song ?? null,
      songs: songsRes.data ?? [],
      archive: archiveRes.data ?? [],
    }
  } catch (err) {
    console.error('[songle] caught error:', err)
    return { puzzle: null, songs: [], archive: [] }
  }
}

export default async function SonglePage({ searchParams }) {
  const params = await searchParams
  const today = new Date().toISOString().split('T')[0]
  const playDate = params.date ?? today

  const { puzzle, songs, archive } = await getPuzzleData(playDate)

  if (!puzzle) {
    return (
      <section style={{ padding: '96px 0' }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          <Link
            href="/games"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-4)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: 40,
            }}
          >
            ← Games
          </Link>
          <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: 'var(--text)', marginBottom: 16 }}>
            Songle
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 15 }}>
            No puzzle scheduled for {playDate === today ? 'today' : playDate}. Check back soon.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section style={{ padding: '64px 0 96px' }}>
      <div className="wrap">
        <SongleClient puzzle={puzzle} songs={songs} playDate={playDate} archive={archive} />
      </div>
    </section>
  )
}
