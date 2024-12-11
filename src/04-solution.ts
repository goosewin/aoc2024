import type { Grid, Point } from "./common";
import { findInGrid, getGridValue, parseGrid, readInput, withTiming } from "./common";

function findXMAS(grid: Grid<string>): number {
  if (grid.height < 4 || grid.width < 4) return 0;

  const dy = [-1, 1, 0, 0, -1, -1, 1, 1];
  const dx = [0, 0, 1, -1, 1, -1, 1, -1];
  let count = 0;

  const xPoints = findInGrid(grid, char => char === 'X');

  for (const point of xPoints) {
    for (let dir = 0; dir < 8; dir++) {
      const p1: Point = { x: point.x + dx[dir], y: point.y + dy[dir] };
      const p2: Point = { x: p1.x + dx[dir], y: p1.y + dy[dir] };
      const p3: Point = { x: p2.x + dx[dir], y: p2.y + dy[dir] };

      if (getGridValue(grid, p1) === 'M' &&
        getGridValue(grid, p2) === 'A' &&
        getGridValue(grid, p3) === 'S') {
        count++;
      }
    }
  }

  return count;
}

function findXMAS2(grid: Grid<string>): number {
  if (grid.height < 3 || grid.width < 3) return 0;

  let count = 0;
  const aPoints = findInGrid(grid, char => char === 'A');

  for (const point of aPoints) {
    if (point.y === 0 || point.y === grid.height - 1 ||
      point.x === 0 || point.x === grid.width - 1) continue;

    const tl = getGridValue(grid, { x: point.x - 1, y: point.y - 1 })!;
    const tr = getGridValue(grid, { x: point.x + 1, y: point.y - 1 })!;
    const bl = getGridValue(grid, { x: point.x - 1, y: point.y + 1 })!;
    const br = getGridValue(grid, { x: point.x + 1, y: point.y + 1 })!;

    if (((tl === 'M' && br === 'S') || (tl === 'S' && br === 'M')) &&
      ((tr === 'M' && bl === 'S') || (tr === 'S' && bl === 'M'))) {
      count++;
    }
  }

  return count;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("04");
  return findXMAS(parseGrid(input));
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("04");
  return findXMAS2(parseGrid(input));
});
