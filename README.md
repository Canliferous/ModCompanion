# Mod companion

## Prerequisites

You need

- Node 22
- NPM

## Install

```bash
npm ci
```

## Develop

```bash
# Start hot reloading
# Will run vite and tsc in watch mode to keep main and renderer up to date
npm run dev

# Start electron and listen to vite port
npm run run-vite
```

## Test production build without deploying
```bash
npm run build

npm run run-prod
```

## Deploy

```bash
npm run deploy
```