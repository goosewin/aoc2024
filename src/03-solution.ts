import { readInput, withTiming } from "./common";

const MUL_REGEX = /mul\((\d{1,3}),(\d{1,3})\)/g;
const CONTROL_REGEX = /(?:do|don't)\(\)/g;

function findValidMultiplications(input: string): number {
  MUL_REGEX.lastIndex = 0;
  let sum = 0, match: RegExpExecArray | null;
  while ((match = MUL_REGEX.exec(input)) !== null) {
    sum += parseInt(match[1]) * parseInt(match[2]);
  }
  return sum;
}

function findEnabledMultiplications(input: string): number {
  MUL_REGEX.lastIndex = CONTROL_REGEX.lastIndex = 0;
  const controlState = new Int8Array(input.length);
  let sum = 0, match: RegExpExecArray | null;

  while ((match = CONTROL_REGEX.exec(input)) !== null) {
    const val = match[0] === 'do()' ? 1 : -1;
    controlState.fill(val, match.index);
  }

  while ((match = MUL_REGEX.exec(input)) !== null) {
    if (controlState[match.index] >= 0) sum += parseInt(match[1]) * parseInt(match[2]);
  }

  return sum;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("03");
  return findValidMultiplications(input);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("03");
  return findEnabledMultiplications(input);
});
