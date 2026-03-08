# Mod companion

Modder's best friend <3

## Prerequisites

You need

- Node 22
- NPM

## Set up appconfig.json

Some sample assets are included in the repository. **Don't push any changes you make to those, like when converting assets, unintentionally**

To use the sample, duplicate `appconfig.sample.json` as `appconfig.json`

Or if you want to use real data, set root to your Portal Revolution 2 repository and set searchPath to `revolution`
```json
{
  "root": "D:/Projects/...",
  "searchPath": "revolution"
}
```

## Install

```bash
# --workspaces is very important to make sure you're installing the dependencies for all packages
npm ci --workspaces
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

## Package overview

Mod companion is split into a whole load of individual npm packages. It used to just be one, but has been split apart to allow for a headless CLI application to exist that doesn't depend on Electron

1. Shared - Pure typescript that can run in browsers and node. Runtime agnostic. Renderer, main, core and CLI all depend on this. Put shared type definitions and small pieces of logic code here that every part of the app needs
2. Core - Nodejs code that is shared by main and cli
3. Main - The Electron main process. Should be a minimal layer that maps features from Core to Electron APIs
4. Renderer - The Electron renderer process. Features browser code