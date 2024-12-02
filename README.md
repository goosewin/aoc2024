# Advent of Code 2024 Solutions

Solutions runner for Advent of Code 2024 puzzles, built with Typescript and Bun.

## Prerequisites

- [Bun](https://bun.sh)
- [Node.js](https://nodejs.org) 18+

## Setup

1. Clone this repository
2. Install dependencies:

    ```shell
    bun install
    ```

## Project Structure

```
.
├── src/
│   ├── XX-solution.ts    # Daily solution files (XX = day number)
│   ├── XX-input          # Daily input files
│   ├── XX-problem.md     # Problem descriptions
│   └── common.ts         # Shared utilities
├── index.ts              # CLI runner
└── package.json
```

## Usage

### Run solution for a specific day

```shell
# Run both parts for a day
bun start 1

# Run a specific part
bun start 1 --part 1
bun start 1 -p 2
```

### Run all solutions

```shell
bun start
```

## Solution Format

Each daily solution should be placed in the `src` directory following the naming convention `XX-solution.ts` (where XX is the zero-padded day number). Solutions use the `withTiming` wrapper to automatically measure and display execution time.

Example solution file (`01-solution.ts`):

```ts
import { readInput, withTiming } from "./common";

export const part1 = async () => withTiming(async () => {
    const input = await readInput("01");
    // Solution implementation
    return result;
});

export const part2 = async () => withTiming(async () => {
    const input = await readInput("01");
    // Solution implementation
    return result;
});
```

## Features

- 🚀 Fast execution with Bun runtime
- 📊 Automatic performance timing for solutions
- 🎯 Run specific parts or days
- 🔄 Automatic input file loading
- 💪 TypeScript support
- 📝 Common utilities for parsing and timing

## License

MIT
