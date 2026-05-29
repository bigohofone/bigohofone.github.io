# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic/professional website for wonjunoh.com, deployed to GitHub Pages. Built with React + Vite + Tailwind v4 + shadcn/ui + framer-motion.

## Commands

- **Dev server:** `npm run dev` (runs on http://localhost:5173)
- **Build:** `npm run build`
- **Preview build:** `npm run preview`
- **Deploy to GitHub Pages:** `npm run deploy` (runs build first via `predeploy`)

## Architecture

- **Routing:** React Router v6. Check `src/` for route definitions.
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` plugin. shadcn/ui components in `src/components/ui/`.
- **Animation:** framer-motion for transitions and animations.
- **Data-driven content:** Resume/CV data lives in `src/data/`.
- **Internationalization:** Locale state (`en`/`ko`) via React Context.
