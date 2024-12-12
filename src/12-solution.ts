import type { Grid, Point } from "./common";
import { parseGrid, readInput, withTiming } from "./common";

interface Region {
  char: string;
  points: Set<string>;
}

function pointToString(p: Point): string {
  return `${p.x},${p.y}`;
}

function stringToPoint(s: string): Point {
  const [x, y] = s.split(',').map(Number);
  return { x, y };
}

function findRegions(grid: Grid): Region[] {
  const visited = new Set<string>();
  const regions: Region[] = [];

  function flood(start: Point, char: string): Set<string> {
    const points = new Set<string>();
    const queue: Point[] = [start];

    while (queue.length > 0) {
      const p = queue.shift()!;
      const key = pointToString(p);

      if (visited.has(key)) continue;
      if (p.y < 0 || p.y >= grid.height || p.x < 0 || p.x >= grid.width) continue;
      if (grid.data[p.y][p.x] !== char) continue;

      visited.add(key);
      points.add(key);

      queue.push(
        { x: p.x + 1, y: p.y },
        { x: p.x - 1, y: p.y },
        { x: p.x, y: p.y + 1 },
        { x: p.x, y: p.y - 1 }
      );
    }

    return points;
  }

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const point = { x, y };
      const key = pointToString(point);

      if (!visited.has(key)) {
        const char = grid.data[y][x];
        const points = flood(point, char);
        if (points.size > 0) {
          regions.push({ char, points });
        }
      }
    }
  }

  return regions;
}

function calculatePerimeter(region: Region, grid: Grid): number {
  let perimeter = 0;
  const points = Array.from(region.points).map(stringToPoint);

  for (const p of points) {
    if (!region.points.has(pointToString({ x: p.x + 1, y: p.y }))) perimeter++;
    if (!region.points.has(pointToString({ x: p.x - 1, y: p.y }))) perimeter++;
    if (!region.points.has(pointToString({ x: p.x, y: p.y + 1 }))) perimeter++;
    if (!region.points.has(pointToString({ x: p.x, y: p.y - 1 }))) perimeter++;
  }

  return perimeter;
}

function countStraightSections(region: Region): number {
  const points = Array.from(region.points).map(stringToPoint);
  const directions = [
    { x: 0, y: 1 },   // down
    { x: 0, y: -1 },  // up
    { x: 1, y: 0 },   // right
    { x: -1, y: 0 }   // left
  ];

  let sideCount = 0;

  for (const dir of directions) {
    const side = new Set<string>();

    for (const p of points) {
      const neighbor = { x: p.x + dir.x, y: p.y + dir.y };
      if (!region.points.has(pointToString(neighbor))) {
        side.add(pointToString(neighbor));
      }
    }

    const toRemove = new Set<string>();
    const perpDir = { x: dir.y, y: dir.x };

    for (const pointStr of side) {
      const p = stringToPoint(pointStr);
      let temp = { x: p.x + perpDir.x, y: p.y + perpDir.y };

      while (side.has(pointToString(temp))) {
        toRemove.add(pointToString(temp));
        temp = { x: temp.x + perpDir.x, y: temp.y + perpDir.y };
      }
    }

    sideCount += side.size - toRemove.size;
  }

  return sideCount;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("12");
  const grid = parseGrid(input.trim());
  const regions = findRegions(grid);

  return regions.reduce((sum, region) =>
    sum + region.points.size * calculatePerimeter(region, grid), 0);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("12");
  const grid = parseGrid(input.trim());
  const regions = findRegions(grid);

  return regions.reduce((sum, region) =>
    sum + region.points.size * countStraightSections(region), 0);
});

if (import.meta.main) {
  part1();
  part2();
}
