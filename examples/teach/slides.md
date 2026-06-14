---
theme: slidev-theme-tahta
title: "Claude Code <em>101</em>"
info: A teaching deck — the tahta teaching/technical pack (agenda, define, reference, columns, panels, code-explain, vs, terminal, filetree, kbd).
themeConfig:
  variant: editorial
transition: slide-left
mdc: true
routerMode: hash
layout: lead
index: "CC"
bg: mesh
kicker: Developer Onboarding
subtitle: Agentic coding from your terminal — install, configure, extend, ship.
---

---
layout: agenda
kicker: Roadmap
title: What we'll cover
items:
  - { topic: Getting started, desc: "install, first run, the agentic loop" }
  - { topic: Core tools, desc: "files, search, bash, web" }
  - { topic: Permissions, desc: "modes, allowlists, auto mode" }
  - { topic: CLAUDE.md, desc: "persistent instructions, hierarchy" }
  - { topic: Context & memory, desc: "window, compaction, auto memory" }
  - { topic: Extending, desc: "MCP, hooks, skills, subagents" }
---

---
layout: define
kicker: The basics
term: What is Claude Code?
definition: An <span class="accent2">agentic coding assistant</span> that lives in your terminal — it reads, edits, runs, and ships.
points:
  - Reads & edits files across your codebase
  - Runs shell commands, tests, builds
  - Creates commits & pull requests
---

---
layout: columns
kicker: Capabilities
title: One tool, many surfaces
columns:
  - { title: "It can…", items: ["Read & edit files", "Run shell, tests, builds", "Search code (regex / glob)", "Search the web & fetch docs", "Connect to tools via MCP"] }
  - { title: "Available on…", items: ["Terminal — <code>claude</code>", "VS Code extension", "JetBrains plugin", "Desktop — mac / Windows", "Web — claude.ai/code"] }
---

---
layout: reference
kicker: Slash commands
title: The ones you'll actually use
groups:
  - { title: Essentials, items: [{ term: "/help", desc: list commands }, { term: "/clear", desc: reset the conversation }, { term: "/init", desc: scaffold a CLAUDE.md }] }
  - { title: Session, items: [{ term: "/resume", desc: reopen a past session }, { term: "/compact", desc: summarize to free context }, { term: "/cost", desc: tokens spent this session }] }
  - { title: Mode & model, items: [{ term: "/model", desc: switch model }, { term: "/fast", desc: toggle fast mode }, { term: "/vim", desc: vim keybindings }] }
---

---
layout: panels
kicker: Context management
title: Keep the window healthy
panels:
  - { icon: "lucide:gauge", title: Watch usage, items: ["the bar shows % used", "warns before it fills"] }
  - { icon: "lucide:archive", title: When it fills, items: ["auto-compaction summarizes", "older turns are condensed"] }
  - { icon: "lucide:feather", title: Stay lean, items: ["one task per session", "/clear between tasks"] }
  - { icon: "lucide:triangle-alert", title: Signs of overload, items: ["repeating itself", "losing earlier context"] }
---

---
layout: code-explain
kicker: Hooks
title: Auto-format on every edit
notes:
  - "<strong>PostToolUse</strong> fires after a tool runs — here, after any file edit."
  - "Match <strong>Edit|Write</strong> so it only runs on file mutations."
  - "The command gets the changed path on stdin; format it in place."
---

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "command": "prettier --write $FILE"
    }]
  }
}
```

---
layout: default
kicker: Quick bash
title: Run a command without leaving the prompt
---

<Terminal title="zsh" :lines="[
  { comment: 'prefix with ! to run a shell command inline' },
  { cmd: '!npm test' },
  { out: '✓ 48 passed (2.1s)' },
  { cmd: 'claude --version' },
  { out: '2.0.1' }
]" />

---
layout: vs
kicker: Persistence
title: Two ways Claude remembers
left:
  title: CLAUDE.md
  items: ["You write it", "Project + global hierarchy", "Versioned in git", "Instructions & conventions"]
right:
  title: Auto memory
  items: ["Claude writes it", "Learned across sessions", "Lives in ~/.claude", "Facts, prefs, feedback"]
---

---
layout: default
kicker: CLAUDE.md
title: It loads in a <em>hierarchy</em>
---

<FileTree :items="[
  { name: '~/.claude/CLAUDE.md  (global)', dir: true },
  { name: 'repo/', dir: true, children: [
    { name: 'CLAUDE.md  (project)' },
    { name: 'packages/', dir: true, children: [{ name: 'CLAUDE.md  (subtree)' }] }
  ] }
]" />

<div class="mt-6 dim">More specific files override broader ones — global → project → subtree.</div>

---
layout: default
class: dropcap
kicker: Shortcuts
title: Keys worth memorizing
---

Two of these will save you more time than anything else — interrupting a wrong turn early, and cycling permission modes without leaving the prompt.

<div class="text-lg mt-6" style="display:flex; flex-direction:column; gap:0.9rem">
  <div><Kbd>Esc</Kbd> — interrupt Claude mid-task</div>
  <div><Kbd>Esc</Kbd> <Kbd>Esc</Kbd> — edit a previous message</div>
  <div><Kbd>Ctrl-R</Kbd> — expand truncated output</div>
  <div><Kbd>Shift</Kbd> + <Kbd>Tab</Kbd> — cycle permission modes</div>
</div>

---
layout: bigtype
kicker: The takeaway
title: Let the agent do the <em>typing</em>. You do the thinking.
---

---
layout: end
title: Claude Code 101
subtitle: Now go ship something
contact: claude.ai/code
---
