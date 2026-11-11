import Link from 'next/link'

export const metadata = {
  title: 'Games — SixByFive Studio',
  description: 'Games and game technology from SixByFive.',
}

const games = [
  {
    href: 'https://outgrowingwake.sixbyfive.com',
    title: 'Outgrowing Wake',
    tag: 'Strategy game',
    status: 'Wishlist on Steam',
    summary: 'Grow one world into a civilisation.',
    description:
      'Start on a single planet and expand to a system, a sector, and a galaxy that keeps going while you are away. Every return starts with a briefing of what actually happened.',
    features: [
      'Planet, system, sector and galaxy scales',
      'Your colonies keep producing while the game is closed',
      'Shipments take real time to cross space',
      'Research, fleets and diplomacy with other empires',
      'Single-player now, shared galaxy in development',
    ],
    cta: 'Visit Outgrowing Wake →',
    ctaHref: 'https://outgrowingwake.sixbyfive.com',
    secondary: { label: 'Wishlist on Steam ↗', href: 'https://store.steampowered.com/app/3298070' },
  },
  {
    href: '#universe-engine',
    title: 'Universe Engine',
    tag: 'Engine',
    status: 'In development',
    summary: 'The engine behind Outgrowing Wake.',
    description:
      'The simulation engine that runs the galaxy in Outgrowing Wake, built by SixByFive.',
    features: [],
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
            Games and engine
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-2)', maxWidth: 480, lineHeight: 1.65 }}>
            Outgrowing Wake, and the Universe Engine that powers it.
          </p>
        </div>
      </section>

      <div className="hr" />

      {games.map((g, i) => (
        <div key={g.title} id={g.href.startsWith('#') ? g.href.slice(1) : undefined}>
          <section style={{ padding: '72px 0' }}>
            <div className="wrap">
              <div className="section-grid">
                <div style={{ paddingTop: 4 }}>
                  <span className="pill" style={{ display: 'inline-flex', marginBottom: 10 }}>{g.tag}</span>
                  <div>
                    <span className={`pill ${g.ctaHref ? 'pill-live' : ''}`} style={{ display: 'inline-flex' }}>
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

                  {g.features.length > 0 && <div style={{ marginBottom: 36 }}>
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
                  </div>}

                  {g.ctaHref && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <a href={g.ctaHref} target="_blank" rel="noreferrer" className="btn btn-primary">{g.cta}</a>
                      <a href={g.secondary.href} target="_blank" rel="noreferrer" className="btn btn-secondary">{g.secondary.label}</a>
                    </div>
                  )}
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
