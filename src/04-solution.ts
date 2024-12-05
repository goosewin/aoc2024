import { parseGrid, readInput, withTiming } from "./common";

function findXMAS(grid: string[]): number {
  const height = grid.length;
  const width = grid[0].length;
  if (height < 4 || width < 4) return 0;

  const dy = [-1, 1, 0, 0, -1, -1, 1, 1];
  const dx = [0, 0, 1, -1, 1, -1, 1, -1];
  let count = 0;

  for (let y = 0; y < height; y++) {
    const row = grid[y];
    for (let x = 0; x < width; x++) {
      if (row[x] !== 'X') continue;

      for (let dir = 0; dir < 8; dir++) {
        const y1 = y + dy[dir];
        const x1 = x + dx[dir];
        if (y1 < 0 || y1 >= height || x1 < 0 || x1 >= width || grid[y1][x1] !== 'M') continue;

        const y2 = y1 + dy[dir];
        const x2 = x1 + dx[dir];
        if (y2 < 0 || y2 >= height || x2 < 0 || x2 >= width || grid[y2][x2] !== 'A') continue;

        const y3 = y2 + dy[dir];
        const x3 = x2 + dx[dir];
        if (y3 < 0 || y3 >= height || x3 < 0 || x3 >= width || grid[y3][x3] !== 'S') continue;

        count++;
      }
    }
  }

  return count;
}

function findXMAS2(grid: string[]): number {
  const height = grid.length;
  const width = grid[0].length;
  if (height < 3 || width < 3) return 0;

  let count = 0;
  for (let y = 1; y < height - 1; y++) {
    const row = grid[y];
    const rowAbove = grid[y - 1];
    const rowBelow = grid[y + 1];

    for (let x = 1; x < width - 1; x++) {
      if (row[x] !== 'A') continue;

      const tl = rowAbove[x - 1];
      const tr = rowAbove[x + 1];
      const bl = rowBelow[x - 1];
      const br = rowBelow[x + 1];

      if (((tl === 'M' && br === 'S') || (tl === 'S' && br === 'M')) &&
        ((tr === 'M' && bl === 'S') || (tr === 'S' && bl === 'M'))) {
        count++;
      }
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
