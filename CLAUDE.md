# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic/professional website for wonjunoh.com, deployed to GitHub Pages. Built with React (Create React App). Currently only the Resume page (`/`) is active; Projects and Blog routes exist but are commented out in `src/route.js`.

## Commands

- **Dev server:** `npm start`
- **Build:** `npm run build`
- **Deploy to GitHub Pages:** `npm run deploy` (runs build first via `predeploy`)
- **Tests:** `npm run test`

## Architecture

- **Routing:** `src/route.js` defines a `routeConfig` array consumed by React Router v6 in `App.js`. Add new pages by adding entries here.
- **Global state:** `src/contexts/AppContext.jsx` provides locale (en/ko toggle) and viewport dimensions via React Context.
- **Data-driven content:** Resume sections are populated from plain JS objects in `src/data/` (profile, education, experience, publications, awards, contact). Each data file is re-exported through `src/data/content.js`.
- **Resume sections:** `src/components/resume/` contains section components (BioSection, EducationSection, ExperienceSection, PublicationSection, AwardSection) that receive data as props from `ResumePage`.
- **CV PDF generation:** `src/components/cv/cvPDF.jsx` uses `@react-pdf/renderer` to generate a downloadable CV.
- **Styles:** Plain CSS files in `src/assets/styles/`, imported directly in `App.js`. No CSS modules or preprocessors.
- **Internationalization:** Locale state (`en`/`ko`) lives in AppContext; components use `useAppContext()` to access it.
