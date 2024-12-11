import type { Grid, Point } from "./common";
import { findInGrid, parseGrid, readInput, withTiming } from "./common";

interface Antenna {
  freq: string;
  pos: Point;
}

function findAntennas(grid: Grid<string>): Antenna[] {
  return findInGrid(grid, char => char !== '.')
    .map(pos => ({ freq: grid.data[pos.y][pos.x], pos }));
}

function distance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isCollinear(p1: Point, p2: Point, p3: Point): boolean {
  const area = p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y);
  return Math.abs(area) < 0.01;
}

function findAntinodes(antennas: Antenna[], height: number, width: number): Set<string> {
  const antinodes = new Set<string>();
  const freqGroups = new Map<string, Antenna[]>();

  for (const ant of antennas) {
    if (!freqGroups.has(ant.freq)) {
      freqGroups.set(ant.freq, []);
    }
    freqGroups.get(ant.freq)!.push(ant);
  }

  for (const [_, group] of freqGroups) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a1 = group[i];
        const a2 = group[j];

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const point = { x, y };

            if (!isCollinear(a1.pos, a2.pos, point)) continue;

            const d1 = distance(point, a1.pos);
            const d2 = distance(point, a2.pos);

            if ((Math.abs(d1 - 2 * d2) < 0.01) || (Math.abs(d2 - 2 * d1) < 0.01)) {
              antinodes.add(`${x},${y}`);
            }
          }
        }
      }
    }
  }

  return antinodes;
}

function findAntinodesV2(antennas: Antenna[], height: number, width: number): Set<string> {
  const antinodes = new Set<string>();
  const freqGroups = new Map<string, Antenna[]>();

  for (const ant of antennas) {
    if (!freqGroups.has(ant.freq)) {
      freqGroups.set(ant.freq, []);
    }
    freqGroups.get(ant.freq)!.push(ant);
  }

  for (const [_, group] of freqGroups) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a1 = group[i];
        const a2 = group[j];

        const midX = (a1.pos.x + a2.pos.x) / 2;
        const midY = (a1.pos.y + a2.pos.y) / 2;
        const dx = a2.pos.x - a1.pos.x;
        const dy = a2.pos.y - a1.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const perpX = -dy / dist;
        const perpY = dx / dist;

        for (let d = -dist * 2; d <= dist * 2; d += 0.5) {
          const x = Math.round(midX + perpX * d);
          const y = Math.round(midY + perpY * d);

          if (x >= 0 && x < width && y >= 0 && y < height) {
            const point = { x, y };
            const d1 = distance(point, a1.pos);
            const d2 = distance(point, a2.pos);

            if ((Math.abs(d1 - 2 * d2) < 0.01) || (Math.abs(d2 - 2 * d1) < 0.01)) {
              antinodes.add(`${x},${y}`);
            }
          }
        }
      }
    }
  }

  return antinodes;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("08");
  const grid = parseGrid(input);
  const antennas = findAntennas(grid);
  const antinodes = findAntinodes(antennas, grid.height, grid.width);
  return antinodes.size;
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("08");
  const grid = parseGrid(input);
  const antennas = findAntennas(grid);
  const antinodes = findAntinodesV2(antennas, grid.height, grid.width);
  return antinodes.size;
});
