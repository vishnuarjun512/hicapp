# Hicapp Frontend

The frontend application for **Hicapp**, a social and messaging application.

The frontend is built with **Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Zustand, and WebSockets**.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [API Architecture](#api-architecture)
- [WebSocket Architecture](#websocket-architecture)
- [Messaging](#messaging)
- [Message Pagination](#message-pagination)
- [Scroll Pagination](#scroll-pagination)
- [Posts & Media](#posts--media)
- [UI System](#ui-system)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Development Workflow](#development-workflow)

---

## Overview

Hicapp is a social application with features including:

- User authentication
- Social posts
- Post images
- Conversations
- Real-time messaging
- Message history
- Read/seen state
- File uploads
- Responsive application UI

The frontend communicates with the backend using:

- REST APIs
- WebSockets

---

## Architecture

```text
                         HICAPP FRONTEND
                               │
               ┌───────────────┴───────────────┐
               │                               │
             REST                          WebSocket
               │                               │
               ▼                               ▼
          API Functions                  WebSocketProvider
               │                               │
               └───────────────┬───────────────┘
                               │
                               ▼
                          Zustand Stores
                               │
                               ▼
                         React Components
                               │
                               ▼
                              UI
```

---

## Tech Stack

| Technology   | Purpose                     |
| ------------ | --------------------------- |
| Next.js      | React application framework |
| React        | UI                          |
| TypeScript   | Type safety                 |
| Tailwind CSS | Styling                     |
| shadcn/ui    | UI components               |
| Zustand      | Global state management     |
| Lucide React | Icons                       |
| WebSocket    | Real-time communication     |
| AWS S3       | Media storage               |

---

## Project Structure

The frontend follows a component and feature-oriented structure.

A simplified representation:

```text
src/
│
├── app/
│   └── Application routes
│
├── components/
│   ├── ui/
│   │   └── shadcn components
│   │
│   └── Application components
│
├── lib/
│   ├── stores/
│   │   ├── auth-store.ts
│   │   └── message-store.ts
│   │
│   ├── (apiCalls)/
│   │   ├── useApi
│   │   └── API modules
│   │
│   └── types/
│
└── ...
```

The exact structure can evolve as the application grows.

---

## State Management

Hicapp uses **Zustand** for application state.

Important stores include:

```text
auth-store
message-store
```

---

## Message Store

The message store maintains conversation state.

Conceptually:

```ts
type MessageState = {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  hasMoreMessages: Record<string, boolean>;
  activeConversationId: string | null;
};
```

Messages are stored by conversation:

```text
messagesByConversation
│
├── conversation-A
│     ├── message
│     ├── message
│     └── message
│
└── conversation-B
      ├── message
      └── message
```

This allows multiple conversations to retain their loaded state.

---

## API Architecture

API calls are separated from UI components.

Instead of writing raw `fetch()` calls throughout components, the frontend uses API modules and the `useApi()` abstraction.

Example:

```text
Component
   │
   ▼
getConversationMessages()
   │
   ▼
useApi()
   │
   ▼
Hicapp Backend
```

This keeps network logic separate from UI logic.

---

## WebSocket Architecture

The frontend maintains a WebSocket connection through:

```text
WebSocketProvider
```

The provider is responsible for:

- Establishing the WebSocket connection
- Receiving events
- Sending events
- Updating Zustand
- Handling connection state

Architecture:

```text
Backend WebSocket
       │
       ▼
WebSocketProvider
       │
       ├── New message
       │       ↓
       │   receivedMessage()
       │
       └── Read state
               ↓
       updateParticipantReadState()
```

---

## Messaging

The messaging interface is divided into:

```text
MessagesPage
│
├── ConversationList
│
└── ChatWindow
      │
      ├── MessageList
      │
      └── MessageInput
```

### MessagesPage

Responsible for:

- Selected conversation
- Initial message loading
- Conversation selection
- Read state
- Connecting message-related UI

### ConversationList

Displays available conversations.

### ChatWindow

Contains the active conversation interface.

### MessageList

Responsible for:

- Rendering messages
- Message grouping
- Date separators
- Read/seen indicators
- Older-message pagination
- Scroll behavior
- Message actions

### MessageInput

Responsible for:

- Text input
- Sending messages
- Attachment actions
- Multiline input behavior

---

## Message Pagination

The frontend uses cursor-based pagination.

The initial request loads the newest messages:

```text
GET /conversations/:id/messages?limit=10
```

When the user scrolls to the top:

```text
GET /conversations/:id/messages?limit=10&prevMessageID=<oldest-message-id>
```

The returned messages are prepended to the existing messages.

```text
Before:

[11 12 13 14 15 16 17 18 19 20]


After loading older messages:

[01 02 03 04 05 06 07 08 09 10]
[11 12 13 14 15 16 17 18 19 20]
```

The backend response contains:

```json
{
  "messages": [],
  "hasMore": true
}
```

The frontend stores `hasMore` separately:

```ts
hasMoreMessages[conversationId];
```

This prevents additional requests once the backend reports that no older messages remain.

---

## Scroll Pagination

The message list monitors the scroll container.

When the user approaches the top:

```text
scrollTop <= threshold
```

the component checks:

```text
Is another pagination request running?
        │
        ├── YES → stop
        │
        └── NO
             │
             ▼
        Are more messages available?
             │
             ├── NO → stop
             │
             └── YES
                  │
                  ▼
             Fetch older messages
```

A loading lock prevents multiple requests from being triggered by repeated scroll events.

The frontend also preserves the user's viewport when older messages are prepended so that loading history does not unexpectedly move the user.

---

## Real-Time Messaging

New messages do not require the message-history REST endpoint.

Instead:

```text
User A
  │
  │ WebSocket
  ▼
Backend
  │
  │ WebSocket
  ▼
User B
```

The frontend receives the event through `WebSocketProvider`.

The event is then passed to:

```ts
receivedMessage();
```

which updates the Zustand message store.

This allows the UI to update without manually refetching the conversation.

---

## Read / Seen

When the active conversation is open, the frontend sends:

```text
conversation:read(frontend->backend)
```

through the WebSocket.

The backend updates the participant's read timestamp and broadcasts:

```text
conversation:read(backend->frontend)
```

The frontend updates the conversation state through:

```ts
updateParticipantReadState();
```

The message list uses this state to determine where the Seen indicator should appear.

---

## Posts & Media

Posts can contain multiple images.

The frontend requests upload information from the backend and then uploads files directly to AWS S3.

```text
Frontend
   │
   │ Request upload URL
   ▼
Backend
   │
   │ Presigned URL
   ▼
Frontend
   │
   │ PUT
   ▼
AWS S3
```

The resulting file URL is then associated with the post through the backend.

---

## UI System

Hicapp uses **Tailwind CSS** for styling and **shadcn/ui** as the base component system.

Common components include:

- Button
- Card
- Avatar
- Input
- DropdownMenu

**Lucide React** is used for interface icons.

The UI is built using reusable React components rather than placing the entire application interface into individual page components.

---

## Authentication

Authentication state is maintained through the authentication store.

The backend uses HttpOnly cookies for authentication.

The frontend therefore does not need to manually expose the JWT to application JavaScript.

Conceptually:

```text
Login
  ↓
Backend
  ↓
HttpOnly cookie
  ↓
Browser
  ↓
Authenticated API requests
```

---

## Environment Variables

Create a local environment file.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

Production values should point to the deployed backend.

Do not commit environment files containing secrets.

---

## Running Locally

### 1. Clone the repository

```bash
git clone <repository-url>
cd hicapp-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

### 4. Start the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

## Development Workflow

A typical frontend feature follows:

```text
1. Define feature requirements
        ↓
2. Create / update TypeScript types
        ↓
3. Add API function
        ↓
4. Update Zustand state if necessary
        ↓
5. Build React component
        ↓
6. Connect REST / WebSocket events
        ↓
7. Add loading / error states
        ↓
8. Test UI behavior
```

---

## Frontend ↔ Backend Communication

The complete application communication model is:

```text
                    HICAPP

        ┌───────────────────────────┐
        │        Next.js            │
        │                           │
        │ React Components          │
        │       ↓                   │
        │ Zustand                   │
        │       ↓                   │
        │ API / WebSocket           │
        └────────────┬──────────────┘
                     │
              ┌──────┴──────┐
              │             │
             REST        WebSocket
              │             │
              ▼             ▼
        ┌────────────────────────┐
        │    Node.js Backend     │
        │                        │
        │ Controllers            │
        │ Services               │
        │ PostgreSQL             │
        │ WebSocket Server       │
        └───────────┬────────────┘
                    │
              ┌─────┴─────┐
              │           │
              ▼           ▼
         PostgreSQL      S3
```

---

## Project Goals

Hicapp is being developed as a full-stack social application with an emphasis on:

- Real-time communication
- Scalable message history
- Clean backend architecture
- Relational data modeling
- Direct cloud media uploads
- Component-based frontend development
- Strong client-side state management
- Type-safe frontend development
