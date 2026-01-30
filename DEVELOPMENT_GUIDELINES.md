# Development Guidelines

This document outlines the development standards and workflow for the **Without Borders** project.

## 1. Technology Standards

- **Language**: strict **TypeScript** (no `any` if possible).
- **Styling**: **SCSS** modules or global SCSS with BEM naming where appropriate.
- **State Management**: **Zustand** for global game state.
- **Testing**: **Vitest** for unit and logic testing.

## 2. Implementation Workflow (Per Task)

For every task/feature (as defined in `task.md` or `IMPLEMENTATION_PLAN.md`), follow this cycle:

1.  **Define**: Understand the requirements.
2.  **Test**: Create or update a `*.test.ts` file for the core logic (e.g., pathfinding, scoring).
    - _Rule_: Logic must be verifiable via automated tests.
3.  **Implement**: Write the code.
    - Use strictly typed interfaces.
    - Keep core logic pure and separate from React components (`src/game-core`).
4.  **Verify**:
    - Run `npm test` to ensure green tests.
    - Manually verify UI changes if applicable.
5.  **Commit**: Create a git commit only AFTER verification passes.
    - Format: `type(scope): description` (e.g., `feat(map): implement pathfinding cost calculator`).

## 3. Directory Structure

- `src/game-core`: Pure TypeScript game logic (Pathfinding, Rules). **Testing Heavy**.
- `src/store`: Zustand stores (State containment).
- `src/ui`: React components (Visuals).
- `src/data`: Static game data (Maps, Cards).

## 4. Quality Checklist

- [ ] No linting errors.
- [ ] Tests pass.
- [ ] Types are clean.
