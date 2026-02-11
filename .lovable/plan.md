
# Landing Page Visual Upgrade -- More Beautiful, Elegant, and Modern

## Overview
Elevate the landing page from "clean but generic" to a premium, editorial-quality telecom website. The changes focus on visual depth, better whitespace rhythm, richer typography hierarchy, and subtle polish that separates professional design from AI-generated layouts.

## Key Design Changes

### 1. Hero Section -- Cinematic Depth
- Add a large, softly animated gradient orb/mesh behind the hero text (CSS-only, using layered radial gradients with a slow drift animation)
- Increase hero padding significantly for more breathing room (pt-24 pb-28 on mobile, pt-32 pb-36 on desktop)
- Make the headline larger on desktop (text-7xl to text-8xl) with tighter letter-spacing (-0.03em) for a more editorial feel
- Add a subtle frosted-glass "speed pill" badge above the headline (e.g., "Up to 1 Gbps" in a translucent white chip)
- Animate the stats row in with a staggered delay

### 2. Plans Section -- Card Elevation
- Add a subtle gradient background to the section (very light radial gradient from center)
- Increase card padding from p-5 to p-6
- Make speed numbers larger (text-4xl) with a lighter font weight for elegance
- Add a thin gradient top-border on the popular card instead of just a ring
- Improve the contract toggle with a smoother pill design and transition animation
- Add subtle hover glow effect on plan cards (colored shadow matching primary/secondary)

### 3. Features Section -- Asymmetric Grid
- Change from a uniform 3-column grid to a 2-column layout on desktop where the first item spans full width as a "hero feature" card with larger text
- Increase icon container size from h-10 w-10 to h-12 w-12 with a softer gradient background
- Add a subtle border to feature cards for definition
- Increase vertical spacing between the section header and grid

### 4. Coverage Section -- Cleaner Visual
- Add subtle pulsing animation to the green status dots for "operational" regions
- Increase card height slightly with better padding
- Add a light gradient background behind the coverage grid

### 5. CTA Banner -- More Dramatic
- Add a layered mesh gradient background instead of flat gradient-primary
- Increase padding for more grandeur
- Make buttons slightly larger with rounded-xl for a softer, modern feel

### 6. Navbar -- Glass Morphism
- When scrolled, use a stronger backdrop-blur with semi-transparent background
- Add a very subtle bottom shadow instead of just a border

### 7. Footer -- Refined Spacing
- Increase vertical padding
- Add a subtle separator between footer columns on mobile
- Softer, more muted color palette for footer text

### 8. Global Polish
- Add smooth fade-in keyframe animation to CSS for staggered reveal effects
- Increase Reveal animation distance from translate-y-5 to translate-y-8 for more dramatic entrance
- Add a subtle grain/noise texture overlay on the hero (CSS only, very low opacity)

## Technical Details

### Files Modified
- **`src/pages/LandingPage.tsx`** -- All visual changes to hero, plans, features, coverage, CTA, navbar, and footer sections
- **`src/index.css`** -- Add new CSS utilities: gradient mesh animation keyframes, grain texture, pulsing dot animation, staggered fade-in delays

### New CSS Utilities (in index.css)
- `.gradient-mesh` -- layered radial gradient with slow CSS animation for hero background
- `.animate-pulse-dot` -- subtle scale pulse for status indicators
- `.glass-nav` -- backdrop-blur + transparent bg + subtle shadow for scrolled navbar
- Staggered animation delay utilities (`.delay-100`, `.delay-200`, etc.)

### No New Dependencies
All changes use pure CSS and Tailwind utilities already available in the project.
