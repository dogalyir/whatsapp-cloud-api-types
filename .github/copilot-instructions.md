# GitHub Copilot Instructions

This project provides TypeScript type definitions for the WhatsApp Business Cloud API using Zod schemas.

## Runtime & Package Manager

**MANDATORY: Use Bun.sh exclusively** as both runtime and package manager for all operations.

- **Installation**: Install Bun from https://bun.sh
- **Local environment**: Bun is already installed. If `bun` or `bunx` commands aren't found in PATH, source them: `~/.bun/bin/bun` or `~/.bun/bin/bunx`
- **Never use npm, yarn, or pnpm** - all scripts and dependencies are managed with Bun

## Context7 Library Documentation

**Always use Context7 tools** when you need:
- Code generation for external libraries
- Setup or configuration steps
- Library/API documentation

Automatically invoke the Context7 MCP tools (`resolve-library-id` then `get-library-docs`) without waiting for explicit user requests.

## Project Architecture

This is a **TypeScript library package** that:
- Exports Zod schemas for WhatsApp Business Cloud API types
- Uses `bunup` for building (automatic TypeScript compilation with isolated declarations)
- Publishes only the `dist/` directory with `.js` and `.d.ts` files
- Follows strict TypeScript configuration with `isolatedDeclarations` enabled

### Key Files

- `src/index.ts` - Main entry point (currently has placeholder `greet` function - will contain Zod schemas)
- `dist/` - Build output (git-ignored, contains compiled `.js` and `.d.ts`)
- `package.json` - Exports under `"."` with dual type/default exports
- `tsconfig.json` - Strict TS config with `moduleResolution: "bundler"` and `verbatimModuleSyntax`

## Development Workflow

```bash
bun install              # Install dependencies
bun run dev              # Watch mode build (bunup --watch)
bun run build            # Production build (bunup)
bun run test             # Run tests with Bun's native test runner
bun run test:watch       # Watch mode testing
bun run lint:fix         # Fix formatting/linting with Biome
bun run type-check       # TypeScript type checking (tsc --noEmit)
```

**Pre-commit hooks** (via `simple-git-hooks`): Automatically run `lint` and `type-check` before commits.

## Code Style & Standards

- **Formatter**: Biome (replaces ESLint + Prettier)
  - Single quotes (`'`)
  - Semicolons only when needed (`asNeeded`)
  - Tab indentation (from `.editorconfig`)
- **EditorConfig**: Tab indents, LF line endings, UTF-8, trailing newline required
- **Module system**: ESM only (`"type": "module"`)
- **TypeScript strict mode** enabled with additional checks:
  - `noUncheckedIndexedAccess: true`
  - `isolatedDeclarations: true` (required for bunup)
  - `verbatimModuleSyntax: true`

## Testing Patterns

Use **Bun's native test runner** (not Jest/Vitest):

```typescript
import { expect, test } from 'bun:test'
import { greet } from '../src'

test('should greet correctly', () => {
  expect(greet('World')).toBe('Hello, World!')
})
```

## Building & Publishing

- **Build tool**: `bunup` (not tsc directly) - handles TypeScript compilation with proper declarations
- **Entry point**: Package exports both types and runtime under `"."` with conditional exports
- **Release process**: `bun run release` (uses `bumpp` for version bumping, commits, tags, pushes)
- **CI/CD**: GitHub Actions tests on Ubuntu/macOS/Windows, publishes to npm on tag push

## Commit Conventions

Follow **Conventional Commits**:
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation only
- `style:` Formatting (no code logic change)
- `refactor:` Code restructuring
- `perf:` Performance improvements
- `test:` Test changes
- `chore:` Tooling, dependencies

## Dependencies

**Peer dependency**: TypeScript ≥4.5.0 (optional)

**No runtime dependencies** - this is a pure type definition library that will use Zod (to be added as peer dependency when implementing schemas).