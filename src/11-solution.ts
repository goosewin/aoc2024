import { readInput, withTiming } from "./common";

function blink(stones: Map<bigint, bigint>): Map<bigint, bigint> {
  const newStones = new Map<bigint, bigint>();

  for (const [stone, count] of stones.entries()) {
    const length = stone.toString().length;
    if (stone === 0n) {
      newStones.set(1n, (newStones.get(1n) || 0n) + count);
    } else if (length % 2 === 0) {
      const power = 10n ** BigInt(Math.floor(length / 2));
      const left = stone / power;
      const right = stone % power;
      newStones.set(left, (newStones.get(left) || 0n) + count);
      newStones.set(right, (newStones.get(right) || 0n) + count);
    } else {
      const newStone = stone * 2024n;
      newStones.set(newStone, (newStones.get(newStone) || 0n) + count);
    }
  }

  return newStones;
}

function simulateStones(stones: Map<bigint, bigint>, steps: number): bigint {
  for (let i = 0; i < steps; i++) {
    stones = blink(stones);
  }
  return Array.from(stones.values()).reduce((a, b) => a + b, 0n);
}

function parseInput(input: string): Map<bigint, bigint> {
  const stones = new Map<bigint, bigint>();
  for (const stone of input.trim().split(/\s+/).map(n => BigInt(n))) {
    stones.set(stone, (stones.get(stone) || 0n) + 1n);
  }
  return stones;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("11");
  return Number(simulateStones(parseInput(input), 25));
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("11");
  return Number(simulateStones(parseInput(input), 75));
});

if (import.meta.main) {
  part1();
  part2();
}
