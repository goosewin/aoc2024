import { readInput, withTiming } from "./common";

const OFFSET = 10000000000000n;

interface Machine {
  buttonA: { x: number; y: number };
  buttonB: { x: number; y: number };
  prize: { x: bigint; y: bigint };
}

function parseMachine(input: string, addOffset = false): Machine {
  const lines = input.trim().split("\n");
  const [ax, ay] = lines[0].match(/\d+/g)!.map(Number);
  const [bx, by] = lines[1].match(/\d+/g)!.map(Number);
  const [px, py] = lines[2].match(/\d+/g)!.map(n => BigInt(n) + (addOffset ? OFFSET : 0n));

  return {
    buttonA: { x: ax, y: ay },
    buttonB: { x: bx, y: by },
    prize: { x: px, y: py }
  };
}

function gcd(a: bigint, b: bigint): bigint {
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

function findMinTokens(machine: Machine): number | null {
  const ax = BigInt(machine.buttonA.x);
  const ay = BigInt(machine.buttonA.y);
  const bx = BigInt(machine.buttonB.x);
  const by = BigInt(machine.buttonB.y);
  const { x: targetX, y: targetY } = machine.prize;

  const gcdX = gcd(ax, bx);
  const gcdY = gcd(ay, by);
  if (targetX % gcdX !== 0n || targetY % gcdY !== 0n) return null;

  const det = ax * by - ay * bx;
  if (det === 0n) return null;

  if (targetX > 1000000000000n) {
    const baseX = targetX - OFFSET;
    const baseY = targetY - OFFSET;

    // Check if part 1 solution exists with <= 100 presses
    for (let a = 0; a <= 100; a++) {
      const aB = BigInt(a);
      const remainingX = baseX - aB * ax;
      if (remainingX < 0n) break;

      if (remainingX % bx === 0n) {
        const b = remainingX / bx;
        if (b >= 0n && b <= 100n && aB * ay + b * by === baseY) {
          return null;
        }
      }
    }
  }

  const a = (targetX * by - targetY * bx) / det;
  const b = (targetY * ax - targetX * ay) / det;

  if (a < 0n || b < 0n || a * ax + b * bx !== targetX || a * ay + b * by !== targetY) return null;

  return Number(3n * a + b);
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("13");
  return input.trim().split("\n\n")
    .map(block => parseMachine(block, false))
    .reduce((sum, machine) => {
      const tokens = findMinTokens(machine);
      return tokens !== null ? sum + tokens : sum;
    }, 0);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("13");
  return input.trim().split("\n\n")
    .map(block => parseMachine(block, true))
    .reduce((sum, machine) => {
      const tokens = findMinTokens(machine);
      return tokens !== null ? sum + tokens : sum;
    }, 0);
});

if (import.meta.main) {
  part1();
  part2();
}
