# VigourCare - Healthcare Application

## Overview

VigourCare is a healthcare web application that helps users find nearby doctors and check medicine prices regulated by NPPA India. The application features doctor discovery with location-based sorting, consumer drug price lookup, user settings management, and authentication via Replit Auth.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state management
- **Styling**: Tailwind CSS with CSS variables for theming, shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with typed routes defined in shared/routes.ts
- **Validation**: Zod schemas for request/response validation
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Session Storage**: PostgreSQL-backed sessions table
- **Implementation**: Passport.js with openid-client strategy
- **Protected Routes**: Middleware-based authentication checks

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: shared/schema.ts (main tables), shared/models/auth.ts (auth tables)
- **Migrations**: Drizzle Kit with push command (db:push)

### Project Structure
```
├── client/          # React frontend
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── hooks/        # Custom React hooks
│       ├── pages/        # Route pages
│       └── lib/          # Utilities and query client
├── server/          # Express backend
│   ├── replit_integrations/auth/  # Replit Auth implementation
│   ├── routes.ts    # API route handlers
│   ├── storage.ts   # Database operations
│   └── db.ts        # Database connection
├── shared/          # Shared types and schemas
│   ├── schema.ts    # Drizzle database schemas
│   ├── routes.ts    # API route definitions
│   └── models/      # Data models
└── migrations/      # Database migrations
```

### Key Data Models
- **Users**: Managed by Replit Auth with profile extensions
- **Doctors**: Healthcare providers with location coordinates
- **DrugPrices**: NPPA-regulated medicine prices
- **UserSettings**: User preferences including location and theme

## External Dependencies

### Database
- **PostgreSQL**: Primary database via DATABASE_URL environment variable
- **connect-pg-simple**: Session storage in PostgreSQL

### Authentication
- **Replit Auth**: OpenID Connect provider (ISSUER_URL, REPL_ID environment variables)
- **SESSION_SECRET**: Required for session encryption

### Frontend Libraries
- **@radix-ui/***: Headless UI primitives for accessible components
- **@tanstack/react-query**: Async state management
- **framer-motion**: Animation library
- **wouter**: Lightweight routing
- **lucide-react**: Icon library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **drizzle-kit**: Database schema management