# AI Match Companion

Web mobile-first que convierte un partido del Mundial 2026 en una experiencia editorial: en vez de solo mostrar "Colombia vs Ghana", genera con IA un análisis pre-partido (duelo clave, jugador a seguir, por qué importa el partido).

## Stack

- **Framework**: Next.js 16.2.10 (App Router, TypeScript)
- **Estilos**: Tailwind CSS
- **Datos de partidos**: [football-data.org](https://www.football-data.org/) (plan free)
- **Generación de contenido**: [Groq](https://groq.com/) (`llama-3.3-70b-versatile`)
- **Deploy**: Vercel

## Requisitos previos

- Node.js 18+
- Una API key gratuita de [football-data.org](https://www.football-data.org/client/register)
- Una API key gratuita de [Groq](https://console.groq.com/keys)

## Setup

```bash
npm install
```

Crea un archivo `.env.local` en la raíz con:

```
FOOTBALL_DATA_API_KEY=tu_key_de_football-data.org
GROQ_API_KEY=tu_key_de_groq
```

Corre el proyecto:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Cómo funciona

- El home (`/`) muestra un selector de selecciones nacionales con sus banderas (vía [flagcdn.com](https://flagcdn.com)).
- Cada equipo tiene su propia página estática en `/team/[slug]`, generada en build time con `generateStaticParams`.
- En cada página, el sistema resuelve automáticamente el **próximo partido programado** del equipo en el Mundial. Si el equipo no tiene próximo partido (eliminado o el torneo terminó), muestra el resultado de su **último partido jugado**.
- Todo el fetch a football-data.org y la generación con Groq ocurre en el servidor (build/revalidate) — el navegador del usuario nunca llama estas APIs ni ve las keys.

## Estructura del proyecto

```
app/
  layout.tsx              → layout raíz, incluye el Navbar
  page.tsx                → home: selector de equipos
  team/[slug]/
    page.tsx              → tarjeta de Match Intelligence
    loading.tsx           → fallback mientras se resuelven datos
components/
  Navbar.tsx               → navbar fijo, cambia según la ruta
  PlayerAvatar.tsx         → avatar con iniciales (sin fotos reales)
  MatchInsightsToggle.tsx  → botón que expande la plantilla completa
lib/
  matches.config.ts       → lista de equipos destacados (FEATURED_TEAMS)
  football-data.ts        → cliente de football-data.org
  groq.ts                 → cliente de Groq + prompt de generación
  types/match.ts          → tipos de Match, Team, etc.
  utils.ts                → helpers (ej. getInitials)
```

## Agregar un equipo nuevo

Edita `lib/matches.config.ts` y agrega una entrada a `FEATURED_TEAMS` con:
- `teamId`: id numérico de football-data.org (consultar `/v4/teams?name=...`)
- `slug`: identificador para la URL (ej. `"chile"`)
- `displayName`: nombre a mostrar
- `flagCode`: código ISO alpha-2 de [flagcdn.com](https://flagcdn.com) (⚠️ Inglaterra usa `gb-eng`, no `gb`)

## Limitaciones conocidas

- El plan free de football-data.org limita a 10 requests/minuto — la arquitectura estática (SSG + revalidate) minimiza esto, pero agregar muchos equipos nuevos de golpe puede acercarse al límite en el primer build.
- El squad de cada equipo (`/teams/{id}`) puede tener datos desactualizados (`lastUpdated` antiguo) — válido para demo, no verificado para producción.
- No hay fotos reales de jugadores (se usan avatares con iniciales por decisión de producto).
- El estado de "equipo eliminado" (`last-finished`) no tiene avatares ni el botón de plantilla completa — pendiente si se retoma el proyecto.

## Pendiente / roadmap

- Manejo de errores de red (actualmente sin fallback si football-data.org o Groq fallan).
- Definir acción real del botón "Start" en el navbar (hoy es un `href="#"` sin comportamiento).
- Confirmar si el proyecto necesita "Cache Components" de Next.js para streaming parcial con Suspense.