# Tutor (tutor-front)

High-level React Native / Expo front-end for the Tutor app — a conversational tutor experience with voice playback, recording, and chat features.

## Table of contents
- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Available scripts](#available-scripts)
- [Project structure (high level)](#project-structure-high-level)
- [Testing & quality](#testing--quality)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

## Overview
The Tutor app frontend is a React Native mobile application that provides an interactive chat and voice interface for practising English with an AI tutor.

## Features
- Chat interface with the Tutor backend
- Voice playback of tutor responses
- Voice recording for user input
- Persisted user settings and authentication
- Works on Android, iOS, and web via Expo
- State management via Zustand

## Tech stack
- Expo (React Native)
- TypeScript
- expo-router
- Zustand (state management)
- Jest + @testing-library/react-native for tests

## Prerequisites
- Node.js (recommended LTS)
- npm (or yarn)
- Expo CLI (optional but recommended): npm install -g expo-cli
- Android Studio (for native emulators) or a physical device
- An instance of the Tutor backend (tutor-api) or an accessible API URL

## Quick start
1. Clone the repository:
   git clone https://github.com/farshadpart/tutor-front.git
2. Install dependencies:
   npm install
3. Create a .env file (see the Environment variables section).
4. Start Metro / Expo dev server:
   npm run start
5. Run on Android:
   npm run android

## Available scripts
(From package.json)
- npm run start — expo start
- npm run android — expo run:android
- npm run web — expo start --web
- npm run reset-project — node ./scripts/reset-project.js
- npm run lint — expo lint
- npm run typecheck — tsc -p tsconfig.json --noEmit
- npm run test — jest
- npm run verify — typecheck + lint + test
- npm run verify:no-tests — typecheck + lint

## Project structure (high level)
(Adapt based on the repository; example folders commonly used)
- /app or /src — app entry points, router, screens
- /components — reusable UI components
- /services or /api — HTTP and WebSocket client to tutor-api
- /store — Zustand stores
- /assets — images, fonts, etc.
- /scripts — helper scripts (reset-project.js)
- /__tests__ — unit & component tests

## Testing & quality
- Unit & component tests: npm run test
- Type checks: npm run typecheck
- Linting: npm run lint
- CI: Consider adding workflows to run `npm run verify` on push/PR

## Troubleshooting
- Metro hangs or cache issues:
  npx expo start -c
- Android emulator not starting: ensure Android Studio, SDKs, and ANDROID_HOME are configured.

## Resources
- Expo docs: https://docs.expo.dev
- React Native docs: https://reactnative.dev
- expo-router: https://expo.github.io/router
