import { performance } from "perf_hooks";

export interface Solution {
  part1: () => Promise<number>;
  part2: () => Promise<number>;
}

export interface Point {
  x: number;
  y: number;
}

export interface Grid<T = string> {
  data: T[][];
  width: number;
  height: number;
}

export async function readInput(day: string): Promise<string> {
  return await Bun.file(`./src/${day}-input`).text();
}

export function parseNumberPairs(input: string): [number[], number[]] {
  const left: number[] = [];
  const right: number[] = [];

  for (const line of input.trim().split("\n")) {
    const [leftStr, rightStr] = line.split(/\s+/);
    if (leftStr && rightStr) {
      left.push(parseInt(leftStr));
      right.push(parseInt(rightStr));
    }
  }

  return [left, right];
}

export function parseNumberSequences(input: string): number[][] {
  const lines = input.trim().split("\n");
  const sequences = new Array(lines.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const numbers = new Array(5);
    let numCount = 0;

    let start = 0;
    for (let j = 0; j <= line.length; j++) {
      if (j === line.length || line[j] === " ") {
        if (j > start) {
          numbers[numCount++] = parseInt(line.slice(start, j), 10);
        }
        start = j + 1;
      }
    }

    if (numCount > 0) {
      sequences[i] = numbers.slice(0, numCount);
    }
  }

  return sequences;
}

export function parseGrid<T = string>(input: string, transform?: (char: string) => T): Grid<T> {
  const rows = input.trim().split("\n");
  const height = rows.length;
  const width = rows[0].length;
  const data = rows.map(row =>
    transform ? [...row].map(transform) : [...row] as unknown as T[]
  );
  return { data, width, height };
}

export function isValidPoint(grid: Grid<any>, point: Point): boolean {
  return point.y >= 0 && point.y < grid.height &&
    point.x >= 0 && point.x < grid.width;
}

export function getGridValue<T>(grid: Grid<T>, point: Point): T | undefined {
  return isValidPoint(grid, point) ? grid.data[point.y][point.x] : undefined;
}

export function setGridValue<T>(grid: Grid<T>, point: Point, value: T): void {
  if (isValidPoint(grid, point)) {
    grid.data[point.y][point.x] = value;
  }
}

export function findInGrid<T>(grid: Grid<T>, predicate: (value: T) => boolean): Point[] {
  const points: Point[] = [];
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (predicate(grid.data[y][x])) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

export function withTiming<T>(fn: () => Promise<T>): Promise<T> {
  return (async () => {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    console.log(result, `(${duration.toFixed(2)}ms)`);
    return result;
  })();
}
