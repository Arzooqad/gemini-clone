# Gemini-Style Chat Frontend

A responsive, Gemini-inspired conversational UI built with React + TypeScript + Tailwind. Implements OTP auth simulation, chatroom management, AI-like replies, reverse infinite scroll, pagination, image uploads, toasts, dark mode, and local persistence.

## Live

Add your deployment link here.

## Stack

- React 19 + TypeScript
- Redux Toolkit for state management
- React Hook Form + Zod for validation
- Tailwind CSS for styling (dark mode enabled)
- React Router for routing
- react-hot-toast for toasts
- lodash.debounce for search UX
- dayjs for time formatting
- uuid for ids

## Setup

1. Install deps:

```bash
yarn
# or
npm install
```

2. Start dev server:

```bash
yarn start
# or
npm run start
```

## Features

- Authentication
  - OTP-based flow with country code select (fetched from `restcountries.com`)
  - Simulated send/verify via `setTimeout`
  - Validation with React Hook Form + Zod
- Dashboard
  - List, create, and delete chatrooms
  - Debounced search
  - Toast confirmations
- Chatroom Interface
  - User and AI messages, timestamps
  - Typing indicator: "Gemini is typing..."
  - Simulated AI reply with throttling
  - Auto-scroll to latest
  - Reverse infinite scroll + client pagination (20 per batch simulated)
  - Image upload with preview URL
  - Copy-to-clipboard on hover
  - Loading skeletons
- Global UX
  - Mobile responsive
  - Dark mode toggle (persisted)
  - LocalStorage persistence for auth and chat
  - Keyboard accessibility

## Project Structure

- `src/pages/*`: `AuthPage`, `DashboardPage`, `ChatPage`
- `src/components/*`: layout shell, dark toggle, search; chat subcomponents
- `src/redux/*`: store + slices for auth and chat
- `src/api/*`: REST Countries helper
- `src/hooks/*`: dark mode, localStorage, debounce
- `src/utils/*`: storage, clipboard
- `src/types.ts`: app-wide types

## Implementation Notes

- Throttling: A cooldown flag prevents rapid AI responses; delays are randomized to simulate thinking.
- Pagination/Infinite Scroll: `ChatList` triggers `loadOlder()` near top; older batches are prepended and `hasMore` stops after ~200 messages.
- Validation: Zod schemas power both phone and OTP steps.
- Persistence: Entire Redux state is saved to LocalStorage on changes and rehydrated on load.

## Screenshots

Add screenshots of light/dark modes and chat interactions.
