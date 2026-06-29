import type { TuiPlugin } from "@opencode-ai/plugin/tui"

// ── Types ───────────────────────────────────────────────────
interface BtwSession {
  id: string
  title: string
  parentID?: string
  status: "processing" | "done" | "error"
  question: string
}

const BTW_PREFIX = "🔀 BTW:"
const KV_KEY = "btw_sessions"

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
const BtwViewer: TuiPlugin = async (api) => {
  // ── State ───────────────────────────────────────────
  let sessions = api.kv.get<BtwSession[]>(KV_KEY, [])

  // ── 1. Track BTW sessions via event bus ─────────────
  const unsubCreated = api.event.on("session.created", (event) => {
    const s = event.properties.info
    if (!s.title?.startsWith(BTW_PREFIX)) return

    const question = s.title.slice(BTW_PREFIX.length).trim()
    if (sessions.some((x) => x.id === s.id)) return

    sessions.push({
      id: s.id,
      title: s.title,
      parentID: s.parentID,
      status: "processing",
      question,
    })
    sessions = sessions.slice(-20)
    api.kv.set(KV_KEY, sessions)
  })

  const unsubUpdated = api.event.on("session.updated", (event) => {
    const s = event.properties.info
    if (!s.title?.startsWith(BTW_PREFIX)) return

    const existing = sessions.find((x) => x.id === s.id)
    if (existing && existing.status === "processing") {
      existing.status = "done"
      api.kv.set(KV_KEY, sessions)
    }
  })

  api.lifecycle.onDispose(() => {
    unsubCreated()
    unsubUpdated()
  })

  // ── 2. /btw-list slash command ─────────────────────
  api.command?.register(() => [
    {
      title: "BTW: List active sessions",
      value: "btw-list",
      description: "Show all parallel question sessions and open any of them",
      slash: { name: "btw-list" },
      onSelect: async () => {
        const list = api.kv.get<BtwSession[]>(KV_KEY, [])
        if (list.length === 0) {
          api.ui.toast({
            title: "🔀 BTW",
            message: "No hay sesiones BTW activas",
            variant: "info",
          })
          return
        }

        api.ui.dialog.replace(() =>
          api.ui.DialogSelect({
            title: "🔀 BTW Sessions",
            options: list.map((s) => ({
              title: `${s.status === "processing" ? "⏳" : "✅"} ${s.question}`,
              value: s.id,
              description:
                s.status === "processing"
                  ? "Procesando…"
                  : "Click para abrir la sesión y ver la respuesta completa",
            })),
            onSelect: (opt) => {
              api.route.navigate("session", { sessionID: opt.value })
            },
          }),
        )
      },
    },
  ])

  // ── 3. Sidebar slot ────────────────────────────────
  try {
    api.slots.register({
      slots: {
        sidebar_footer: (props: { session_id: string }) => {
          const related = sessions.filter(
            (s) => s.parentID === props.session_id,
          )
          if (related.length === 0) return null

          // Attempt Solid hyperscript — wrapped so a failure doesn't
          // break the rest of the plugin.
          try {
            // dynamic import since solid-js may not be in scope
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { h } = require("solid-js") as {
              h: (
                tag: string,
                props: Record<string, unknown>,
                children?: unknown[] | unknown,
              ) => unknown
            }
            return h(
              "div",
              { style: { padding: "0 8px" } },
              [
                h(
                  "div",
                  { style: { "font-weight": "bold", "margin-top": "4px" } },
                  "🔀 BTW",
                ),
                ...related.map((s) =>
                  h(
                    "div",
                    {
                      style: { cursor: "pointer" },
                      onClick: () =>
                        api.route.navigate("session", {
                          sessionID: s.id,
                        }),
                    },
                    `${s.status === "processing" ? "⏳" : "✅"} ${s.question}`,
                  ),
                ),
              ],
            )
          } catch {
            return null
          }
        },
      },
    })
  } catch {
    // Sidebar slot failed — /btw-list command still works
  }
}

export default BtwViewer
