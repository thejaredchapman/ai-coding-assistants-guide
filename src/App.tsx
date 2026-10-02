import { useEffect, useState } from 'react'
import { needs, sections, splash, toolFit, type Block, type Section as SectionT } from './content'

const pad = (n: number) => String(n).padStart(2, '0')
const slug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center px-3 py-1.5 border-b border-line text-xs text-muted">
        <span>snippet</span>
        <button
          onClick={copy}
          className="ml-auto hover:text-accent focus-visible:text-accent focus-visible:outline-none"
        >
          [{copied ? 'copied' : 'copy'}]
        </button>
      </div>
      <pre className="p-4 text-sm text-fg overflow-x-auto whitespace-pre leading-relaxed">
        {code.split('\n').map((line, i) => (
          <div key={i} className="flex">
            <span className="w-7 shrink-0 select-none text-muted/60 text-right pr-3 text-xs leading-relaxed pt-px">{i + 1}</span>
            <span>{line || ' '}</span>
          </div>
        ))}
      </pre>
    </div>
  )
}

function Table({ rows, cols }: { rows: string[][]; cols?: string[] }) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className={`w-full text-sm border-collapse ${(cols?.length ?? rows[0]?.length ?? 0) > 2 ? 'min-w-[34rem]' : ''}`}>
        {cols && (
          <thead>
            <tr className="bg-panel border-b border-line text-left text-xs uppercase tracking-wider text-muted">
              {cols.map((c, i) => (
                <th key={i} className="py-2 px-3 font-bold">{c}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, j) => (
            <tr key={j} className="border-b border-line last:border-0 align-top">
              {row.map((cell, k) => (
                <td key={k} className={`py-2 px-3 ${k === 0 ? 'text-key font-bold whitespace-nowrap' : 'text-fg'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((b, j) => (
        <li key={j} className="flex gap-3 leading-relaxed">
          <span className="text-accent select-none">&gt;</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

function Note({ children }: { children: string }) {
  return <p className="text-sm text-ok leading-relaxed">// {children}</p>
}

function Warn({ children }: { children: string }) {
  return (
    <div className="border border-warn/60 bg-warn/10 p-4 text-sm leading-relaxed">
      <p className="text-warn font-bold mb-1">[!] RISK</p>
      <p>{children}</p>
    </div>
  )
}

function Picker({ go }: { go: (id: string) => void }) {
  const [picked, setPicked] = useState<string[]>([])
  const toggle = (id: string) =>
    setPicked(p => (p.includes(id) ? p.filter(x => x !== id) : [...p, id]))
  const ranked = toolFit
    .map(t => ({ ...t, hits: t.needs.filter(n => picked.includes(n)) }))
    .sort((a, b) => b.hits.length - a.hits.length || a.name.localeCompare(b.name))
  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2">
        {needs.map(n => {
          const on = picked.includes(n.id)
          return (
            <label
              key={n.id}
              className={`flex items-start gap-3 border p-3 cursor-pointer text-sm transition-colors ${
                on ? 'border-accent bg-accent/10' : 'border-line hover:border-muted'
              }`}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(n.id)} className="mt-0.5 accent-[rgb(var(--accent))]" />
              <span>{n.label}</span>
            </label>
          )
        })}
      </div>
      <div className="border border-line bg-panel/70">
        <p className="px-4 py-2 border-b border-line text-xs uppercase tracking-wider text-muted">
          {picked.length ? `best fits for ${picked.length} need${picked.length > 1 ? 's' : ''}` : 'tick a need to see matches'}
        </p>
        <ol>
          {ranked.map((t, i) => (
            <li key={t.id} className={`px-4 py-3 border-b border-line last:border-0 ${picked.length && !t.hits.length ? 'opacity-40' : ''}`}>
              <div className="flex items-baseline gap-3">
                <span className="text-muted text-xs w-5">{i + 1}.</span>
                <button onClick={() => go(t.id)} className="font-bold text-key hover:underline text-left">{t.name}</button>
                <span className="ml-auto text-sm text-muted">{t.hits.length}/{picked.length || '-'}</span>
              </div>
              {picked.length > 0 && (
                <div className="mt-2 ml-8">
                  <div className="h-1.5 bg-line"><div className="h-full bg-accent" style={{ width: `${(t.hits.length / picked.length) * 100}%` }} /></div>
                  <p className="mt-1.5 text-xs text-muted">
                    {t.hits.length ? 'matches: ' + t.hits.map(h => needs.find(n => n.id === h)!.label).join(' / ') : 'no matches'}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function BlockView({ block, i, go }: { block: Block; i: number; go: (id: string) => void }) {
  return (
    <div id={slug(block.heading)} className="rise space-y-3" style={{ animationDelay: `${i * 50}ms` }}>
      <h3 className="text-lg font-bold">
        <span className="text-accent select-none">## </span>
        {block.heading}
      </h3>
      {block.text && <p className="leading-relaxed">{block.text}</p>}
      {block.picker && <Picker go={go} />}
      {block.bullets && <Bullets items={block.bullets} />}
      {block.table && <Table rows={block.table} cols={block.cols} />}
      {block.code && <CodeBlock code={block.code} />}
      {(block.pros || block.cons) && (
        <div className="grid gap-3 md:grid-cols-2">
          {block.pros && (
            <div className="border border-ok/50 bg-ok/5 p-4">
              <p className="text-ok font-bold text-sm mb-2">+ PROS</p>
              <ul className="space-y-1.5 text-sm">
                {block.pros.map((p, i) => <li key={i} className="flex gap-2"><span className="text-ok select-none">+</span><span>{p}</span></li>)}
              </ul>
            </div>
          )}
          {block.cons && (
            <div className="border border-warn/50 bg-warn/5 p-4">
              <p className="text-warn font-bold text-sm mb-2">- CONS</p>
              <ul className="space-y-1.5 text-sm">
                {block.cons.map((p, i) => <li key={i} className="flex gap-2"><span className="text-warn select-none">-</span><span>{p}</span></li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      {block.warn && <Warn>{block.warn}</Warn>}
      {block.note && <Note>{block.note}</Note>}
    </div>
  )
}

function SectionView({ section, go }: { section: SectionT; go: (id: string) => void }) {
  return (
    <div className="space-y-10">
      {section.content.map((block, i) => (
        <BlockView key={i} block={block} i={i} go={go} />
      ))}
    </div>
  )
}

function Splash({ onEnter }: { onEnter: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Enter' && onEnter()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onEnter])

  const card = 'border border-line bg-panel/70 p-5 space-y-3'
  const label = 'text-xs uppercase tracking-[0.2em] text-muted'

  return (
    <div className="min-h-screen px-5 py-10 md:px-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm text-muted">
          <span className="text-ok">~/ai-coding-assistants</span> <span className="text-accent">$</span> cat welcome.md
        </p>
        <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-[0.95] tracking-tight">
          ai<span className="text-accent">-</span>coding
          <br />
          assistants<span className="cursor text-accent">_</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed">{splash.tagline}</p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <section className={card}>
            <p className={label}>01 // concept</p>
            <h2 className="text-xl font-bold">{splash.what.title}</h2>
            <p className="leading-relaxed text-sm">{splash.what.text}</p>
          </section>
          <section className={card}>
            <p className={label}>02 // reality</p>
            <h2 className="text-xl font-bold">{splash.meaning.title}</h2>
            <div className="text-sm"><Bullets items={splash.meaning.bullets} /></div>
          </section>
          <section className={`${card} md:col-span-2`}>
            <p className={label}>03 // landscape</p>
            <h2 className="text-xl font-bold">{splash.competitors.title}</h2>
            <Table rows={splash.competitors.rows} cols={splash.competitors.cols} />
          </section>
          <section className={`${card} md:col-span-2 border-accent/60`}>
            <p className={label}>04 // choosing</p>
            <h2 className="text-xl font-bold">{splash.why.title}</h2>
            <div className="text-sm"><Bullets items={splash.why.bullets} /></div>
            <Note>{splash.why.note}</Note>
          </section>
          <section className={`${card} md:col-span-2 !border-hot border-2 bg-hot/5`}>
            <p className="text-xs uppercase tracking-[0.2em] text-hot font-bold">05 // disclaimer</p>
            <h2 className="text-xl font-bold">{splash.disclaimer.title}</h2>
            <p className="text-sm leading-relaxed">{splash.disclaimer.text}</p>
          </section>
        </div>

        <button
          onClick={onEnter}
          className="mt-10 border border-accent bg-accent text-bg font-bold px-6 py-3 hover:bg-transparent hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ./start-guide.sh
        </button>
        <span className="ml-4 text-sm font-bold text-hot">or press <kbd className="border border-hot px-1.5 py-0.5 mx-0.5">Enter</kbd></span>
      </div>
    </div>
  )
}

const fromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '')
  return sections.some(s => s.id === id) ? id : null
}

export default function App() {
  const [active, setActive] = useState(fromHash() ?? sections[0].id)
  const [entered, setEntered] = useState(fromHash() !== null)

  useEffect(() => {
    const sync = () => {
      const id = fromHash()
      if (id) { setActive(id); setEntered(true) } else setEntered(false)
    }
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    const target = entered ? `#/${active}` : ''
    if (window.location.hash !== target) {
      history.pushState(null, '', target || window.location.pathname)
    }
  }, [entered, active])

  useEffect(() => {
    const s = sections.find(x => x.id === active)
    document.title = entered && s ? `${s.title} | AI Coding Assistants` : 'AI Coding Assistants Field Guide'
  }, [entered, active])

  if (!entered) return <Splash onEnter={() => setEntered(true)} />

  const idx = sections.findIndex(s => s.id === active)
  const current = sections[idx]
  const go = (id: string) => {
    setActive(id)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="min-h-screen md:flex pb-10">
      <a href="#main" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus() }} className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-accent focus:text-bg focus:px-3 focus:py-2 font-bold">
        Skip to content
      </a>
      <aside className="md:w-80 shrink-0 md:border-r border-b md:border-b-0 border-line bg-bg/80 backdrop-blur p-5 md:sticky md:top-0 md:h-screen md:overflow-y-auto">
        <button onClick={() => setEntered(false)} className="text-left mb-4 md:mb-8 group focus-visible:outline-none">
          <p className="text-xs text-muted group-hover:text-accent">&larr; welcome.md</p>
          <h1 className="text-2xl font-bold mt-2 leading-none">
            ai<span className="text-accent">-</span>coding
          </h1>
          <p className="text-muted text-sm mt-1">assistants field guide</p>
        </button>
        <nav className="flex md:block gap-1 overflow-x-auto" aria-label="Sections">
          {sections.map((s, n) => {
            const on = active === s.id
            const last = n === sections.length - 1 || sections[n + 1].group !== s.group
            const newGroup = s.group !== sections[n - 1]?.group
            return (
              <div key={s.id} className="contents">
                {newGroup && (
                  <p className="hidden md:block text-xs uppercase tracking-wider text-muted mt-4 mb-1 px-2">{s.group}/</p>
                )}
              <button
                onClick={() => go(s.id)}
                aria-current={on ? 'page' : undefined}
                className={`shrink-0 md:w-full text-left px-2 py-1.5 text-sm flex gap-2 transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent ${
                  on ? 'bg-accent/15 text-accent font-bold' : 'text-muted hover:text-fg hover:bg-panel'
                }`}
              >
                <span className="hidden md:inline text-line select-none">{last ? '└──' : '├──'}</span>
                <span className="whitespace-nowrap md:whitespace-normal md:break-all">{pad(n + 1)}-{slug(s.title)}.md</span>
              </button>
              </div>
            )
          })}
        </nav>
      </aside>

      <main id="main" tabIndex={-1} className="flex-1 px-5 py-8 md:px-14 md:py-14 min-w-0 focus:outline-none">
        <div className="max-w-3xl">
          <div key={active} className="rise">
            <p className="text-sm text-muted">
              <span className="text-ok">~/guide</span> / {pad(idx + 1)}-{slug(current.title)}.md
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mt-4 mb-12">
              <span className="text-accent select-none"># </span>
              {current.title}
            </h2>
          </div>
          <SectionView key={`s-${active}`} section={current} go={go} />
          <div className="mt-16 pt-6 border-t border-line flex justify-between gap-4 text-sm">
            {idx > 0 ? (
              <button onClick={() => go(sections[idx - 1].id)} className="text-muted hover:text-accent text-left">
                &larr; {sections[idx - 1].title}
              </button>
            ) : <span />}
            {idx < sections.length - 1 && (
              <button onClick={() => go(sections[idx + 1].id)} className="text-accent hover:underline text-right">
                {sections[idx + 1].title} &rarr;
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 h-7 border-t border-line bg-panel text-xs flex items-center gap-4 px-4 text-muted z-10">
        <span className="bg-accent text-bg font-bold px-2 py-0.5">GUIDE</span>
        <span className="truncate">{pad(idx + 1)}-{slug(current.title)}.md</span>
        <span className="ml-auto hidden sm:inline text-hot font-bold truncate">Work use? Check with IT first. Your responsibility.</span>
        <span className="sm:ml-0 ml-auto">{idx + 1}/{sections.length}</span>
      </footer>
    </div>
  )
}
