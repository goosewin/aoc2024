import { readInput, withTiming } from "./common";

type Operator = '+' | '*' | '||';
const OPERATORS: Operator[] = ['+', '*'];
const ALL_OPERATORS: Operator[] = ['+', '*', '||'];
const operatorArrays: { [key: number]: Operator[] } = {};

function getDigitCount(n: number): number {
  if (n < 10) return 1;
  if (n < 100) return 2;
  if (n < 1000) return 3;
  if (n < 10000) return 4;
  if (n < 100000) return 5;
  if (n < 1000000) return 6;
  return Math.floor(Math.log10(n)) + 1;
}

function concat(a: number, b: number): number {
  if (b < 10) return a * 10 + b;
  if (b < 100) return a * 100 + b;
  if (b < 1000) return a * 1000 + b;
  if (b < 10000) return a * 10000 + b;
  return parseInt(`${a}${b}`);
}

function evaluateExpression(numbers: number[], operators: Operator[], target: number): number {
  let result = numbers[0];
  const targetDigits = getDigitCount(target);

  for (let i = 0; i < operators.length; i++) {
    const op = operators[i];
    const num = numbers[i + 1];

    if (op === '||') {
      if (result > target) return Infinity;
      result = concat(result, num);
      if (getDigitCount(result) > targetDigits) return Infinity;
    } else {
      result = op === '+' ? result + num : result * num;
      if (result > target) return Infinity;
    }
  }
  return result;
}

function getOperatorArray(size: number): Operator[] {
  if (!operatorArrays[size]) {
    operatorArrays[size] = new Array(size);
  }
  return operatorArrays[size];
}

function canMakeValue(target: number, numbers: number[], useConcat = false): boolean {
  if (numbers.length === 1) return numbers[0] === target;

  const operatorCount = numbers.length - 1;
  const operators = getOperatorArray(operatorCount);

  if (!useConcat) {
    const totalCombinations = 1 << operatorCount;
    for (let i = 0; i < totalCombinations; i++) {
      for (let j = 0; j < operatorCount; j++) {
        operators[j] = ((i >> j) & 1) ? '*' : '+';
      }
      if (evaluateExpression(numbers, operators, target) === target) return true;
    }
    return false;
  }

  const totalCombinations = Math.pow(3, operatorCount);
  for (let i = 0; i < totalCombinations; i++) {
    let temp = i;
    for (let j = 0; j < operatorCount; j++) {
      operators[j] = ALL_OPERATORS[temp % 3];
      temp = Math.floor(temp / 3);
    }
    if (evaluateExpression(numbers, operators, target) === target) return true;
  }
  return false;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("07");
  let sum = 0;

  for (const line of input.trim().split('\n')) {
    const [targetStr, numbersStr] = line.split(':');
    const target = parseInt(targetStr);
    const numbers = numbersStr.trim().split(/\s+/).map(Number);
    if (canMakeValue(target, numbers)) sum += target;
  }

  return sum;
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("07");
  let sum = 0;

  for (const line of input.trim().split('\n')) {
    const [targetStr, numbersStr] = line.split(':');
    const target = parseInt(targetStr);
    const numbers = numbersStr.trim().split(/\s+/).map(Number);
    if (canMakeValue(target, numbers, true)) sum += target;
  }

  return sum;
});
