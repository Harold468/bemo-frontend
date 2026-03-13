# Mock Database – JSON Data Structures

This document describes the JSON-like data structures used to simulate a database in the Bemo app. Data is stored either in **AsyncStorage** (key-value) or as **inline mock arrays** in components.

---

## 1. Storage (AsyncStorage / Key-Value)

**Location:** `lib/storage.ts`  
**Backend:** AsyncStorage (native) or in-memory Map (fallback)

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `gameName` | `string` | `'Player'` | User's display name |
| `avatarId` | `string` | `'1'` | Avatar index (1–8) |
| `initialDeposit` | `string` | `''` | Initial deposit amount |
| `paymentMethod` | `string` | `'bank'` | `'bank'` or `'card'` |

**Avatars (constant):**
```json
["🦁", "🐯", "🐻", "🦊", "🐼", "🐨", "🦅", "🐺"]
```

---

## 2. User Balance

**Location:** `app/(tabs)/index.tsx` (inline constant)

```json
1250.75
```

**Fields:** Single number (current balance in dollars)

---

## 3. Recent Games

**Location:** `app/(tabs)/index.tsx`

```json
[
  { "id": 1, "date": "Mar 11", "opponent": "Player1", "result": "win", "amount": 50 },
  { "id": 2, "date": "Mar 10", "opponent": "Player2", "result": "loss", "amount": -30 },
  { "id": 3, "date": "Mar 9", "opponent": "Player3", "result": "win", "amount": 75 },
  { "id": 4, "date": "Mar 8", "opponent": "Player4", "result": "draw", "amount": 0 }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique ID |
| `date` | `string` | Date (e.g. `"Mar 11"`) |
| `opponent` | `string` | Opponent name |
| `result` | `string` | `"win"` \| `"loss"` \| `"draw"` |
| `amount` | `number` | Winnings/losses (positive = win, negative = loss, 0 = draw) |

---

## 4. Participants

**Location:** `app/(tabs)/index.tsx`

```json
[
  { "id": 1, "name": "Player1", "avatar": "🦁", "status": "online" },
  { "id": 2, "name": "Player2", "avatar": "🐯", "status": "offline" },
  { "id": 3, "name": "Player3", "avatar": "🐻", "status": "online" },
  { "id": 4, "name": "Player4", "avatar": "🦊", "status": "offline" },
  { "id": 5, "name": "Player5", "avatar": "🐼", "status": "online" }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique ID |
| `name` | `string` | Display name |
| `avatar` | `string` | Emoji avatar |
| `status` | `string` | `"online"` \| `"offline"` |

---

## 5. Games (Available Games)

**Location:** `app/(tabs)/index.tsx`

```json
[
  {
    "id": "tictactoe",
    "name": "Tic Tac Toe",
    "icon": "grid-outline",
    "color": ["#a855f7", "#7c3aed"],
    "description": "Multiplayer"
  },
  {
    "id": "cointoss",
    "name": "Coin Toss",
    "icon": "cash-outline",
    "color": ["#f59e0b", "#d97706"],
    "description": "Win 2x"
  },
  {
    "id": "cupshuffle",
    "name": "Cup Shuffle",
    "icon": "wine-outline",
    "color": ["#10b981", "#059669"],
    "description": "Win 3x"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Game ID (`tictactoe` \| `cointoss` \| `cupshuffle`) |
| `name` | `string` | Display name |
| `icon` | `string` | Ionicons name |
| `color` | `string[]` | [Primary, secondary] hex colors |
| `description` | `string` | Short description |

---

## 6. Transactions

**Location:** `app/(tabs)/transactions.tsx`

```json
[
  { "id": 1, "date": "Mar 12, 2026", "type": "deposit", "description": "Deposit via Bank", "amount": 500 },
  { "id": 2, "date": "Mar 11, 2026", "type": "game", "description": "Game vs Player1", "amount": 50 },
  { "id": 3, "date": "Mar 10, 2026", "type": "game", "description": "Game vs Player2", "amount": -30 },
  { "id": 4, "date": "Mar 9, 2026", "type": "withdraw", "description": "Withdrawal to Bank", "amount": -200 },
  { "id": 5, "date": "Mar 9, 2026", "type": "game", "description": "Game vs Player3", "amount": 75 },
  { "id": 6, "date": "Mar 8, 2026", "type": "deposit", "description": "Deposit via Card", "amount": 300 },
  { "id": 7, "date": "Mar 7, 2026", "type": "game", "description": "Game vs Player5", "amount": -45 },
  { "id": 8, "date": "Mar 6, 2026", "type": "game", "description": "Game vs Player6", "amount": 60 }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique ID |
| `date` | `string` | Full date (e.g. `"Mar 12, 2026"`) |
| `type` | `string` | `"deposit"` \| `"withdraw"` \| `"game"` |
| `description` | `string` | Short description |
| `amount` | `number` | Positive = credit, negative = debit |

---

## 7. Stats (Overall Statistics)

**Location:** `app/(tabs)/stats.tsx`

```json
[
  { "metric": "Total Games", "value": "24" },
  { "metric": "Games Won", "value": "14" },
  { "metric": "Games Lost", "value": "8" },
  { "metric": "Games Drawn", "value": "2" },
  { "metric": "Win Rate", "value": "58.3%" },
  { "metric": "Total Winnings", "value": "$850" },
  { "metric": "Total Losses", "value": "$315" },
  { "metric": "Net Profit", "value": "$535" },
  { "metric": "Avg Win Amount", "value": "$60.71" },
  { "metric": "Avg Loss Amount", "value": "$39.38" },
  { "metric": "Best Opponent", "value": "Player3" },
  { "metric": "Current Streak", "value": "2 Wins" }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `metric` | `string` | Stat label |
| `value` | `string` | Stat value (formatted) |

---

## 8. Opponent Stats

**Location:** `app/(tabs)/stats.tsx`

```json
[
  { "opponent": "Player1", "games": 5, "won": 3, "lost": 2, "drawn": 0 },
  { "opponent": "Player2", "games": 4, "won": 2, "lost": 1, "drawn": 1 },
  { "opponent": "Player3", "games": 6, "won": 4, "lost": 2, "drawn": 0 },
  { "opponent": "Player4", "games": 3, "won": 2, "lost": 1, "drawn": 0 },
  { "opponent": "Player5", "games": 4, "won": 2, "lost": 1, "drawn": 1 },
  { "opponent": "Player6", "games": 2, "won": 1, "lost": 1, "drawn": 0 }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `opponent` | `string` | Opponent name |
| `games` | `number` | Total games played |
| `won` | `number` | Games won |
| `lost` | `number` | Games lost |
| `drawn` | `number` | Games drawn |

---

## 9. Optional: Standalone JSON Files

To use JSON files instead of inline data, create `data/` and import:

```ts
// data/recentGames.json
[
  { "id": 1, "date": "Mar 11", "opponent": "Player1", "result": "win", "amount": 50 }
]

// Usage
import recentGames from '@/data/recentGames.json';
```

---

## 10. Summary

| Data | Location | Storage |
|------|----------|---------|
| Profile (gameName, avatarId, etc.) | `lib/storage.ts` | AsyncStorage |
| Balance | `app/(tabs)/index.tsx` | Inline constant |
| Recent Games | `app/(tabs)/index.tsx` | Inline array |
| Participants | `app/(tabs)/index.tsx` | Inline array |
| Games | `app/(tabs)/index.tsx` | Inline array |
| Transactions | `app/(tabs)/transactions.tsx` | Inline array |
| Stats | `app/(tabs)/stats.tsx` | Inline array |
| Opponent Stats | `app/(tabs)/stats.tsx` | Inline array |
