# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 言語設定

Claude Codeはこのリポジトリで作業する際、**日本語で回答**してください。

## Project Architecture

This is a full-stack React application that runs on Cloudflare Workers, combining:
- **Frontend**: React 19 + Vite with Tailwind CSS
- **Backend**: Hono.js framework running on Cloudflare Workers
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **Styling**: Tailwind CSS v4 with CSS variables

### Key Structure
- `src/react-app/` - React frontend application
- `src/worker/` - Hono backend API running on Cloudflare Workers
- `src/lib/` - Shared utilities

### Dual Environment Setup
The app runs as both a traditional SPA and a Cloudflare Worker:
- Frontend assets are served from `/dist/client`
- API routes are handled by the Hono worker at `/api/*`
- Single-page application routing is configured for client-side navigation

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (frontend + worker)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Cloudflare Workers
npm run deploy

# Type checking and build validation
npm run check

# Generate Cloudflare Worker types
npm run cf-typegen
```

## Code Quality & Formatting

Uses Biome for linting and formatting:
```bash
# Lint and auto-fix
npm run lint

# Format code
npm run format

# Check and fix everything
npm run biome-check
```

Pre-commit hooks via lefthook automatically run Biome checks on staged files.

## Styling Guidelines

- Uses Tailwind CSS v4 (not v3) with the new Vite plugin
- Path alias `@/` maps to `src/`

## Worker Configuration

- Entry point: `src/worker/index.ts`
- Compatibility date: 2025-04-01
- Node.js compatibility enabled
- Assets served from `dist/client` with SPA routing
- Observability and source maps enabled

## TypeScript Configuration

Multiple tsconfig files for different contexts:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - React app specific
- `tsconfig.worker.json` - Worker specific
- `tsconfig.node.json` - Node.js tooling