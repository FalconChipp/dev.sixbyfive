'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createSupabaseClient } from '@/app/lib/supabase'

const MAX_GUESSES = 8

// ── Helpers ──────────────────────────────────────────────────────────────────

function attrStatus(guess, answer, field) {
  if (field === 'year') {
    const diff = Math.abs((guess.year ?? 0) - (answer.year ?? 0))
    if (diff === 0) return 'correct'
    if (diff <= 5) return 'close'
    return 'wrong'
  }
  if (field === 'uk_chart_peak' || field === 'us_chart_peak') {
    if (guess[field] == null || answer[field] == null) return guess[field] === answer[field] ? 'correct' : 'wrong'
    const diff = Math.abs(guess[field] - answer[field])
    if (diff === 0) return 'correct'
    if (diff <= 10) return 'close'
    return 'wrong'
  }
  if (field === 'weeks_on_chart') {
    if (guess[field] == null || answer[field] == null) return guess[field] === answer[field] ? 'correct' : 'wrong'
    const diff = Math.abs(guess[field] - answer[field])
    if (diff === 0) return 'correct'
    if (diff <= 5) return 'close'
    return 'wrong'
  }
  if (field === 'weeks_at_number_one') {
    if (guess[field] == null || answer[field] == null) return guess[field] === answer[field] ? 'correct' : 'wrong'
    const diff = Math.abs(guess[field] - answer[field])
    if (diff === 0) return 'correct'
    if (diff <= 2) return 'close'
    return 'wrong'
  }
  const g = (guess[field] ?? '').toLowerCase().trim()
  const a = (answer[field] ?? '').toLowerCase().trim()
  return g && a && g === a ? 'correct' : 'wrong'
}

function yearArrow(guessYear, answerYear) {
  if (!guessYear || !answerYear || guessYear === answerYear) return null
  return guessYear < answerYear ? 'up' : 'down'
}

function chartArrow(guessPeak, answerPeak) {
  if (guessPeak == null || answerPeak == null || guessPeak === answerPeak) return null
  return guessPeak > answerPeak ? 'up' : 'down'
}

const T = {
  correct: { bg: 'rgba(74,222,128,0.16)', border: 'rgba(74,222,128,0.35)', label: 'rgba(74,222,128,0.6)', value: '#4ade80' },
  close:   { bg: 'rgba(232,164,68,0.16)', border: 'rgba(232,164,68,0.35)', label: 'rgba(245,192,112,0.6)', value: '#f5c070' },
  wrong:   { bg: '#21212e',               border: 'rgba(255,255,255,0.06)', label: 'rgba(255,255,255,0.25)', value: 'rgba(255,255,255,0.75)' },
}

const EMOJI = { correct: '🟢', close: '🟡', wrong: '⬛' }
function shareText(guesses, answer, won, date) {
  const f1 = ['artist','year','genre','album','country_of_origin']
  const f2 = ['record_label','uk_chart_peak','us_chart_peak','weeks_on_chart','weeks_at_number_one']
  const rows = guesses.map(g => {
    const r1 = f1.map(f => EMOJI[attrStatus(g,answer,f)]).join('')
    const r2 = f2.map(f => EMOJI[attrStatus(g,answer,f)]).join('')
    return r1 + '\n' + r2
  })
  return [`Songle ${date}`, `${won ? guesses.length : 'X'}/${MAX_GUESSES} 🎵`, '', ...rows, '', 'dev.sixbyfive.com/games/songle'].join('\n')
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ArrowSvg({ direction, color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      {direction === 'up'
        ? <path d="M7 2L13 11H1L7 2Z" fill={color} />
        : <path d="M7 12L1 3H13L7 12Z" fill={color} />
      }
    </svg>
  )
}

function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().then(() => setPlaying(true)).catch(() => {})
    const onTime = () => setProgress(audio.currentTime / (audio.duration || 30))
    const onEnd  = () => { setPlaying(false); setProgress(0) }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd) }
  }, [src])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '10px 14px' }}>
      <audio ref={audioRef} src={src} />
      <button onClick={toggle} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-2)', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {playing
          ? <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="3" y="3" width="4" height="12" rx="1"/><rect x="11" y="3" width="4" height="12" rx="1"/></svg>
          : <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M5 3.5l10 5.5-10 5.5V3.5z"/></svg>
        }
      </button>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', cursor: 'pointer' }}
        onClick={e => {
          const audio = audioRef.current
          if (!audio) return
          const rect = e.currentTarget.getBoundingClientRect()
          audio.currentTime = ((e.clientX - rect.left) / rect.width) * (audio.duration || 30)
        }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: 'var(--text-3)', borderRadius: 99, transition: 'width 0.25s linear' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>30s preview</span>
    </div>
  )
}

function Calendar({ archive, today, selectedDate, onSelect, onClose }) {
  const allDates = new Set([today, ...archive.map(a => a.play_date)])
  const [statuses, setStatuses] = useState({})
  const [viewYear, setViewYear] = useState(() => new Date(today).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date(today).getMonth())
  const ref = useRef(null)

  useEffect(() => {
    const s = {}
    for (const date of allDates) {
      try {
        const saved = JSON.parse(localStorage.getItem(`songle-${date}`) || 'null')
        if (saved?.gameOver) s[date] = { won: saved.won, count: saved.guesses.length }
      } catch {}
    }
    setStatuses(s)
  }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    function onClickOutside(e) { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClickOutside) }
  }, [onClose])

  const firstOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startDow     = firstOfMonth.getDay()
  const monthLabel   = firstOfMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  const sortedDates = [...allDates].sort()
  const earliestDate = sortedDates[0]
  const latestDate   = sortedDates[sortedDates.length - 1]
  const [ey, em] = earliestDate.split('-').map(Number)
  const [ly, lm] = latestDate.split('-').map(Number)
  const canGoBack = viewYear > ey || (viewYear === ey && viewMonth > em - 1)
  const canGoFwd  = viewYear < ly  || (viewYear === ly  && viewMonth < lm - 1)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`)
  }

  return (
    <div ref={ref} style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
      background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
      borderRadius: 14, padding: 20, minWidth: 260,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      animation: 'fade-up 0.15s var(--ease) both',
    }}>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button onClick={prevMonth} disabled={!canGoBack} style={{ background: 'none', border: 'none', cursor: canGoBack ? 'pointer' : 'default', color: canGoBack ? 'var(--text-2)' : 'var(--text-4)', padding: '4px 8px', borderRadius: 6, fontSize: 14 }}>‹</button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)', letterSpacing: '0.06em' }}>{monthLabel.toUpperCase()}</span>
        <button onClick={nextMonth} disabled={!canGoFwd}  style={{ background: 'none', border: 'none', cursor: canGoFwd  ? 'pointer' : 'default', color: canGoFwd  ? 'var(--text-2)' : 'var(--text-4)', padding: '4px 8px', borderRadius: 6, fontSize: 14 }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)', padding: '2px 0' }}>{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
        {cells.map((dateStr, i) => {
          if (!dateStr) return <div key={i} />
          const hasGame  = allDates.has(dateStr)
          const isFuture = dateStr > today
          const isToday  = dateStr === today
          const isSel    = dateStr === selectedDate
          const status   = statuses[dateStr]
          const isWon    = status?.won
          const clickable = hasGame

          return (
            <button key={dateStr} onClick={() => clickable && onSelect(dateStr)} style={{
              aspectRatio: '1', borderRadius: 6, fontSize: 11, fontFamily: 'var(--font-mono)',
              border: isSel ? '1.5px solid var(--accent-text)' : isToday ? '1.5px solid var(--border-2)' : '1.5px solid transparent',
              background: isWon ? 'rgba(74,222,128,0.15)' : isSel ? 'var(--bg-hover)' : clickable ? 'var(--bg-subtle)' : 'transparent',
              color: !hasGame ? 'var(--text-4)' : isWon ? '#4ade80' : isFuture ? 'var(--accent-text)' : status ? 'var(--text-3)' : 'var(--text-2)',
              cursor: clickable ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.1s',
            }}>
              {new Date(dateStr + 'T12:00:00').getDate()}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
        {[
          { color: '#4ade80', label: 'Won' },
          { color: 'var(--text-3)', label: 'Played' },
          { color: 'var(--text-2)', label: 'Available' },
          { color: 'var(--accent-text)', label: 'Upcoming' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-4)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function GuessCard({ guess, answer, index }) {
  const st = {
    artist:              attrStatus(guess, answer, 'artist'),
    year:                attrStatus(guess, answer, 'year'),
    genre:               attrStatus(guess, answer, 'genre'),
    album:               attrStatus(guess, answer, 'album'),
    country_of_origin:   attrStatus(guess, answer, 'country_of_origin'),
    record_label:        attrStatus(guess, answer, 'record_label'),
    uk_chart_peak:       attrStatus(guess, answer, 'uk_chart_peak'),
    us_chart_peak:       attrStatus(guess, answer, 'us_chart_peak'),
    weeks_on_chart:      attrStatus(guess, answer, 'weeks_on_chart'),
    weeks_at_number_one: attrStatus(guess, answer, 'weeks_at_number_one'),
  }
  const correct = guess.id === answer.id
  const tiles = [
    { label: 'Artist',   value: guess.artist,            status: st.artist },
    { label: 'Year',     value: guess.year,              status: st.year,            suffix: st.year !== 'correct' ? yearArrow(guess.year, answer.year) : null },
    { label: 'Genre',    value: guess.genre,             status: st.genre },
    { label: 'Album',    value: guess.album,             status: st.album },
    { label: 'Country',  value: guess.country_of_origin, status: st.country_of_origin },
    { label: 'Label',    value: guess.record_label,      status: st.record_label },
    { label: 'UK Peak',  value: guess.uk_chart_peak  != null ? `#${guess.uk_chart_peak}`  : '—', status: st.uk_chart_peak,  suffix: st.uk_chart_peak  !== 'correct' ? chartArrow(guess.uk_chart_peak,  answer.uk_chart_peak)  : null },
    { label: 'US Peak',  value: guess.us_chart_peak  != null ? `#${guess.us_chart_peak}`  : '—', status: st.us_chart_peak,  suffix: st.us_chart_peak  !== 'correct' ? chartArrow(guess.us_chart_peak,  answer.us_chart_peak)  : null },
    { label: 'On Chart', value: guess.weeks_on_chart      != null ? guess.weeks_on_chart      : '—', status: st.weeks_on_chart,      suffix: st.weeks_on_chart      !== 'correct' ? yearArrow(guess.weeks_on_chart,      answer.weeks_on_chart)      : null },
    { label: 'Wks #1',   value: guess.weeks_at_number_one != null ? guess.weeks_at_number_one : '—', status: st.weeks_at_number_one, suffix: st.weeks_at_number_one !== 'correct' ? yearArrow(guess.weeks_at_number_one, answer.weeks_at_number_one) : null },
  ]

  return (
    <div style={{
      display: 'flex', background: 'var(--bg-raised)',
      border: `1px solid ${correct ? 'var(--green-border)' : 'var(--border)'}`,
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
      animation: 'fade-up 0.25s var(--ease) both',
    }}>
      <div style={{ width: 90, flexShrink: 0, alignSelf: 'stretch' }}>
        {guess.image_url
          ? <img src={guess.image_url} alt={guess.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 24 }}>♪</div>
        }
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderLeft: '1px solid var(--border)' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 7px', flexShrink: 0 }}>
            #{index + 1}
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {guess.title}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-4)', flexShrink: 0 }}>by {guess.artist}</span>
          {correct && <span className="pill pill-live" style={{ marginLeft: 'auto', flexShrink: 0 }}>✓ Correct</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', flex: 1 }}>
          {tiles.map((tile, i) => {
            const s = T[tile.status]
            return (
              <div key={tile.label} style={{
                background: s.bg,
                borderRight: (i % 5) < 4 ? '1px solid var(--border)' : 'none',
                borderBottom: i < 5 ? '1px solid var(--border)' : 'none',
                padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', color: s.label }}>
                  {tile.label}
                </span>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2 }}>
                  <span style={{ color: s.value, fontSize: 11, fontWeight: 600, lineHeight: 1.3, wordBreak: 'break-word', minWidth: 0 }}>
                    {tile.value ?? '—'}
                  </span>
                  {tile.suffix && <ArrowSvg direction={tile.suffix} color={s.value} />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SongleClient({ puzzle: initialPuzzle, songs, playDate: initialDate, archive = [] }) {
  const today = new Date().toISOString().split('T')[0]

  // Date / puzzle state
  const [selectedDate, setSelectedDate]   = useState(initialDate)
  const [activePuzzle, setActivePuzzle]   = useState(initialPuzzle)
  const [loadingDate, setLoadingDate]     = useState(false)
  const [showCalendar, setShowCalendar]   = useState(false)
  const calendarAnchorRef = useRef(null)

  const isArchive = selectedDate !== today
  const key = `songle-${selectedDate}`

  // Game state
  const [guesses, setGuesses]         = useState([])
  const [gameOver, setGameOver]       = useState(false)
  const [won, setWon]                 = useState(false)
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showDrop, setShowDrop]       = useState(false)
  const [activeIdx, setActiveIdx]     = useState(-1)
  const [copied, setCopied]           = useState(false)
  const inputRef = useRef(null)

  // Load saved game when puzzle changes
  useEffect(() => {
    if (!activePuzzle) { setGuesses([]); setGameOver(false); setWon(false); return }
    try {
      const s = JSON.parse(localStorage.getItem(key) || 'null')
      if (s?.puzzle === activePuzzle.id) {
        const enriched = s.guesses.map(g => {
          const match = songs.find(song => song.id === g.id)
          return match ? { ...g, image_url: match.image_url } : g
        })
        setGuesses(enriched); setGameOver(s.gameOver); setWon(s.won)
      } else {
        setGuesses([]); setGameOver(false); setWon(false)
      }
    } catch { setGuesses([]); setGameOver(false); setWon(false) }
  }, [key, activePuzzle?.id])

  // Autocomplete filter
  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (!q) { setSuggestions([]); setShowDrop(false); return }
    const ids = new Set(guesses.map(g => g.id))
    const res = songs.filter(s => !ids.has(s.id)).filter(s =>
      s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    ).slice(0, 6)
    setSuggestions(res); setShowDrop(res.length > 0); setActiveIdx(-1)
  }, [query, guesses, songs])

  async function selectDate(date) {
    setShowCalendar(false)
    if (date === selectedDate) return
    setQuery(''); setSuggestions([]); setShowDrop(false)
    setSelectedDate(date)
    if (date === initialDate) { setActivePuzzle(initialPuzzle); return }
    setLoadingDate(true)
    const supabase = createSupabaseClient()
    const { data } = await supabase.from('daily_puzzle').select('song:songs(*)').eq('play_date', date).single()
    setActivePuzzle(data?.song ?? null)
    setLoadingDate(false)
  }

  function submit(song) {
    const next = [...guesses, song]
    const win  = song.id === activePuzzle.id
    const over = win || next.length >= MAX_GUESSES
    setGuesses(next); setGameOver(over); setWon(win)
    setQuery(''); setSuggestions([]); setShowDrop(false)
    try { localStorage.setItem(key, JSON.stringify({ puzzle: activePuzzle.id, guesses: next, gameOver: over, won: win })) } catch {}
  }

  function giveUp() {
    setGameOver(true); setWon(false)
    try { localStorage.setItem(key, JSON.stringify({ puzzle: activePuzzle.id, guesses, gameOver: true, won: false })) } catch {}
  }

  function handleKey(e) {
    if (!showDrop) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i+1, suggestions.length-1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i-1, 0)) }
    if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); submit(suggestions[activeIdx]) }
    if (e.key === 'Escape') setShowDrop(false)
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(shareText(guesses, activePuzzle, won, selectedDate))
      setCopied(true); setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  const guessNum = Math.min(guesses.length + (gameOver ? 0 : 1), MAX_GUESSES)
  const displayDate = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>

      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <Link href="/games" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', textDecoration: 'none', letterSpacing: '0.08em', display: 'block', marginBottom: 16 }}>
          ← Games
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h1 className="display" style={{ fontSize: 'clamp(48px, 8vw, 72px)', fontStyle: 'italic', color: 'var(--text)', lineHeight: 0.9, marginBottom: 10 }}>
              Songle
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: isArchive ? 'var(--accent-text)' : 'var(--text-4)', letterSpacing: '0.1em' }}>
                {displayDate}
              </span>
              {isArchive && (
                <button onClick={() => selectDate(today)} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', letterSpacing: '0.08em' }}>
                  ← Today
                </button>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, paddingBottom: 4 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-3)' }}>
              <span style={{ color: 'var(--accent-text)', fontWeight: 700, fontSize: 18 }}>{guessNum}</span>
              <span style={{ color: 'var(--text-4)' }}> / {MAX_GUESSES}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, position: 'relative' }} ref={calendarAnchorRef}>
              {!gameOver && guesses.length > 0 && (
                <button onClick={giveUp} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-4)', background: 'none',
                  border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer',
                  padding: '4px 10px', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.borderColor='var(--border-2)' }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-4)'; e.currentTarget.style.borderColor='var(--border)' }}>
                  Give up
                </button>
              )}
              {archive.length > 0 && (
                <button onClick={() => setShowCalendar(c => !c)} style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: showCalendar ? 'var(--text)' : 'var(--text-4)',
                  background: showCalendar ? 'var(--bg-subtle)' : 'none',
                  border: '1px solid var(--border)', borderRadius: 5, cursor: 'pointer',
                  padding: '4px 10px', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='var(--text-2)'; e.currentTarget.style.borderColor='var(--border-2)' }}
                onMouseLeave={e => { e.currentTarget.style.color= showCalendar ? 'var(--text)' : 'var(--text-4)'; e.currentTarget.style.borderColor='var(--border)' }}>
                  All dates
                </button>
              )}
              {showCalendar && (
                <Calendar
                  archive={archive}
                  today={today}
                  selectedDate={selectedDate}
                  onSelect={selectDate}
                  onClose={() => setShowCalendar(false)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Correct', bg: T.correct.bg, border: T.correct.border },
          { label: 'Close',   bg: T.close.bg,   border: T.close.border },
          { label: 'Wrong',   bg: T.wrong.bg,   border: T.wrong.border },
        ].map(({ label, bg, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: bg, border: `1.5px solid ${border}`, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Loading state ── */}
      {loadingDate && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Loading…
          </span>
        </div>
      )}

      {!loadingDate && activePuzzle && (<>

        {/* ── Search ── */}
        {!gameOver && (
          <div style={{ position: 'relative', marginBottom: 32 }}>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKey}
              onFocus={e => { e.target.style.borderColor = 'var(--border-3)'; if (suggestions.length) setShowDrop(true) }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-2)'; setTimeout(() => setShowDrop(false), 150) }}
              placeholder="Search a song or artist…"
              autoComplete="off"
              style={{
                width: '100%', background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
                borderRadius: 10, padding: '16px 48px 16px 20px', fontSize: 16,
                color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-sans)', transition: 'border-color 0.15s',
              }}
            />
            <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)', fontSize: 18, pointerEvents: 'none' }}>♪</span>
            {showDrop && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 50,
                background: 'var(--bg-raised)', border: '1px solid var(--border-2)',
                borderRadius: 10, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}>
                {suggestions.map((s, i) => (
                  <button key={s.id} onMouseDown={() => submit(s)} onMouseEnter={() => setActiveIdx(i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px',
                      background: i === activeIdx ? 'var(--bg-hover)' : 'transparent',
                      border: 'none', borderBottom: i < suggestions.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
                    }}>
                    {s.image_url && <img src={s.image_url} alt={s.title} width={32} height={32} style={{ borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />}
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{s.title}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-4)' }}>{s.artist}</span>
                    {s.year && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)' }}>{s.year}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Game over ── */}
        {gameOver && (
          <div style={{
            background: won ? 'var(--green-dim)' : 'var(--bg-raised)',
            border: `1px solid ${won ? 'var(--green-border)' : 'var(--border)'}`,
            borderRadius: 10, overflow: 'hidden', marginBottom: 32,
            animation: 'fade-up 0.3s var(--ease) both',
          }}>
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)' }}>
              <p style={{ fontSize: 22, fontWeight: 700, fontStyle: 'italic', fontFamily: 'var(--font-display)', color: won ? 'var(--green)' : 'var(--text)', marginBottom: 4 }}>
                {won ? `Got it in ${guesses.length}` : 'Better luck tomorrow'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
                {won ? `"${activePuzzle.title}" by ${activePuzzle.artist}` : `It was "${activePuzzle.title}" by ${activePuzzle.artist}`}
              </p>
            </div>
            {activePuzzle.preview_url && (
              <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border)' }}>
                <AudioPlayer src={activePuzzle.preview_url} />
              </div>
            )}
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={share} className="btn btn-primary" style={{ flexShrink: 0 }}>
                {copied ? '✓ Copied' : 'Share result'}
              </button>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                {[
                  { label: 'YouTube',     href: `https://www.youtube.com/results?search_query=${encodeURIComponent(activePuzzle.title + ' ' + activePuzzle.artist)}` },
                  { label: 'Spotify',     href: `https://open.spotify.com/search/${encodeURIComponent(activePuzzle.title + ' ' + activePuzzle.artist)}` },
                  { label: 'Apple Music', href: activePuzzle.apple_music_url },
                ].filter(l => l.href).map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)',
                    textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 6,
                    padding: '6px 12px', transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color='var(--text)'; e.currentTarget.style.borderColor='var(--border-2)' }}
                  onMouseLeave={e => { e.currentTarget.style.color='var(--text-3)'; e.currentTarget.style.borderColor='var(--border)' }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Guesses ── */}
        {guesses.length === 0 && !gameOver && (
          <div style={{ padding: '48px 0', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Start guessing above
            </span>
          </div>
        )}

        {won ? (
          <>
            <GuessCard guess={guesses[guesses.length - 1]} answer={activePuzzle} index={guesses.length - 1} />
            {guesses.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                <span style={{ fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>previous guesses</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              </div>
            )}
            {guesses.slice(0, -1).map((g, i) => <GuessCard key={g.id + i} guess={g} answer={activePuzzle} index={i} />)}
          </>
        ) : (
          guesses.map((g, i) => <GuessCard key={g.id + i} guess={g} answer={activePuzzle} index={i} />)
        )}

        {/* ── Progress ── */}
        {!gameOver && guesses.length > 0 && (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', padding: '20px 0 8px' }}>
            {Array.from({ length: MAX_GUESSES }).map((_, i) => (
              <div key={i} style={{
                width: i < guesses.length ? 8 : 5, height: i < guesses.length ? 8 : 5,
                borderRadius: '50%', background: i < guesses.length ? 'var(--text-3)' : 'var(--border)',
                transition: 'all 0.2s ease',
              }} />
            ))}
          </div>
        )}

      </>)}

    </div>
  )
}
