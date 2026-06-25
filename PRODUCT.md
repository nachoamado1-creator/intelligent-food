# Intelligent Food

> Prototipo académico (TPE — Análisis y Diseño de Sistemas II · Grupo 7).
> Web app que conecta usuarios con heladeras inteligentes en Tandil que venden
> comidas saludables. Toda la data está en memoria (Zustand persist), alineada
> al esquema relacional `intelligent_food_completoG7.sql`.

## Register

**product** — App UI funcional. La landing es marketing, pero el grueso de la
experiencia (login, catálogo, carrito, checkout, QR, historial, perfil/grupo)
es producto.

## Audience

- **Usuario final**: gente joven o de mediana edad en Tandil (estudiantes
  UNICEN, oficinistas del centro, deportistas en el Polideportivo, viajeros
  en la terminal). Quieren comer bien sin esperas: leen poco, escanean rápido,
  esperan que la app no les pida 10 pasos antes de algo.
- Mobile-first absoluto. Solo en hi-fi para defender el TPE va a verse en
  desktop, así que el desktop puede ser elegante pero no es el escenario real.

## Goals

1. Demostrar las US1-US8 del TPE: registro/2FA, login, catálogo + stock por
   heladera, carrito multi-consumidor, cupones por usuario, checkout con
   saldo grupal o Mercado Pago, QR con cuenta regresiva, historial + reseñas.
2. Mostrar la DB del Grupo 7 "viva": 60 usuarios, 32 productos, 15 heladeras,
   172 lotes, 45 cupones, 12 grupos, saldos y compras. La UX debe transmitir
   que es un sistema real, no un mockup.
3. Sentirse premium para una entrega académica: animaciones intencionales,
   contraste correcto, fotos reales, sin emojis como íconos.

## Brand / voice

- **Voz**: cercana argentina, directa, sin marketingese. Verbos en imperativo
  ("Empezá", "Buscalo", "Retirá"), nunca "haga click aquí".
- **Tono visual**: emerald primary + amber accent sobre cream `#FCFAF8` en
  light, near-black `#0B1014` en dark. No es SaaS-cream genérico — la heladera
  es el héroe (foto real con `mix-blend-multiply` sobre el cream).
- **Anti-referencias**: nada de "Modern Living", nada de gradientes
  purple-to-blue, nada de cards con icono + título + 2 líneas idénticos en
  grid. No emojis como íconos en UI (sí están permitidos en contenido).

## Color (committed)

Tokens HSL ya en [app/globals.css](app/globals.css):

- `--background` light `30 33% 98%` = `#FCFAF8`
- `--background` dark `220 30% 5%` = near-ink
- `--primary` light `158 64% 35%` (emerald-700), dark `158 70% 45%`
- `--accent` light `34 96% 52%` (amber-500), dark `34 96% 58%`

Estrategia: **restrained**. Emerald y amber son acentos, no surfaces. El cream
y el ink cargan el 90% de la superficie. Compras verificadas / saldo activo /
status Habilitada usan emerald. Stock bajo / cupón aplicado / cantidad
configurable usan amber.

## Type

- **Geist Sans** (`var(--font-geist-sans)`) para todo el body + headings.
- **Geist Mono** para tokens, dni, números monoespaciados, QR.
- Sin segunda familia. Jerarquía por weight + size, no por mezcla de fonts.

## Components y stack

- Next.js 16 (App Router) + React 19 + TypeScript estricto.
- Tailwind 3 con tokens HSL + `class-variance-authority` para variantes.
- `next-themes` (dark/light), `framer-motion`, `lucide-react`, `qrcode.react`.
- Zustand 5 con `persist` (version 3, no persiste catálogo).
- shadcn-style components en `components/ui/*`: button, input, card, badge,
  tooltip, toast, theme-toggle, dock-morph, expand-map, feature-spotlight.
- Componentes propios: top-bar, bottom-nav (usa dock-morph), product-card,
  product-image, brand-logo, back-button, countdown, qr-display,
  protected-route.

## Surfaces que importan

- **/** Landing con FeaturedSpotlight de la heladera (foto real, blend).
- **/auth/{login,register,verify}** — registro + 2FA simulado (código por toast).
- **/(app)/home** — heladeras cerca con LocationMap por card.
- **/(app)/fridges/[id]** — catálogo con stock por lote, búsqueda local.
- **/(app)/products/[id]** — detalle + heladeras con stock + reviews.
- **/(app)/cart** — multi-consumidor, cupones del usuario, buscador embebido.
- **/(app)/checkout** — saldo de grupo o MP, splits por (heladera × consumidor).
- **/(app)/active** — QR + countdown 4h + "Escanear" con animación de apertura.
- **/(app)/history** + **/(app)/history/[id]/review** — historial + ratings.
- **/(app)/profile** — vincular MP, saldo del grupo, miembros, solicitudes.

## Anti-references concretas

- Hero con video en bucle dentro de un recuadro (lo intentamos, se notaba
  pegado y no funcionaba en producto académico).
- Eyebrow tracked en mayúsculas en CADA sección (ya hay uno en hero, otro
  en "Por qué" — el límite es ese, no más).
- Numeración 01 / 02 / 03 sobre secciones que no son una secuencia real.
- Emojis 🥗🍔🌯 como íconos de stock o categorías (ya se sustituyeron por
  las fotos PNG reales del Grupo 7).
- "Compras verificadas" con icon-title-2-líneas idéntico al resto: ya hay
  4 value cards iguales, no agregar más.
