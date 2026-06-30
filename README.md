# btw-opencode

**OpenCode plugin** — ask parallel questions without interrupting your main session.

Type `/btw <question>` and the plugin spawns a child session in the background. Your main session keeps running. Check results later with `/btw-list` or open the child session from the sessions panel.

No other plugins required. Works with any OpenCode setup.

## How it works

```
┌─ TUI ──────────────────────────┐    ┌─ Server ──────────────────┐
│                                │    │                           │
│  /btw react hooks vs classes   │───>│  command.execute.before    │
│                                │    │  - create child session   │
│                                │    │  - promptAsync (no block) │
│  /btw-list                     │    │  - throw (cancel cmd)     │
│  ┌──────────────────────────┐  │    └───────────────────────────┘
│  │ ⏳ react hooks vs...     │  │
│  │ ✅ composition vs...     │  │
│  └───────── click ──────────┘──┘
│                                │
│         ↓ opens child session with full response
```

Two self-contained plugins in one package:

| Plugin | Layer | Job |
|--------|-------|-----|
| `server.js` | Server (hooks) | Intercepts `/btw`, creates child session, fires promptAsync (non-blocking), cancels the command on the main session |
| `tui.js` | TUI (UI) | Tracks BTW sessions via event bus, persists to KV, registers `/btw-list` slash command, attempts sidebar footer slot |

**The sidebar slot** may not render depending on your SolidJS version — it uses `require("solid-js").h()` which isn't always available. `/btw-list` always works regardless. The plugin does not depend on any other plugin (not even subagent-statusline).

## Install

### Via gentle-ai (recommended)

Open **gentle-ai**, go to **OpenCode Plugins**, select **BTW Plugin**, and click **Register**. gentle-ai handles the npm install and TUI registration automatically.

### Standalone

Install from GitHub (no auth required):

```bash
npm install pabloXDXDXD/btw-opencode
```

## Configure

Add both plugins to your config files:

```json
// opencode.json — server plugin (command hook)
{
  "plugin": ["pabloXDXDXD/btw-opencode"]
}

// tui.json — TUI plugin (/btw-list + sidebar)
{
  "plugin": ["pabloXDXDXD/btw-opencode/tui"]
}
```

Copy `commands/btw.md` to your project's `.opencode/commands/` for autocomplete support.

## Commands

| Command | Description |
|---------|-------------|
| `/btw <question>` | Ask in a child session, non-blocking |
| `/btw-list` | Open a dialog with all active BTW sessions |

Select a session from the dialog to navigate to it and read the full response.

## Project structure

```
btw-opencode/
├── src/
│   ├── server.ts          ← server plugin source
│   └── tui.ts             ← TUI plugin source
├── commands/
│   └── btw.md             ← command file for autocomplete
├── dist/                  ← compiled output
│   ├── server.js
│   └── tui.js
├── opencode.example.json
└── package.json
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## License

MIT
