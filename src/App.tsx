import { useState } from 'react'

const sections = [
  {
    id: 'install',
    title: '1. Install',
    content: [
      {
        heading: 'Requirements',
        text: 'Node.js 18+ and npm. Claude Code runs in your terminal — no IDE required, though VS Code and JetBrains extensions are available.',
      },
      {
        heading: 'Install globally',
        code: 'npm install -g @anthropic-ai/claude-code',
      },
      {
        heading: 'Authenticate',
        code: 'claude',
        note: 'Running claude for the first time opens a browser to complete OAuth. Your session is stored in ~/.claude/.',
      },
      {
        heading: 'Verify',
        code: 'claude --version',
      },
    ],
  },
  {
    id: 'first-session',
    title: '2. First Session',
    content: [
      {
        heading: 'Start in a project directory',
        code: 'cd your-project\nclaude',
        note: 'Claude Code reads your project context on startup — git history, file structure, and any CLAUDE.md files.',
      },
      {
        heading: 'Useful first prompts',
        bullets: [
          '"What does this codebase do? Give me an architecture overview."',
          '"What are the main entry points?"',
          '"Find all the places where user authentication happens."',
          '"What tests exist and how do I run them?"',
        ],
      },
      {
        heading: 'Key shortcuts',
        table: [
          ['Escape', 'Cancel current generation'],
          ['Ctrl+C', 'Exit Claude Code'],
          ['↑ / ↓', 'Navigate prompt history'],
          ['/help', 'Show all slash commands'],
          ['/clear', 'Clear conversation context'],
        ],
      },
    ],
  },
  {
    id: 'claude-md',
    title: '3. CLAUDE.md',
    content: [
      {
        heading: 'What it does',
        text: 'CLAUDE.md is a markdown file Claude Code reads automatically at the start of every session. It\'s your standing instructions — conventions, rules, toolchain specifics. Think of it as onboarding documentation for your AI collaborator.',
      },
      {
        heading: 'Locations',
        bullets: [
          '~/.claude/CLAUDE.md — global, applies to every project',
          '{project}/CLAUDE.md — project-specific rules',
          '{project}/{dir}/CLAUDE.md — subtree rules (applied when working in that folder)',
        ],
      },
      {
        heading: 'Starter template',
        code: `# Project: my-service

## Toolchain
- Package manager: pnpm (never npm or yarn)
- Test runner: vitest — run \`pnpm test\` before committing
- Linter: biome — \`pnpm lint:fix\` before pushing

## Architecture
- Hexagonal. Domain layer has zero framework imports.
- New services go in src/domain/services/

## Rules
- Never modify migration files after they've been committed
- No console.log in committed code — use the logger module
- All API endpoints need a corresponding OpenAPI spec entry`,
      },
      {
        heading: 'What NOT to put in CLAUDE.md',
        bullets: [
          'Secrets, API keys, or credentials',
          'Long explanations — keep it terse and actionable',
          'Things Claude already knows (standard patterns, common libraries)',
          'Everything — longer is not better. Be surgical.',
        ],
      },
    ],
  },
  {
    id: 'skills',
    title: '4. Skills (Slash Commands)',
    content: [
      {
        heading: 'What skills are',
        text: 'Skills are markdown files that define reusable workflows. Type /skill-name and Claude executes the instructions in that file. Great for repetitive multi-step tasks.',
      },
      {
        heading: 'Create a skill',
        code: '# Skills live in:\n~/.claude/skills/         # global\n.claude/skills/           # project-only\n\n# Create one:\nmkdir -p ~/.claude/skills\nvim ~/.claude/skills/standup.md',
      },
      {
        heading: 'Example: /standup skill',
        code: `# Daily Standup

1. Run \`git log --oneline --since="yesterday" --author="$(git config user.name)"\`
2. Run \`git status\` to see in-progress work
3. Output format:

**Yesterday:** [bullets from commits]
**Today:** [in-progress items]
**Blockers:** [any / none]`,
      },
      {
        heading: 'Useful skills to build',
        bullets: [
          '/standup — generate daily standup from git log',
          '/review — run a structured code review on a file',
          '/deploy-check — verify the project is ready to deploy',
          '/doc — generate documentation for a function or module',
          '/test — write tests for a specific file or function',
        ],
      },
    ],
  },
  {
    id: 'safety',
    title: '5. Safety & Data',
    content: [
      {
        heading: 'What Claude Code can see',
        bullets: [
          'Files you are working in (reads them when needed)',
          'Git history and status',
          'Terminal output from commands it runs',
          'Environment variables (be careful with secrets)',
        ],
      },
      {
        heading: 'What Claude Code cannot do',
        bullets: [
          'Access files outside your project without explicit permission',
          'Make network calls directly (only via tools you approve)',
          'Run commands without showing them to you first (in default mode)',
        ],
      },
      {
        heading: 'Data classification rules',
        bullets: [
          'Never paste production data (PII, credentials, PHI) into Claude Code prompts',
          'Treat Claude Code conversations as internal-confidential by default',
          'If you\'re unsure whether data is safe to share, don\'t share it',
          'Use sanitized/synthetic data for examples in prompts',
        ],
      },
      {
        heading: 'Review before accepting',
        text: 'Claude Code shows you every file it wants to modify. Read the diff before accepting. You are responsible for code you ship — Claude is a collaborator, not an autonomous agent.',
      },
    ],
  },
  {
    id: 'cost',
    title: '6. Cost & Limits',
    content: [
      {
        heading: 'How billing works',
        text: 'Claude Code uses the Anthropic API. You pay per token (input + output). A typical coding session costs $0.05–$2.00 depending on model and context size.',
      },
      {
        heading: 'Model tiers',
        table: [
          ['claude-sonnet-4-6', '$3/$15 per M tokens', 'Default — best balance'],
          ['claude-opus-4-8', '$15/$75 per M tokens', 'Harder problems, higher cost'],
          ['claude-haiku-4-5', '$0.80/$4 per M tokens', 'Fast, cheap, simpler tasks'],
        ],
      },
      {
        heading: 'Cost control tips',
        bullets: [
          'Use /clear to reset context when starting a new task',
          'Smaller, focused prompts cost less than long conversations',
          'Install the cost tracker Stop hook to see per-turn cost in real time',
          'Set COST_ALERT_12H and COST_ALERT_DAY env vars to get spend alerts',
        ],
      },
      {
        heading: 'Install the cost tracker',
        code: 'git clone https://github.com/thejaredchapman/developer_improvements\ncd developer_improvements/claude-code-updates\nbash install.sh',
      },
    ],
  },
]

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative group">
      <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre leading-relaxed">
        {code}
      </pre>
      <button
        onClick={copy}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}

function Section({ section }: { section: typeof sections[0] }) {
  return (
    <div className="space-y-6">
      {section.content.map((block, i) => (
        <div key={i} className="space-y-2">
          <h3 className="text-orange-300 font-medium text-sm uppercase tracking-wide">{block.heading}</h3>
          {'text' in block && block.text && (
            <p className="text-gray-300 text-sm leading-relaxed">{block.text}</p>
          )}
          {'code' in block && block.code && <CodeBlock code={block.code} />}
          {'note' in block && block.note && (
            <p className="text-gray-500 text-xs italic">{block.note}</p>
          )}
          {'bullets' in block && block.bullets && (
            <ul className="space-y-1">
              {block.bullets.map((b, j) => (
                <li key={j} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-orange-500 mt-0.5">›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {'table' in block && block.table && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {block.table.map((row, j) => (
                    <tr key={j} className="border-b border-gray-800">
                      {row.map((cell, k) => (
                        <td key={k} className={`py-2 px-3 ${k === 0 ? 'text-orange-300 font-mono' : 'text-gray-300'}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('install')
  const current = sections.find(s => s.id === active)!

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-gray-800 p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-orange-400 font-semibold text-lg">Claude Code</h1>
          <p className="text-gray-500 text-xs mt-1">Setup & Usage Guide</p>
        </div>
        <nav className="space-y-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                active === s.id
                  ? 'bg-orange-900/40 text-orange-300 border border-orange-800/50'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-100 mb-6">{current.title}</h2>
        <Section section={current} />
      </main>
    </div>
  )
}
