# Konichiwa - Projects Portfolio

A lightweight, modern projects portfolio built with **Astro**, **React**, **Prisma + MongoDB**, **Tailwind CSS**, and **TanStack Query**.

## Features

- **Pixel-Accurate UI**: Matches reference designs including the crimson brush "Konichiwa" branding, clean 3x2 project grid, and rounded dialogs.
- **Prisma + MongoDB**: Native MongoDB integration with automatic ObjectId mapping.
- **Server Pagination**: Exactly 6 projects per page with smooth navigation.
- **TanStack Query (React Query)**: Client-side caching and instant cache invalidation on adding new projects.
- **Add Project Modal**: Tag chip input (press Enter/comma to add, click ✕ to remove), GitHub & live project link inputs with prefixes.
- **Graceful Fallback**: Beautiful preview seed cards render automatically when DB is initialising or connecting.

## Quick Start

1. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and set your MongoDB connection string (e.g. MongoDB Atlas):
   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/konichiwa?retryWrites=true&w=majority"
   ```

2. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```
