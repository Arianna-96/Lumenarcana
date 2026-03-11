# Lumen Arcana — Product Requirements Document
*Your moment of reflection, every morning.*

---

## 1. Overview

**Lumen Arcana** is a daily tarot reflection web app. It is NOT a fortune-telling tool — it is a mindfulness and self-reflection experience built around the symbolism of the 22 Major Arcana tarot cards. Each day, the user draws one card and receives a personal reflection, affirmation, and journaling question to begin their day with intention.

**Language:** English  
**Platform:** Web (desktop + mobile responsive)  
**Stack:** React (Vite), no backend, no auth, localStorage only  
**Fonts:** Italiana (headings/display), Raleway (body/UI) — both from Google Fonts  

---

## 2. Design System

### Colors
```
--bg-deep:        #05040F   /* near-black base */
--bg-blue:        #0D0B2A   /* deep space blue */
--purple-dark:    #1A0E4A   /* rich dark purple */
--purple-mid:     #2D1B8A   /* mid purple for gradients */
--purple-bright:  #4A2FD4   /* bright purple blob */
--blue-royal:     #1E3FC2   /* royal blue blob */
--gold:           #C9933A   /* warm gold — zodiac symbols, accents */
--gold-light:     #E8B96A   /* lighter gold for text highlights */
--white-soft:     #F0EEF8   /* off-white for primary text */
--white-dim:      #A09CC0   /* dimmed white for secondary text */
--star-blue:      #6B8AFF   /* blue tint for star sparkles */
```

### Background (Global — persistent across all screens)
- Deep dark base: near-black `#05040F`
- **Animated gradient blobs:** 2–3 large radial blobs (purple `#2D1B8A`, royal blue `#1E3FC2`, deep violet `#4A2FD4`) that move slowly with a `@keyframes` animation — soft, fluid, slow (30–60s loop). They breathe and drift, never static.
- **Starfield layer:** dozens of tiny dots scattered across the canvas, varying opacity (0.2–0.8). Small 4-pointed star shapes (`✦`) at random positions, also varying size (2px–6px).
- **Sparkle animation:** a subset of stars twinkle — fade in/out randomly, independent timings, never all at once. Subtle, like real stars.
- This background is always present — it never disappears between screens. Only the foreground content fades in/out.

### Typography
```css
font-family: 'Italiana', serif;       /* display, titles, card names */
font-family: 'Raleway', sans-serif;   /* body, labels, UI text */
```

### Transitions Between Screens
- All screen transitions: **crossfade / opacity fade** — `opacity: 0 → 1`, duration `800ms`, easing `ease-in-out`
- No slides, no scale transforms — just pure soft fade
- Background stays still; only content fades

### Zodiac Sign Icon (Persistent UI)
- The user's calculated zodiac symbol (e.g. Leo ♌) appears **top-left corner** on every screen after onboarding
- Styled in gold (`#C9933A`), hand-drawn/brushstroke texture look, small (~40px)
- Subtle floating animation (up/down, 3s loop)
- One symbol per sign — use Unicode glyphs or custom SVG per sign

---

## 3. Screen Flow

```
[S1: Splash] → [S2: "Let's get to know you"] → [S3: Birth Date Input] 
→ [S4: Zodiac Reveal — symbol only] → [S5: Sign Confirmation] 
→ [S6: Transition to Deck] → [S7: The Deck] 
→ [S8: Card Reveal — full screen] → [S9: Card + Reflection]
```

On return visits (same day): skip to S9 directly, showing today's card.  
On return visits (new day): skip to S7 (The Deck).

---

## 4. Screens — Detailed Spec

---

### S1 — Splash Screen
**Shown:** First visit only (check `localStorage.tarot_onboarded`)

**Layout:** Centered, vertically and horizontally
- App name: **"Lumen Arcana"** — Italiana font, large (~72px desktop / ~48px mobile), white-soft
- Subtitle: *"Your moment of reflection, every morning."* — Raleway, small, dimmed white, letter-spaced
- Small decorative star `✦` next to the app name (gold)

**Animation sequence:**
1. Page loads → app name fades in slowly (1s)
2. After 1.5s pause → name floats upward (~20px, 800ms ease)
3. After name settles → subtitle fades in below (600ms)
4. After 2s → entire block fades out, S2 fades in

**No user interaction on this screen — auto-advances.**

---

### S2 — "Let's get to know you"
**Layout:** Single line of text, centered on screen

- Text: *"The stars have been waiting for you."* — Italiana, ~36px, white-soft
- Fades in (800ms), stays for 2s, then fades out → S3 fades in

**No user interaction — auto-advances.**

---

### S3 — Birth Date Input
**Layout:** Centered block

- Title: **"When were you born?"** — Italiana, ~48px, white-soft
- Subtitle: *"Every birth carries a sky. Let's find yours."* — Raleway, small, dimmed white
- **Date input UI:** custom styled boxes, NOT a native date picker
  - Format: `DD ✦ MM` (day + decorative star divider + month, NO year needed)
  - Two pairs of digit boxes: `[D][D] ✦ [M][M]`
  - Each box: dark background (`rgba(0,0,0,0.4)`), subtle border, rounded corners, number input
  - Gold `✦` separator between day and month groups
  - Raleway font, white text, large digits
- On complete (both DD and MM filled) → auto-advances after 500ms to S4

**Logic:**
```javascript
// Zodiac calculation from day + month only
function getZodiacSign(day, month) {
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
  if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}
```
Save to `localStorage.tarot_sign` and `localStorage.tarot_onboarded = true`.

---

### S4 — Zodiac Symbol Reveal
**Layout:** Symbol only, centered on screen

- The zodiac glyph for the calculated sign appears centered, large (~120px)
- Gold color, brushstroke/textured style
- Animation: fades in, then gently pulses/glows
- Stays for 1.5s → fades out → S5 fades in

**Zodiac Unicode glyphs:**
```
Aries ♈ | Taurus ♉ | Gemini ♊ | Cancer ♋ | Leo ♌ | Virgo ♍
Libra ♎ | Scorpio ♏ | Sagittarius ♐ | Capricorn ♑ | Aquarius ♒ | Pisces ♓
```

---

### S5 — Sign Confirmation
**Layout:** Symbol + text, centered

- Same zodiac symbol (smaller, ~60px), above text
- Text: *"Ah… a Leo. The sky remembers."* — Italiana, ~36px, white-soft
  - Each sign has its own version:
    ```
    Aries: "Ah… an Aries. The sky remembers."
    Taurus: "Ah… a Taurus. The sky remembers."
    Gemini: "Ah… a Gemini. The sky remembers."
    Cancer: "Ah… a Cancer. The sky remembers."
    Leo: "Ah… a Leo. The sky remembers."
    Virgo: "Ah… a Virgo. The sky remembers."
    Libra: "Ah… a Libra. The sky remembers."
    Scorpio: "Ah… a Scorpio. The sky remembers."
    Sagittarius: "Ah… a Sagittarius. The sky remembers."
    Capricorn: "Ah… a Capricorn. The sky remembers."
    Aquarius: "Ah… an Aquarius. The sky remembers."
    Pisces: "Ah… a Pisces. The sky remembers."
    ```
- Fades in, stays 2.5s → fades out → S6

---

### S6 — Transition to Deck
**Layout:** Centered text

- *"Your arcana is ready."* — Italiana, ~40px, white-soft
- *"Take a breath. Shuffle when you feel called to."* — Raleway, ~18px, dimmed white
- Zodiac symbol now appears top-left (persists from here onwards)
- Fades in, stays 2.5s → fades out → S7

---

### S7 — The Deck
**Layout:** Card deck centered, instruction text below

**Card deck:**
- Show a stack of 2–3 card backs, slightly offset (one behind the other)
- Card back design: **solid grey block** (`#3A3A4A`), rounded corners, gold border (`2px solid #C9933A`), gold `✦` centered — NO illustration, NO image
- Cards have a gentle **floating animation** (subtle up/down, 4s loop, slight rotation ±1°)
- Cards cast a soft purple/gold glow on the background beneath them

**Interaction:**
- **Hover on deck:** cards fan out slightly + shuffle animation (cards shift left/right rapidly for ~600ms, then restack). Cursor stays default.
- **Click on deck:** one card flies forward toward the user (scale up, move toward screen, 500ms), then transitions to S8

**Instruction text below deck:**
- *"Hover to shuffle. Click when you're ready."*
- Raleway, small, dimmed white, centered

**Note:** User can hover to shuffle as many times as they want before clicking.

---

### S8 — Card Reveal (Full Screen)
**Layout:** Single card, large, centered, filling most of the screen

- The picked card flips from back to front with a **3D CSS flip animation** (rotateY 0→180deg, 800ms)
- Card front: **solid grey block** (`#3A3A4A`), same dimensions as back, gold border, Roman numeral centered top in Italiana/gold, card name centered bottom in Italiana/gold — NO illustration, NO image
- Card is shown large, slightly tilted (~-5° to -10° rotation, as in the design)
- Card has a soft drop shadow and a subtle gold glow
- **3D Parallax on mouse move:** as the mouse moves, the card rotates slightly in the OPPOSITE direction
  ```javascript
  // Max tilt: ±12 degrees
  card.style.transform = `
    rotate(-8deg)
    rotateX(${-deltaY * 0.02}deg) 
    rotateY(${deltaX * 0.02}deg)
  `;
  ```
- On mobile: gentle idle floating animation instead of parallax
- **Custom cursor:** when hovering over the card, cursor becomes an eye `👁` (use CSS `cursor: url(eye.svg), auto`)
- After 2s of the card being shown full-screen → it smoothly scales down and moves up, making room for the reflection content below (S9)

---

### S9 — Card + Reflection
**Layout:** Card (upper half, smaller), content (lower half, scrollable if needed)

**Card:**
- Smaller version of the drawn card, still slightly tilted
- Still has parallax effect on hover
- Eye cursor on hover → click expands card back to full screen (S8 view), click again to collapse

**Content below card:**
- Card name in gold Italiana font, centered (e.g. *"The Star"*)
- Divider: thin gold line or `✦ ✦ ✦`

- **Reflection block:**
  - Small label: *"Your reflection"* — Raleway, uppercase, letter-spaced, dimmed white
  - Reflection text — Italiana italic, ~20px, white-soft, centered, generous line-height

- **Affirmation block:**
  - Small label: *"Your affirmation"* — same as above
  - Affirmation — Italiana, larger (~24px), gold color, centered, quoted with `" "`

- **Question block:**
  - Small label: *"A question for you"* — same as above
  - Question text — Raleway, ~16px, white-soft, centered, italic

- **Journaling textarea (optional):**
  - Placeholder: *"Write your reflection here… (optional)"*
  - Dark semi-transparent background, gold border, Raleway font
  - Subtle glow on focus

- **CTA:**
  - Button: *"Save my day"* — gold border, transparent bg, Italiana font, gold text
  - On click: saves to localStorage, shows a soft confirmation (e.g. a small ✦ sparkle animation)

- **Tagline at bottom:**
  - *"Carry this with you today."*
  - *"We'll be here again tomorrow. 🌙"*
  - Raleway, small, dimmed white, centered

---

## 5. Return Visit Logic

```javascript
const today = new Date().toDateString();
const savedToday = localStorage.getItem('tarot_today');

if (savedToday) {
  const reading = JSON.parse(savedToday);
  if (reading.date === today) {
    // Show S9 directly with today's card
    // Show message: "This is your card for today."
    // Show: "Come back tomorrow for a new reading 🌙"
    // No ability to draw again
  } else {
    // New day — clear tarot_today, go to S7
    localStorage.removeItem('tarot_today');
  }
}
```

---

## 6. localStorage Schema

```javascript
localStorage.tarot_onboarded   // "true" — onboarding complete
localStorage.tarot_sign        // "Leo" — calculated zodiac sign
localStorage.tarot_today       // JSON: { date, cardId, answer }
// tarot_history — to be added in v2
```

---

## 7. Card Data

Each card object:
```javascript
{
  id: Number,
  number: String,       // "XVII"
  name: String,         // "The Star"
  // image: removed in v1 — cards are grey placeholder blocks
  // grey block (#3A3A4A) with gold border, number top, name bottom
  reflection: String,
  affirmation: String,
  question: String
}
```

Card selection: randomly pick 1 of 22 cards per session. Once drawn and saved, same card shown all day.

---

## 8. Horoscope API

- Endpoint: `GET https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign={sign}&day=TODAY`
- Called on S9 load if `tarot_sign` exists
- Display as an additional soft section: *"Today's energy for {Sign}"*
- Handle failure gracefully — if API fails, simply hide this section, no error shown to user
- **Note:** this is optional enrichment, not core to the experience

---

## 9. Animations Summary

| Element | Animation | Duration | Notes |
|---|---|---|---|
| Background blobs | drift/breathe loop | 30–60s | Always running |
| Stars | twinkle (opacity pulse) | 2–5s random | Staggered, never all at once |
| Screen transitions | fade in/out | 800ms | All screens |
| App name (S1) | float up | 800ms | One-time on load |
| Zodiac symbol (S4) | fade + glow pulse | 1.5s | |
| Card backs (S7) | gentle float | 4s loop | Slight rotation |
| Deck hover | shuffle fan | 600ms | Cards scatter/restack |
| Card flip (S8) | 3D rotateY | 800ms | Back→front |
| Card parallax | mouse tracking | real-time | Max ±12deg |
| Card scale-down | shrink to S9 | 600ms | After 2s on S8 |
| Eye cursor | CSS custom cursor | instant | On card hover |
| Save button | sparkle burst | 400ms | On click |

---

## 10. Figma Make / Dev Notes

- Import Italiana and Raleway via Google Fonts `<link>` in `index.html`
- Background implemented as a fixed full-viewport `<div>` with layered CSS: gradient blobs (animated), star dots (SVG or CSS pseudo-elements), sparkle layer
- Card back image: use the user-provided PNG (holographic cream/gold illustrated back)
- Card front images: user-provided PNGs per card (placeholder SVG style until real images added)
- `html2canvas` not needed in v1 — save-as-image is a v2 feature
- No Supabase, no backend, no auth needed
- All state lives in localStorage + React useState

---

## 11. Out of Scope (v2)

- History / calendar view
- Rising sign
- Save as image
- Claude AI-generated reflections
- Push notifications / reminders
- Multiple languages