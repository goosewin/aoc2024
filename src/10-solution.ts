import type { Grid, Point } from "./common";
import { findInGrid, getGridValue, isValidPoint, parseGrid, readInput, withTiming } from "./common";

function findTrailheads(grid: Grid<string>): Point[] {
  return findInGrid(grid, char => char === '0');
}

function getReachableNines(grid: Grid<string>, start: Point): number {
  const visited = new Set<string>();
  const reachableNines = new Set<string>();
  const queue: [Point, number][] = [[start, 0]];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (queue.length > 0) {
    const [pos, height] = queue.shift()!;
    const key = `${pos.x},${pos.y}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const cell = getGridValue(grid, pos)!;
    if (cell === '9') {
      reachableNines.add(key);
      continue;
    }

    for (const [dy, dx] of directions) {
      const newPos: Point = { x: pos.x + dx, y: pos.y + dy };
      if (!isValidPoint(grid, newPos)) continue;

      const nextCell = getGridValue(grid, newPos)!;
      if (nextCell === '.') continue;

      const nextHeight = parseInt(nextCell);
      if (nextHeight === height + 1) {
        queue.push([newPos, nextHeight]);
      }
    }
  }

  return reachableNines.size;
}

function countDistinctPaths(grid: Grid<string>, start: Point): number {
  const visited = new Set<string>();
  const paths = new Set<string>();
  const currentPath: Point[] = [start];

  function dfs(pos: Point, height: number) {
    const key = `${pos.x},${pos.y}`;
    if (visited.has(key)) return;
    visited.add(key);

    const cell = getGridValue(grid, pos)!;
    if (cell === '9') {
      paths.add(currentPath.map(p => `${p.x},${p.y}`).join('|'));
      visited.delete(key);
      return;
    }

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dy, dx] of directions) {
      const newPos: Point = { x: pos.x + dx, y: pos.y + dy };
      if (!isValidPoint(grid, newPos)) continue;

      const nextCell = getGridValue(grid, newPos)!;
      if (nextCell === '.') continue;

      const nextHeight = parseInt(nextCell);
      if (nextHeight === height + 1) {
        currentPath.push(newPos);
        dfs(newPos, nextHeight);
        currentPath.pop();
      }
    }

    visited.delete(key);
  }

  dfs(start, 0);
  return paths.size;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("10");
  const grid = parseGrid(input);
  const trailheads = findTrailheads(grid);

  return trailheads.reduce((sum, trailhead) =>
    sum + getReachableNines(grid, trailhead), 0);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("10");
  const grid = parseGrid(input);
  const trailheads = findTrailheads(grid);

  return trailheads.reduce((sum, trailhead) =>
    sum + countDistinctPaths(grid, trailhead), 0);
});
