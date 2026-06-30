import type { Plugin } from "@opencode-ai/plugin";
/**
 * ── @gentle-ai/btw-plugin (server) ──────────────────────────
 *
 * Intercepts the `/btw` command at runtime via the
 * `command.execute.before` hook:
 *
 * 1. Creates a child session linked to the current one (parentID)
 * 2. Fires promptAsync — non-blocking, the user keeps typing
 * 3. Shows a brief toast "🔀 BTW: Preguntando…"
 * 4. Throws to cancel the command on the main session
 *
 * The result is accessible via:
 *   - The `/btw-list` slash command (TUI plugin)
 *   - The sidebar slot (TUI plugin)
 *   - The sessions panel (any session titled "🔀 BTW: …")
 */
declare const BtwServer: Plugin;
export default BtwServer;
//# sourceMappingURL=server.d.ts.map