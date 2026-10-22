# Arrivo

A ride-hailing app built on top of Turborepo monorepo: an Expo / React Native mobile app and an Express + TypeScript API.

## Repository layout

```text
arrivo/
├── apps/
│   ├── api/        Express 5 + TypeScript backend
│   └── mobile/     Expo (React Native) app
├── packages/       reserved for shared code (currently empty)
├── .husky/         git hooks
├── commitlint.config.mjs
├── pnpm-workspace.yaml
└── turbo.json

```

- [`apps/api`](apps/api/README.md): backend setup, environment variables, endpoints
- [`apps/mobile`](apps/mobile/README.md): mobile app setup, styling, components

## Requirements

- Node.js 22.13 or newer
- pnpm 11 (`npm i -g pnpm`). The repo pins the package manager through `devEngines`, so pnpm fetches the declared version if yours differs.
- Git
- Android Studio with at least one Android Virtual Device (AVD)

### Android environment

`ANDROID_HOME` must point at your Android SDK, and `platform-tools` and `emulator` must be on your `PATH`. On Windows the default SDK location is `%LOCALAPPDATA%\Android\Sdk`.

Verify in a fresh terminal:

```bash
echo $ANDROID_HOME
adb --version
emulator -list-avds
```

## Getting started

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
```

Start an emulator (Android Studio → Device Manager, or `emulator -avd <name>`), wait for it to finish booting, then use two terminals:

```bash
pnpm api

```

```bash
pnpm android
```

The first `pnpm android` run asks to install the Expo Go version matching the project's SDK on the emulator. Answer yes.

Check the API:

```bash
curl http://localhost:4000/health
```

## Scripts

Run from the repository root.

| Command             | What it does                                        |
| ------------------- | --------------------------------------------------- |
| `pnpm api`          | Start the API in watch mode                         |
| `pnpm android`      | Start Expo and open the app on the Android emulator |
| `pnpm lint`         | ESLint in every package                             |
| `pnpm typecheck`    | TypeScript check in every package                   |
| `pnpm test`         | Run tests in every package                          |
| `pnpm build`        | Build every package that has a build script         |
| `pnpm format`       | Format the whole repo with Prettier                 |
| `pnpm format:check` | Check formatting without writing                    |

Run the mobile app in its own terminal. Expo's interactive keys don't work well when started through Turborepo.

## Git hooks

Installed automatically by `pnpm install` (the `prepare` script runs Husky).

| Hook                                                                                                                                                                                                           | Runs                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `pre-commit`                                                                                                                                                                                                   | lint-staged: ESLint (`--fix`) and Prettier on staged files, per app |
| `commit-msg`                                                                                                                                                                                                   | commitlint: Conventional Commits format                             |
| `pre-push`                                                                                                                                                                                                     | `pnpm typecheck`                                                    |
| Commit messages must look like `type(scope): subject`, for example `feat(api): add rider endpoint`. Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. |
| `git commit --no-verify` skips the hooks. Don't rely on hooks alone to protect the main branch.                                                                                                                |

## Things that will bite you

- **Use pnpm, not npm, at the repo root.** The root `package.json` declares pnpm in `devEngines`, so `npm pkg set` and similar commands fail with `EBADDEVENGINES`.
- **pnpm 11 blocks dependency build scripts by default.** If an install ends with `ERR_PNPM_IGNORED_BUILDS`, run `pnpm approve-builds` in Windows Terminal or PowerShell (the picker is interactive), then `pnpm install`. Approvals are stored in `pnpm-workspace.yaml` under `allowBuilds`.
- **pnpm settings live in `pnpm-workspace.yaml`,** not `.npmrc`. `nodeLinker: hoisted` is set there on purpose because Metro and pnpm's default layout don't get along.
- **Tailwind must stay on 3.x.** The mobile app uses NativeWind v4, which does not work with Tailwind 4. Never run `pnpm add tailwindcss@latest`.
- **The mobile app is pinned to Expo SDK 57.** NativeWind 4.2.7 supports the SDK 57 toolchain; compatibility with SDK 58 has not been verified. Don't upgrade the SDK without checking NativeWind first.
- **Clear the Metro cache** after changing `metro.config.js`, `tailwind.config.js`, `babel.config.js` or `global.css`: `pnpm --filter @arrivo/mobile exec expo start --android --clear`.
- **The Android emulator reaches your computer at `10.0.2.2`,** not `localhost`.
- **Line endings are forced to LF** by `.gitattributes`. Without it, Windows checkouts flip files to CRLF and `format:check` fails.
