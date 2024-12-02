import { parseNumberSequences, readInput, withTiming } from "./common";

type Validator = (numbers: readonly number[]) => boolean;

const MIN_DIFF = 1;
const MAX_DIFF = 3;

function isSafeReport(numbers: readonly number[]): boolean {
  const len = numbers.length;
  if (len < 2) return true;

  const isIncreasing = numbers[1] > numbers[0];
  let prev = numbers[0];

  for (let i = 1; i < len; i++) {
    const curr = numbers[i];
    const diff = curr - prev;

    if (Math.abs(diff) < MIN_DIFF || Math.abs(diff) > MAX_DIFF || (isIncreasing ? diff <= 0 : diff >= 0)) {
      return false;
    }

    prev = curr;
  }

  return true;
}

function isSafeWithDampener(numbers: readonly number[]): boolean {
  if (isSafeReport(numbers)) return true;

  const len = numbers.length;
  const withoutNumber = new Array(len - 1);

  for (let skip = 0; skip < len; skip++) {
    let j = 0;
    for (let i = 0; i < len; i++) {
      if (i !== skip) withoutNumber[j++] = numbers[i];
    }

    if (isSafeReport(withoutNumber)) return true;
  }

  return false;
}

async function processReports(validator: Validator): Promise<number> {
  const input = await readInput('02');
  const reports = parseNumberSequences(input);
  return reports.filter(validator).length;
}

export const part1 = async () => withTiming(async () =>
  processReports(isSafeReport)
);

export const part2 = async () => withTiming(async () =>
  processReports(isSafeWithDampener)
);
