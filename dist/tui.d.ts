import type { TuiPlugin } from "@opencode-ai/plugin/tui";
/**
 * ── @gentle-ai/btw-plugin (TUI) ─────────────────────────────
 *
 * Companion TUI plugin for the BTW server plugin.
 *
 * Features:
 * 1. Tracks BTW sessions via event bus (session.created/updated)
 * 2. Registers `/btw-list` slash command → DialogSelect
 * 3. Registers sidebar_footer slot with clickable BTW entries
 */
declare const BtwViewer: TuiPlugin;
export default BtwViewer;
//# sourceMappingURL=tui.d.ts.map