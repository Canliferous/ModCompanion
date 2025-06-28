# Mod companion

## Prerequisites

You need

- Node 22
- NPM

## Set up appconfig.json

Some sample assets are included in the repository. **Don't push any changes you make to those, like when converting assets, unintentionally**
```json
{
  "root": "./sample",
  "searchPath": "my_game"
}
```

Or set root to your Portal Revolution 2 repository and set searchPath to `revolution`
```json
{
  "root": "D:/Projects/...",
  "searchPath": "revolution"
}
```

## Install

```bash
npm ci
```

## Develop

```bash
# Start hot reloading
# Will run vite and tsc in watch mode to keep main and renderer up to date
npm run dev

# In another terminal:
# Start electron and listen to vite port
npm run run-dev
```

Caveats:

- `npm run dev` does not watch or reload changes to `preload.ts` or main assets. Restart the command when changing those

## Test production build without deploying
```bash
npm run build

npm run run-dist
```

## Deploy

```bash
npm run deploy
```