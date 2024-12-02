import { parseNumberPairs, readInput, withTiming } from "./common";

export const part1 = async () => withTiming(async () => {
    const text = await readInput("01");
    const [left, right] = parseNumberPairs(text);

    left.sort((a, b) => a - b);
    right.sort((a, b) => a - b);

    let result = 0;
    for (let i = 0; i < left.length; i++) {
        result += Math.abs(left[i] - right[i]);
    }

    return result;
});

export const part2 = async () => withTiming(async () => {
    const text = await readInput("01");
    const [left, right] = parseNumberPairs(text);

    const rightFrequencies = new Map<number, number>();
    for (const num of right) {
        rightFrequencies.set(num, (rightFrequencies.get(num) || 0) + 1);
    }

    let result = 0;
    for (const num of left) {
        result += num * (rightFrequencies.get(num) || 0);
    }

    return result;
});
