import { performance } from "perf_hooks";

export interface Solution {
  part1: () => Promise<number>;
  part2: () => Promise<number>;
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
      sequences[i] = numbers;
    }
  }

  return sequences;
}

export function parseGrid(input: string): string[] {
  return input.trim().split("\n");
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
