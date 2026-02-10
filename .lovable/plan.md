

# Awasr Self-Care Portal — Complete Prototype

## Branding & Design
- **Primary Purple** `#B11F8D` for buttons, active states, accents
- **Primary Blue** `#0B8AD3` for links, secondary actions, info elements
- **Backgrounds**: White `#FFFFFF` + Light Gray `#F5F5F7`
- **Text**: Dark charcoal `#1A1A2E` headings, `#6B7280` secondary
- Clean, professional corporate telecom design — not AI-looking
- Awasr logo in header and login screen
- EN/AR bilingual with full RTL support

## Navigation & Layout

### Desktop/Tablet (≥768px)
- **Left sidebar** with Awasr logo at top, icon + label nav items, active state with purple left-border highlight, user info at bottom, collapsible to icon-only mini sidebar
- **Top header bar** with search, notification bell (with badge count), language toggle (EN/عربي), user avatar dropdown

### Mobile (<768px)
- **Bottom navigation bar** with 5 tabs: Home, Services, Pay, Support, More — active tab highlighted in purple, sticky at bottom
- **"More" tab** opens a **drawer** sliding up from bottom with remaining menu items (Profile, Network Status, Knowledge Base, Notifications, Logout)
- **Top header** simplified: Awasr logo + notification bell + avatar
- No sidebar on mobile at all

## Pages & Features

### 1. Login Screen
- Branded centered card with Awasr logo, gradient accent
- Phone/email + password fields, "Forgot Password" link
- "Sign In" button in brand purple
- Language toggle corner

### 2. Dashboard (Home)
- Welcome greeting ("Good morning, Ahmed")
- Summary cards: Current Balance with Pay Now, Data Usage circular progress, Active Services count
- Quick action buttons: Pay Bill, Raise Ticket, Track Order, View Plans
- Usage bar chart (Data, Voice, SMS for current month)
- Recent activity feed (last 5 items)
- Active promotions banner

### 3. My Services
- Tabbed view: Internet | TV | Voice | Bundles
- Service cards with plan name, speed, status badge, monthly cost
- Actions: Upgrade, Manage, Request Change
- Coverage/availability check section
- Add New Service button

### 4. Billing & Payments
- Outstanding balance banner with "Pay Now" CTA
- Invoice history table with download icons
- Payment method selection (Credit Card, Omannet, Apple Pay, Samsung Pay)
- Payment confirmation modal with receipt
- Recharge flow for prepaid
- Auto-pay toggle
- Promo code entry field

### 5. Service Requests & Changes
- Guided request flows (upgrade, downgrade, add-on, relocation)
- Category selection, form with notes/attachments
- Submission confirmation with reference number
- Request tracking with timeline

### 6. Support Ticketing
- "New Ticket" button at top
- Creation form: category, subject, description, priority, attachments
- Ticket list with status filters (All, Open, In Progress, Resolved, Closed)
- Ticket detail with conversation thread and reply box

### 7. Knowledge Base / FAQ
- Search bar + category cards (Internet, TV, Billing, Installation, Account, Troubleshooting)
- Article list and detail pages
- "Was this helpful?" feedback

### 8. Order & Installation Tracking
- Active orders with status chips
- Horizontal step progress bar (Placed → Confirmed → Scheduled → Technician Assigned → Installed → Active)
- Technician info card
- Order audit trail with timestamps

### 9. Network Status
- Regional status indicators (green/amber/red)
- Active outage alerts with estimated resolution
- Planned maintenance schedule
- "Notify me" toggles per region

### 10. Profile & Account Settings
- Personal info with edit capability
- Notification preferences (Email, SMS, Push toggles)
- Language preference (EN/AR)
- Linked payment methods
- Change password section
- Logout

### 11. Notifications Center
- Accessible from header bell icon
- Categories: Billing, Service, Outage, Ticket, Order updates
- Read/unread states, mark all as read

### 12. AI Chatbot Widget
- Floating chat button on all pages (bottom-right on desktop, above bottom nav on mobile)
- Conversational FAQ, support routing
- Live-agent handoff mock
- Chat transcript view

### 13. Product Catalog / E-Commerce
- Product browsing with categories and filters
- Plan comparison side-by-side view
- Product detail pages with specs, pricing, CTAs
- Mock checkout flow
- Lead capture forms ("Contact Sales", "Request a Quote")

### 14. Promotions & Campaigns
- Dashboard promotions banner
- Campaign landing page template
- Bundle offers display

## Mock Data
- Realistic Omani telecom data: customer "Ahmed Al-Balushi", Muscat address
- Fiber plans (100Mbps, 200Mbps), amounts in OMR
- 6-8 invoices, 3-4 tickets, 2 active services, 1 pending order
- Full Arabic translations for all content

## Quality
- 8px spacing grid, consistent typography
- Hover/active states on all interactive elements
- Skeleton loading states on page transitions
- Toast notifications for actions
- Form validation on all inputs
- Large tap targets on mobile
- Status visibility everywhere

