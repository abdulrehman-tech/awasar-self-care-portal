

# Landing Page for Awasr + Chatbot on Landing Page + Routing Updates

## Overview
Create a professional, modern landing page at `/` showcasing Awasr's fiber internet services, move login to `/login`, update all logout flows, and ensure the AI chatbot widget is visible on the landing page.

## Routing Changes

| Route | Current | New |
|-------|---------|-----|
| `/` | LoginPage | LandingPage |
| `/login` | (none) | LoginPage |
| Logout redirect (3 places) | `navigate("/")` | `navigate("/login")` |

## Landing Page Sections

1. **Sticky Navbar** -- Awasr logo, nav links (Plans, Features, Coverage, Support), language toggle, "My Awasr" login button. Mobile hamburger menu.

2. **Hero Section** -- Full-width gradient background, headline "Oman's Fastest Fiber Internet" / "أسرع إنترنت ألياف في عُمان", speed highlight (up to 1 Gbps), two CTAs: "Browse Plans" (scroll) and "My Awasr Login" (link to /login).

3. **Plans Grid** -- Cards for 7 Fibernet Home plans (27-90) pulled from `mockData.plans`. Each card shows plan name, speed, price with OmrSymbol, key features. Popular plan (Home 35) highlighted.

4. **Features Section** -- Icon grid: Unlimited Data, SafeNet Security, Jawwy TV, Ashal Education, 24/7 Support (80001000), Wide Coverage. Uses Iconsax icons.

5. **Coverage Section** -- Grid of operational regions from `mockData.networkStatus` with status indicators.

6. **CTA Banner** -- "Ready to get connected?" with link to /login.

7. **Footer** -- Contact (80001000, WhatsApp), quick links, copyright.

## Chatbot Widget
The `ChatbotWidget` is already rendered inside `AppLayout`. For the landing page (which is outside `AppLayout`), it will be added directly to the `LandingPage` component.

## Files to Change

### New File
- `src/pages/LandingPage.tsx` -- Full landing page with all sections, responsive, RTL-ready, includes `<ChatbotWidget />`

### Modified Files
- `src/App.tsx` -- Add LandingPage at `/`, move LoginPage to `/login`
- `src/pages/LoginPage.tsx` -- Add "Back to Home" link navigating to `/`
- `src/components/layout/AppSidebar.tsx` -- Change logout `navigate("/")` to `navigate("/login")`
- `src/components/layout/BottomNav.tsx` -- Change logout `navigate("/")` to `navigate("/login")`
- `src/pages/ProfilePage.tsx` -- Change logout `navigate("/")` to `navigate("/login")`

## Technical Details

- Reuses existing design tokens: `gradient-primary`, `card-shadow-md`, brand colors from CSS variables
- Uses `OmrSymbol` / `OmrCurrency` for all pricing
- Uses `useLanguage()` for bilingual content and RTL
- Smooth scroll via anchor IDs for in-page navigation
- Intersection Observer for fade-in-on-scroll animations
- Mobile-first responsive with Tailwind breakpoints
- Iconsax icons for consistency with rest of app

