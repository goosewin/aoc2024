import type { Grid, Point } from "./common";
import { findInGrid, getGridValue, isValidPoint, parseGrid, readInput, setGridValue, withTiming } from "./common";

type Direction = "up" | "right" | "down" | "left";

function findStart(grid: Grid<string>): Point {
  const starts = findInGrid(grid, char => char === "^");
  if (starts.length === 0) throw new Error("No start position found");
  return starts[0];
}

function turnRight(dir: Direction): Direction {
  const dirs: Direction[] = ["up", "right", "down", "left"];
  return dirs[(dirs.indexOf(dir) + 1) % 4];
}

function move(pos: Point, dir: Direction): Point {
  switch (dir) {
    case "up": return { x: pos.x, y: pos.y - 1 };
    case "right": return { x: pos.x + 1, y: pos.y };
    case "down": return { x: pos.x, y: pos.y + 1 };
    case "left": return { x: pos.x - 1, y: pos.y };
  }
}

function detectLoop(grid: Grid<string>, start: Point, testX: number, testY: number): boolean {
  const testGrid = {
    data: grid.data.map(row => [...row]),
    width: grid.width,
    height: grid.height
  };
  setGridValue(testGrid, { x: testX, y: testY }, '#');

  let pos = { ...start };
  let dir: Direction = "up";
  const turns = new Set<string>();

  while (isValidPoint(testGrid, pos)) {
    const nextPos = move(pos, dir);

    if (isValidPoint(testGrid, nextPos) && getGridValue(testGrid, nextPos) === '#') {
      dir = turnRight(dir);
      const turnState = `${pos.x},${pos.y},${dir}`;
      if (turns.has(turnState)) {
        return true;
      }
      turns.add(turnState);
    } else {
      pos = nextPos;
    }
  }

  return false;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("06");
  const grid = parseGrid(input);
  const start = findStart(grid);
  let pos = start;
  let dir: Direction = "up";
  const visited = new Set<string>();

  while (isValidPoint(grid, pos)) {
    visited.add(`${pos.x},${pos.y}`);
    const nextPos = move(pos, dir);

    if (isValidPoint(grid, nextPos) && getGridValue(grid, nextPos) === '#') {
      dir = turnRight(dir);
    } else {
      pos = nextPos;
    }
  }

  return visited.size;
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("06");
  const grid = parseGrid(input);
  const start = findStart(grid);
  let count = 0;

  let pos = start;
  let dir: Direction = "up";
  const visited = new Set<string>();

  while (isValidPoint(grid, pos)) {
    visited.add(`${pos.x},${pos.y}`);
    const nextPos = move(pos, dir);

    if (isValidPoint(grid, nextPos) && getGridValue(grid, nextPos) === '#') {
      dir = turnRight(dir);
    } else {
      pos = nextPos;
    }
  }

  for (const posStr of visited) {
    const [x, y] = posStr.split(',').map(Number);
    if (x === start.x && y === start.y) continue;
    if (getGridValue(grid, { x, y }) === '#') continue;

    if (detectLoop(grid, start, x, y)) {
      count++;
    }
  }

  return count;
});
