# Mindora — Digital Youth Wellness Platform

An ultra-clean, minimalist digital wellness and addiction prevention web application designed for college students using **Next.js 14 (App Router)** and **Tailwind CSS**.

---

## 🎨 Design System & Theme
- **Deep Obsidian Background:** `#07090e`
- **Neon Teal Accents:** `#00F5D4`
- **Calming Orchid Purple Accents:** `#8A2BE2` & `#C77DFF`
- **Glassmorphism:** `backdrop-filter: blur(16px)`, spacious translucent panels, glowing neon accents

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the top-focused dashboard or [http://localhost:3000/welcome](http://localhost:3000/welcome) for the standalone splash tour.

---

## ⚡ Top-Focused Dashboard Architecture

Mindora places the **core metrics immediately above the fold** without fluff, repetitive paragraphs, or redundant cards:

### 1. Above-The-Fold Core Metrics
1. **Screen-Time Awareness:** Real-time visual hours logged with social and gaming breakdowns.
2. **Active Streak Counter:** Continuous daily rhythm indicator with mindful pause counts.
3. **Habit Goals:** Live completion percentage meter (`71% - 5 of 7 Done`).
4. **Live Focus Clock:** Shows live ticking focus timer (`00:42:15`) when Auto-Sync is enabled, or Mode A status.

### 2. Streamlined 4 Essential Modules
- **📊 Module 1: Overview & Metrics (`WellbeingDashboard.tsx`)**
  - Crisp 4 core metrics.
  - Interactive **Weekly Screen-Time vs. Sleep Balance Curve** (`WellbeingCharts.tsx`).
  - Integrated 60-Second Mindful Breathing pause bar.
- **⚡ Module 2: Daily Log & Auto-Sync (`DailyMonitoringSystem.tsx`)**
  - **Live Session HUD:** Active focus clock (`hh:mm:ss`), dynamic state badge (`Active Focus` vs. `Idle Break Detected`), and **"Populate / Sync to Today"** button.
  - Dual Mode Switcher (Mode A: Manual Default vs. Mode B: Smart Activity Auto-Sync).
  - Quick, uncluttered sliders for Screen, Social, Gaming, Sleep, Study, Breaks, and Mood (1-5).
  - Editable voluntary history table.
- **✅ Module 3: Habit Checklist (`HabitTracker.tsx`)**
  - 7 interactive daily goals: *Screen leisure, 20-20-20 eye pauses, sleep wind-down, daylight, movement, offline mind, and social connection*.
  - Category filters and 1-line non-judgmental motivational feedback.
- **🆘 Module 4: Support & Helplines (`SupportHelpCentre.tsx`)**
  - Prominent **"GET HELP NOW"** emergency dispatch button.
  - Verified Indian National Helplines:
    - 🇮🇳 **Tele-MANAS**: `14416` or `1800-891-4416` (24x7 toll-free)
    - 🇮🇳 **KIRAN Helpline**: `1800-599-0019`
    - 🇮🇳 **Vandrevala Foundation**: `+91 9999 666 555`
    - 🇮🇳 **National All Emergency**: `112`
  - Concise self-regulation tracks for digital detox, addiction awareness, exam stress, and counseling.

### 3. Instagram-Style Splash Launch Flow (`SplashScreen.tsx` & `LoginView.tsx`)
- Minimalist 3D-styled emblem with ambient glow.
- 2.2-second entrance progress line or instant **"Get Started →"** bypass.
- Secure sign-in, anonymous passkey generation, show/hide password toggle, and official Google OAuth button.
