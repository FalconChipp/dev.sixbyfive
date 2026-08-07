import Link from 'next/link'

export const metadata = {
  title: 'Games — SixByFive Studio',
  description: 'Browser games built by SixByFive. Daily puzzles and more.',
}

const games = [
  {
    href: '/games/songle',
    title: 'Songle',
    tag: 'Daily puzzle',
    status: 'Free',
    summary: 'Guess the song from its attributes.',
    description:
      'A new song every day. Search for your guess and see how the attributes compare — artist, year, genre, and album. Green means correct, amber means close. You have 8 guesses.',
    features: [
      'New puzzle every day',
      'Search across the full song library',
      'Attribute comparison with directional hints on year',
      'Shareable result grid',
      'Progress saved in your browser',
    ],
  },
]

export default function GamesPage() {
  return (
    <>
      <section style={{ padding: '72px 0 64px' }}>
        <div className="wrap">
          <Link
            href="/"
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
            ← SixByFive
          </Link>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 16 }}>Games</span>
          <h1
            className="display"
            style={{ fontSize: 'clamp(36px, 5vw, 58px)', color: 'var(--text)', maxWidth: 640, marginBottom: 20 }}
          >
            Daily puzzles
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 480, lineHeight: 1.65 }}>
            Browser games built for fun. New puzzles drop daily.
          </p>
        </div>
      </section>

      <div className="hr" />

      {games.map((g, i) => (
        <div key={g.href}>
          <section style={{ padding: '72px 0' }}>
            <div className="wrap">
              <div className="section-grid">
                <div style={{ paddingTop: 4 }}>
                  <span className="pill" style={{ display: 'inline-flex', marginBottom: 10 }}>{g.tag}</span>
                  <div>
                    <span className={`pill ${g.status === 'Free' ? 'pill-live' : ''}`} style={{ display: 'inline-flex' }}>
                      {g.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="display" style={{ fontSize: 'clamp(22px, 3vw, 32px)', color: 'var(--text)', marginBottom: 8 }}>
                    {g.title}
                  </h2>
                  <p style={{ fontSize: 15, fontStyle: 'italic', fontFamily: 'var(--font-display)', color: 'var(--accent-text)', marginBottom: 20 }}>
                    {g.summary}
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 560, marginBottom: 36 }}>
                    {g.description}
                  </p>

                  <div style={{ marginBottom: 36 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-4)', display: 'block', marginBottom: 16 }}>
                      How it works
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {g.features.map((f) => (
                        <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <span style={{ color: 'var(--accent)', fontSize: 14, lineHeight: '20px', flexShrink: 0 }}>—</span>
                          <span style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={g.href} className="btn btn-primary">Play today&apos;s puzzle →</Link>
                </div>
              </div>
            </div>
          </section>
          {i < games.length - 1 && <div className="hr" />}
        </div>
      ))}
    </>
  )
}
