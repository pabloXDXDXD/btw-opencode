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
const BtwServer = async ({ client }) => {
    return {
        "command.execute.before": async (input, _output) => {
            // ── Only handle /btw ──────────────────────────────
            if (input.command !== "btw")
                return;
            const question = input.arguments || "...";
            try {
                // 1. Create child session, linked to the parent
                const sessionResult = await client.session.create({
                    body: {
                        title: `🔀 BTW: ${question.slice(0, 60)}`,
                        parentID: input.sessionID,
                    },
                });
                if (!sessionResult.data)
                    return;
                // 2. Fire the question — non-blocking, user keeps working
                client.session
                    .promptAsync({
                    path: { id: sessionResult.data.id },
                    body: {
                        parts: [{ type: "text", text: question }],
                    },
                })
                    .catch(() => {
                    /* background failure — session stays visible in sidebar */
                });
                // 3. Brief toast
                client.tui
                    .showToast({
                    body: {
                        title: "🔀 BTW",
                        message: "Preguntando en sesión hija…",
                        variant: "info",
                        duration: 2000,
                    },
                })
                    .catch(() => { });
            }
            catch {
                // Silent — never disrupt the user's flow
            }
            // 4. Cancel the command on the main session
            throw new Error("handled by btw-plugin");
        },
    };
};
export default BtwServer;
//# sourceMappingURL=server.js.map