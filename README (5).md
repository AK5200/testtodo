# TaskFlow - FeedbackHub Test Customer App

A simple todo list SaaS application that demonstrates how a real customer would integrate FeedbackHub.

## Purpose

This app simulates a real FeedbackHub customer to test:
- **Guest Mode** - Anonymous feedback submission
- **Trust Mode** - Client-side user identification
- **JWT Mode** - Server-signed user verification (recommended)
- **Social Login** - OAuth authentication via FeedbackHub
- **SSO Redirect** - Redirect-based authentication

## Demo Users

| Email | Password | Plan | Company |
|-------|----------|------|---------|
| john@acmecorp.com | password123 | Pro | Acme Corp |
| sarah@techstartup.io | password123 | Enterprise | TechStartup |
| guest@example.com | password123 | Free | - |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# TaskFlow secret (can leave as default for testing)
JWT_SECRET=your-taskflow-secret

# FeedbackHub settings - get from your FeedbackHub dashboard
NEXT_PUBLIC_FEEDBACKHUB_URL=http://localhost:3000
NEXT_PUBLIC_FEEDBACKHUB_WORKSPACE=test-company
NEXT_PUBLIC_FEEDBACKHUB_BOARD_ID=<your-board-id>
FEEDBACKHUB_SSO_SECRET=<your-sso-secret>
```

### 3. Run the App

```bash
npm run dev
```

Open http://localhost:3001

## Testing FeedbackHub Integration

### Test 1: Guest Mode

1. Login to TaskFlow as any user
2. Set Auth Mode to "Guest" in the config panel
3. Click "Feedback" button
4. Submit feedback
5. **Verify in FeedbackHub**: Post shows as "Guest" with no user info

### Test 2: Trust Mode

1. Login as `john@acmecorp.com`
2. Set Auth Mode to "Trust"
3. Submit feedback
4. **Verify in FeedbackHub**: 
   - Shows "John Smith" with avatar
   - No verified badge
   - `widget_users.source = 'identified'`

### Test 3: JWT Mode (Recommended)

1. Login as `john@acmecorp.com`
2. Set Auth Mode to "JWT"
3. Enter your SSO Secret in config (or set in .env.local)
4. Submit feedback
5. **Verify in FeedbackHub**:
   - Shows "John Smith" with avatar
   - **✓ Verified badge** appears
   - `widget_users.source = 'verified_jwt'`
   - Custom attributes (plan, company) captured

## How JWT Mode Works

```
┌─────────────────────────────────────────────────────────────┐
│ TaskFlow (Customer App)                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User logs into TaskFlow                                  │
│     └─> Session cookie set                                   │
│                                                              │
│  2. User clicks "Feedback" button                            │
│     └─> Frontend requests: GET /api/feedbackhub-token        │
│                                                              │
│  3. TaskFlow backend:                                        │
│     - Gets user from session                                 │
│     - Signs JWT with FEEDBACKHUB_SSO_SECRET                  │
│     - Returns token to frontend                              │
│                                                              │
│  4. Frontend sends to FeedbackHub:                           │
│     POST /api/widget/feedback                                │
│     { identified_user: { ssoToken: "eyJ..." } }              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ FeedbackHub                                                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  5. FeedbackHub backend:                                     │
│     - Verifies JWT signature with stored SSO secret          │
│     - Extracts user data (id, email, name, etc.)             │
│     - Creates/updates widget_user with source='verified_jwt' │
│     - Creates post linked to widget_user                     │
│     - Shows ✓ Verified badge in UI                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## API Endpoints

### TaskFlow Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login user, returns session cookie |
| `/api/auth/logout` | POST | Clear session cookie |
| `/api/auth/me` | GET | Get current user |
| `/api/feedbackhub-token` | GET | Generate FeedbackHub SSO token |

### FeedbackHub Endpoint (called by this app)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/widget/feedback` | POST | Submit feedback with user identification |

## Deployment

### Deploy to Vercel

```bash
vercel
```

Set environment variables in Vercel dashboard:
- `JWT_SECRET`
- `NEXT_PUBLIC_FEEDBACKHUB_URL` (your production FeedbackHub URL)
- `NEXT_PUBLIC_FEEDBACKHUB_WORKSPACE`
- `NEXT_PUBLIC_FEEDBACKHUB_BOARD_ID`
- `FEEDBACKHUB_SSO_SECRET`

## Files Structure

```
taskflow-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login endpoint
│   │   │   ├── logout/route.ts   # Logout endpoint
│   │   │   └── me/route.ts       # Current user endpoint
│   │   └── feedbackhub-token/
│   │       └── route.ts          # Generate FeedbackHub SSO token
│   ├── dashboard/
│   │   └── page.tsx              # Main app with todos + feedback widget
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Redirect to login/dashboard
├── lib/
│   └── auth.ts                   # Auth helpers + FeedbackHub token generation
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

## Production Checklist

Before deploying TaskFlow (or any real customer app):

- [ ] Replace demo users with real database
- [ ] Use secure JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Configure proper CORS on FeedbackHub
- [ ] Set FEEDBACKHUB_SSO_SECRET from FeedbackHub dashboard
- [ ] Update NEXT_PUBLIC_FEEDBACKHUB_URL to production URL
