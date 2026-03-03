# AGENTS.md

## Project Overview

Lumora is a React 19 + TypeScript single-page website built with Vite. It uses GSAP/Framer Motion for animations, Tailwind CSS for styling, and shadcn/ui (Radix primitives) for UI components. All site content is centralized in `src/config.ts`.

## Build / Lint / Test Commands

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start Vite dev server                     |
| `npm run build`   | Type-check (`tsc -b`) then production build (`vite build`) |
| `npm run lint`    | Run ESLint on the entire project          |
| `npm run preview` | Preview the production build locally      |

**No test framework is configured.** There are no test files, no test runner (Jest, Vitest, Playwright, etc.), and no test-related npm scripts. If you add tests, Vitest is the natural choice given the Vite toolchain.

### Type-checking only

```sh
npx tsc -b
```

### Linting a single file

```sh
npx eslint src/sections/Hero.tsx
```

## Project Structure

```text
src/
  main.tsx                 # Entry point (React 19 createRoot)
  App.tsx                  # Root component — composes all sections, registers GSAP ScrollTrigger
  config.ts                # ALL site content and data (interfaces + config constants)
  index.css                # Global styles, CSS variables, Tailwind directives, custom animations
  sections/                # Page section components (PascalCase filenames)
  components/              # Shared components (PascalCase filenames)
    ui/                    # ~54 shadcn/ui primitives (kebab-case filenames) — mostly generated
  hooks/                   # Custom React hooks
  lib/
    utils.ts               # cn() utility (clsx + tailwind-merge)
```

Path alias: `@/` maps to `src/` (configured in both `tsconfig.json` and `vite.config.ts`).

## Code Style Guidelines

### Two-tier code convention

The codebase has two distinct layers with slightly different formatting:

| Aspect         | Application code (sections/, components/, hooks/) | UI primitives (components/ui/)         |
| -------------- | ------------------------------------------------- | -------------------------------------- |
| Quotes         | Single quotes                                     | Double quotes                          |
| Semicolons     | Yes                                               | No                                     |
| Filenames      | PascalCase (`Hero.tsx`)                           | kebab-case (`alert-dialog.tsx`)        |
| Imports        | Relative paths (`'../config'`)                    | Path alias (`"@/lib/utils"`)          |
| Exports        | Inline `export function`                          | Grouped `export { A, B }` at bottom   |

**When writing new application code, follow the application code conventions (single quotes, semicolons, PascalCase filenames, relative imports).** When adding or modifying shadcn/ui components, follow the UI primitives conventions.

### Import ordering

1. React imports
2. Third-party libraries (gsap, motion, lucide-react, radix-ui)
3. Internal/local imports (config, utils, sibling components)

Use **named imports** everywhere except `gsap` (default import) and `App` in `main.tsx`.  
Use `import type` or inline `type` keyword for type-only imports (`verbatimModuleSyntax` is enabled).

### Naming conventions

| Category            | Convention                   | Examples                                        |
| ------------------- | ---------------------------- | ----------------------------------------------- |
| Components          | PascalCase                   | `Navigation`, `ParticleField`, `Hero`           |
| Custom hooks        | camelCase with `use` prefix  | `useMousePosition`, `useInView`                 |
| Interfaces          | PascalCase (noun-based)      | `SiteConfig`, `WorkItem`, `UseInViewOptions`    |
| Config objects      | camelCase + `Config` suffix  | `heroConfig`, `servicesConfig`                  |
| State / variables   | camelCase                    | `isScrolled`, `activeIndex`                     |
| Refs                | camelCase + `Ref` suffix     | `sectionRef`, `canvasRef`, `triggersRef`        |
| Event handlers      | `handle` prefix              | `handleMouseMove`, `handleSubmit`               |
| Constants           | UPPER_SNAKE_CASE             | `MOBILE_BREAKPOINT`                             |
| CSS selectors in JS | kebab-case strings           | `'.service-line'`, `'.logo-char'`               |

### Types

- **Prefer `interface` over `type`** for object shapes. Use `type` only for simple aliases or unions.
- **No enums.** Use string unions or CVA variants instead.
- Always provide generic type parameters for `useRef` and `useState`:
  ```tsx
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  ```
- Use `React.ComponentProps<"element">` (not `React.HTMLAttributes`) to extend native element props.

### Error handling

- Use **guard clauses with early returns**, not try/catch:
  ```tsx
  if (!heroConfig.title) return null;
  ```
- Check refs before DOM operations:
  ```tsx
  if (!sectionRef.current) return;
  ```
- Throw descriptive errors for hook misuse:
  ```tsx
  if (!ctx) throw new Error("useFormField should be used within <FormField>");
  ```

### Component patterns

- **One component per file.** Exception: compound UI primitives (e.g., `Card`/`CardHeader`/`CardContent`).
- **No barrel files** (`index.ts`). Import from the specific file directly.
- **Only `App.tsx` uses `export default`.** Everything else uses named exports.
- Section components check their config and return `null` when config is empty (auto-hiding pattern). The same guard is duplicated at the top of the component and inside its `useEffect`.
- All site content lives in `src/config.ts`. Never hardcode text in components.

### Animation and cleanup

- GSAP ScrollTrigger instances are stored in a ref array and killed in the `useEffect` cleanup:
  ```tsx
  const triggersRef = useRef<ScrollTrigger[]>([]);
  useEffect(() => {
    const trigger = ScrollTrigger.create({ ... });
    triggersRef.current.push(trigger);
    return () => {
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);
  ```
- Always cancel `requestAnimationFrame` and clear `setTimeout` in cleanup functions.
- Use `{ passive: true }` on scroll/mouse event listeners for performance.

### Styling

- Use Tailwind CSS utility classes. Combine with `cn()` from `@/lib/utils` (clsx + tailwind-merge).
- Use CVA (`class-variance-authority`) for component variants in the UI layer.
- The design is dark-themed with zero border-radius everywhere. Gold accent color: `#c9a55a`.
- Reduced-motion is supported via `prefers-reduced-motion` media query.

### TypeScript strictness

`tsconfig.app.json` enforces: `strict`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Do not relax these settings.

### ESLint

Flat config (`eslint.config.js`) extends `@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` recommended + `react-refresh`. The `react-refresh/only-export-components` rule is disabled for `src/components/ui/**/*.tsx`.

### Comments

- Brief inline comments for logic. Label JSX sections with `{/* Section name */}`.
- Use section divider blocks in config files:
  ```ts
  // ============================================================================
  // Hero Section Configuration
  // ============================================================================
  ```
- No JSDoc/TSDoc. No TODO/FIXME comments.
