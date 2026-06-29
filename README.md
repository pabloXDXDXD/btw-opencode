# @gentle-ai/btw-plugin

**OpenCode plugin** — pregunta en paralelo sin interrumpir tu sesión principal.

Escribí `/btw <pregunta>` y el plugin:
1. Crea una sesión hija (background, no bloquea el input)
2. El bot responde en esa sesión
3. Abrí `/btw-list` para ver todas las sesiones activas
4. Click → ves la respuesta completa en la sesión hija

## Instalación

```bash
# Desde npm
npm install @gentle-ai/btw-plugin
```

O cloná el repo y referenciá los paths localmente.

## Configuración

Agregá ambos plugins a tu `opencode.json`:

```json
{
  "plugin": [
    "@gentle-ai/btw-plugin",
    "@gentle-ai/btw-plugin/tui"
  ]
}
```

Y el comando (para autocomplete) a `.opencode/commands/btw.md` — copiá el archivo de `commands/btw.md` incluido en el package.

## Cómo funciona

```
┌─ TUI ──────────────────────┐    ┌─ Server ─────────────────┐
│                            │    │                          │
│  /btw qué edad tiene       │───>│  command.execute.before   │
│  Messi?                    │    │  - crea sesión hija       │
│                            │    │  - promptAsync (no block) │
│  ┌─ BTW ───────────────┐   │    │  - throw (cancela cmd)   │
│  │ ✅ qué edad tiene    │   │    └──────────────────────────┘
│  │    Messi?            │   │
│  └──────────────────────┘   │
│                            │
│  /btw-list                 │───> DialogSelect → navega a
│                            │     la sesión hija
└────────────────────────────┘
```

- **Server plugin**: intercepta `/btw`, crea sesión hija, dispara la pregunta sin esperar
- **TUI plugin**: escucha el event bus, guarda sesiones BTW en KV, muestra `/btw-list` y sidebar slot
- **Resultados**: persisten en `api.kv`, sobreviven a recargas del plugin

## Comandos

| Comando | Descripción |
|---------|-------------|
| `/btw <pregunta>` | Pregunta en paralelo |
| `/btw-list` | Muestra sesiones BTW activas |

## Desarrollo

```bash
npm install
npm run build
```

Los plugins compilados quedan en `dist/`.

## License

MIT
