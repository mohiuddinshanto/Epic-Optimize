# Epic Optimize — Next.js 15 Digital Agency Web Application

Next.js 15 App Router port of the **Epic Optimize** digital agency platform with clean, reusable components, TypeScript, Tailwind CSS, Three.js 3D graphics, bilingual localization (EN/BN), and edge routing.

## 🚀 Key Features & Architectural Highlights

- **Next.js 15 App Router Architecture**: Clean file-based routing (`/`, `/[locale]`, `/api/contact`, `/api/geo`).
- **Reusable UI Components (`components/ui`)**:
  - `MagneticButton`: Tactile cursor-following physics button / link.
  - `TiltCard`: 3D perspective card with dynamic glare lighting on mouse tracking.
  - `DepthCard`: 3D floating feature card with depth-lifted icons.
  - `SectionBadge`: Reusable glowing badge chip for section headings.
  - `SectionHeader`: Reusable header component to eliminate boilerplate across sections.
  - `CursorGlow`: Ambient pointer-fine glow tracking desktop cursors.
  - `LegalModal`: Accessible privacy policy & terms of service dialog.
- **Three.js 3D Visuals (`components/3d`)**:
  - `Hero3DCanvas`: Interactive cybernetic core with orbiting rings and constellation dust.
  - `Background3DCanvas`: Ambient floating particle network.
  - `DhakaGlobe3D`: Interactive 3D wireframe globe centered on Dhaka (23.81° N, 90.41° E) with pulsing radar beacon.
  - Fully dynamic import with `ssr: false` preventing any hydration mismatch.
- **Bilingual Localization (English & Bengali)**:
  - English & Bengali numeral conversion (`০-৯`).
  - Edge middleware automatic geo-detection, cookie persistence, and bot-safe indexing.
- **Theme System**:
  - Dark, Light, and System preferences with CSS variables and Tailwind dark mode.
- **API & Security**:
  - Zod validation for contact inquiries.
  - In-memory IP rate limiting.
  - Invisible honeypot spam protection.
  - Optional Resend email dispatch.

## 🛠️ Getting Started

```bash
# 1. Navigate to the project directory
cd epic-optimize-nextjs

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
npm start
```

## 📂 Project Structure

```
epic-optimize-nextjs/
├── app/
│   ├── [locale]/
│   │   └── page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   └── geo/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── 3d/
│   │   ├── Background3DCanvas.tsx
│   │   ├── DhakaGlobe3D.tsx
│   │   └── Hero3DCanvas.tsx
│   ├── sections/
│   │   ├── AgencyLandingPage.tsx
│   │   ├── ContactSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WhyUsSection.tsx
│   │   └── WorkSection.tsx
│   └── ui/
│       ├── CursorGlow.tsx
│       ├── DepthCard.tsx
│       ├── LegalModal.tsx
│       ├── MagneticButton.tsx
│       ├── SectionBadge.tsx
│       ├── SectionHeader.tsx
│       └── TiltCard.tsx
├── context/
│   ├── LocaleContext.tsx
│   └── ThemeContext.tsx
├── data/
│   ├── company.ts
│   └── messages/
│       ├── bn.json
│       └── en.json
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```
