# @arrivo/mobile

Expo (React Native) + React Native Resuables (Shadcn for React Native) app for Arrivo.

## Stack

- Expo SDK 57, React Native 0.86, React 19.2
- Expo Router (file-based routing in `src/app`)
- TypeScript, strict
- NativeWind 4.2.7 with Tailwind CSS 3.4
- React Native Reusables (shadcn-style components copied into your source) on `@rn-primitives`
- ESLint with `eslint-config-expo`, formatted by Prettier from the repo root

## Running

From the repository root, with an Android emulator booted:

```bash
pnpm android
```

After changing Metro, Babel, Tailwind or CSS config, clear the cache:

```bash
pnpm --filter @arrivo/mobile exec expo start --android --clear
```

The app runs in Expo Go. Native modules that Expo Go doesn't include (for example Google Maps with an API key, or background location) will require a development build later.

## Source layout

```text
src
├── app/                 routes (_layout.tsx wraps the app and renders PortalHost)
├── components/ui/       Reusables components (created by the CLI)
└── lib/
    ├── utils.ts         cn() class merging helper
    └── theme.ts         theme colors as JS values
global.css               Tailwind directives and theme CSS variables
tailwind.config.js       Tailwind config mapped to the CSS variables
metro.config.js          NativeWind Metro integration
babel.config.js          NativeWind Babel preset
components.json          Reusables CLI configuration
```

The `@/` import alias maps to `src/`.

> Do not upgrade to Tailwind 4. NativeWind v4 requires Tailwind 3.

## Adding components

From `apps/mobile`:

```bash
pnpm dlx @react-native-reusables/cli@latest add <component>
pnpm dlx @react-native-reusables/cli@latest doctor
```

`doctor` reports missing or misconfigured setup files. It reports problems only; it does not fix them.

## Scripts

| Script      | What it does                                 |
| ----------- | -------------------------------------------- |
| `start`     | Start Metro                                  |
| `android`   | Start Metro and open on the Android emulator |
| `lint`      | `expo lint`                                  |
| `typecheck` | `tsc --noEmit`                               |

## Environment variables

Variables prefixed with `EXPO_PUBLIC_` are inlined into the JavaScript bundle at build time and are readable by anyone with the app. Never put secrets in them.

On the Android emulator, `localhost` is the emulator itself. Use `10.0.2.2` to reach services on your computer.
