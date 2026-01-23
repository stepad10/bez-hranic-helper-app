# Implementation Plan - Without Borders

The goal is to implement the "Without Borders" boardgame as a playable local web application. The architecture must be modular and state-serializable to support future features like **Game Saving** and **Online Multiplayer**.

## User Review Required

> [!NOTE]
> **Map Data**: Proceeding with **Europe** map first. USA map support added as a future step.
> **Visualization**: Special connections (sea routes, non-standard borders) will be visualized on the map to aid players.

# Implementation Plan - Without Borders

The goal is to implement the "Without Borders" boardgame as a playable local web application. The architecture must be modular and state-serializable to support future features like **Game Saving** and **Online Multiplayer**.

## User Review Required

> [!NOTE]
> **Map Data**: Proceeding with **Europe** map first. USA map support added as a future step.
> **Visualization**: Special connections (sea routes, non-standard borders) will be visualized on the map to aid players.

## Architecture & Design Patterns

- **State Management**: Use `Zustand` with a serializable store. Game logic (stateless functions) should be separate from State (data).
- **Hexagonal-ish Style**: Core game logic (`src/game-core`) should be pure TS/JS, independent of React. React components (`src/ui`) merely render the state and dispatch actions.
- **DTOs**: Define clear `GameState` interfaces that can be easily JSON-serialized.

## UI Implementation Strategy

**Visual Style**: Premium, modern aesthetic using **SCSS**.
- **Layout**: "Sidebar + Map" layout. Sidebar for controls/stats, huge area for the Map.
- **Theme**: Clean "Travel App" look. White/Grays with vibrant accent colors for player tokens.

### Core UI Components (`src/ui`)
- **`Layout.tsx`**: Main grid container (Sidebar Left, Map Right).
- **`HUD/StatusPanel.tsx`**: Shows current Round (1-7), Phase (Dealing, Traveling), and Active Player.
- **`HUD/PlayerCard.tsx`**: Small card showing a player's Money, Color, and Avatar.
- **`OfferRail.tsx`**: Bottom or Top floating rail showing the 7 available Country Cards + Starting Country.
	- **`CountryCard.tsx`**: Visual representation of a card (Name, Image/Icon).
- **`MapOverlay.tsx`**: SVG/Canvas overlay on top of `GeoMap` to draw:
	- **Travel Lines**: Dashed lines connecting visited countries.
	- **Tokens**: Stacks of player tokens on countries.
	- **Special Connections**: Permanent lines for sea routes.
- **`Controls.tsx`**: Context-sensitive buttons (e.g., "Confirm Travel", "Next Phase").

## Proposed Changes

### 1. Data & Game State Structure

#### [NEW] `src/types/game.ts`
- Define `Player`, `GameState`, `RoundPhase` (Serializable).
- Define `GameAction` union type for Reducer-pattern handling.

#### [NEW] `src/store/gameStore.ts`
- Zustand store holding `GameState`.

### 2. Map & Adjacency Logic (Europe)

#### [NEW] `src/data/europeGraph.ts`
- Adjacency list based on `europe.topojson` + Rules overrides.
- Meta-data for connections (e.g., "Sea", "Bridge") for visualization.

#### [NEW] `src/game-core/pathfinding.ts`
- Pure function: `findShortestPath(start, end, graph)`.
- Pure function: `calculateJourneyCost(path, ...)`: Apply rules.

### 3. Game Loop & UI Wiring

#### [MODIFY] `src/App.tsx`
- Integrate `GameProvider` and `Layout`.

#### [NEW] `src/ui/*`
- Implement the components described in "UI Implementation Strategy".

### 4. Step-by-Step Implementation Strategy

#### Step 1: Adjacency & Map Interaction
- **Goal**: Click two countries, calculate cost. **Visualize Special Connections**.
- **Deliverable**:
    - Interactive Map with clickable countries.
    - SVG layer showing "Sea Routes" (e.g. dashed lines).
    - Sidebar showing selection & path cost.

#### Step 2: Round 1-2 Logic (Single Token)
- **Goal**: Full Part 1 gameplay logic.
- **Deliverable**: 7 cards dealt. Player places token. Cost calculated including "Stacking" and "Neighbor" penalties. UI shows cards in `OfferRail`.

#### Step 3: Part 2 & 3 (Multi-token)
- **Goal**: Logic for Rounds 3-6.
- **Deliverable**: Handling 2 tokens. Path A -> B -> C. Evaluation updates.

#### Step 4: Finale (Round 7) & Polish
- **Goal**: Inverse scoring and winning condition.
- **Deliverable**: Full 7-round game playable hot-seat.

#### Step 5: Future Expansion
- **Goal**: Add USA Map.
- **Deliverable**: `usa.topojson` integration and `usaGraph.ts`.

## Verification Plan

### Automated Tests
- **Unit Tests (`src/game-core/pathfinding.test.ts`)**:
    - Pure logic tests for pathing and scoring.
    - Serialization tests.

### Manual Verification
- **Scenario Testing**:
    - Verify special connection visualization (lines appear correctly).
    - UI responsiveness (Sidebar doesn't crunch map).
