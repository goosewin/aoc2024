import { readInput, withTiming } from "./common";

interface Rule {
  before: number;
  after: number;
}

function parseInput(input: string): { rules: Rule[], updates: number[][] } {
  const [rulesSection, updatesSection] = input.trim().split("\n\n");
  const ruleLines = rulesSection.split("\n");
  const rules = new Array<Rule>(ruleLines.length);

  for (let i = 0; i < ruleLines.length; i++) {
    const line = ruleLines[i];
    const pipeIndex = line.indexOf("|");
    rules[i] = {
      before: parseInt(line.slice(0, pipeIndex)),
      after: parseInt(line.slice(pipeIndex + 1))
    };
  }

  const updateLines = updatesSection.split("\n");
  const updates = new Array<number[]>(updateLines.length);
  const numBuffer = new Array<number>(5);

  for (let i = 0; i < updateLines.length; i++) {
    const line = updateLines[i];
    let numCount = 0;
    let start = 0;

    for (let j = 0; j <= line.length; j++) {
      if (j === line.length || line[j] === ",") {
        numBuffer[numCount++] = parseInt(line.slice(start, j));
        start = j + 1;
      }
    }

    const update = new Array<number>(numCount);
    for (let j = 0; j < numCount; j++) {
      update[j] = numBuffer[j];
    }
    updates[i] = update;
  }

  return { rules, updates };
}

function isValidOrder(update: number[], rules: Rule[], positions = new Map<number, number>()): boolean {
  positions.clear();
  for (let i = 0; i < update.length; i++) {
    positions.set(update[i], i);
  }

  for (const rule of rules) {
    const beforePos = positions.get(rule.before);
    const afterPos = positions.get(rule.after);
    if (beforePos !== undefined && afterPos !== undefined && beforePos >= afterPos) {
      return false;
    }
  }

  return true;
}

function topologicalSort(update: number[], rules: Rule[], graph = new Map<number, Set<number>>()): number[] {
  graph.clear();
  for (const num of update) {
    graph.set(num, new Set());
  }

  for (const rule of rules) {
    if (graph.has(rule.before) && graph.has(rule.after)) {
      graph.get(rule.after)!.add(rule.before);
    }
  }

  const result = new Array<number>(update.length);
  let index = 0;
  const inDegree = new Map<number, number>();
  const queue: number[] = [];

  for (const num of update) {
    inDegree.set(num, 0);
  }

  for (const deps of graph.values()) {
    for (const dep of deps) {
      inDegree.set(dep, (inDegree.get(dep) || 0) + 1);
    }
  }

  for (const [num, degree] of inDegree) {
    if (degree === 0) queue.push(num);
  }

  while (queue.length > 0) {
    const num = queue.pop()!;
    result[index++] = num;

    const deps = graph.get(num)!;
    for (const dep of deps) {
      const newDegree = inDegree.get(dep)! - 1;
      if (newDegree === 0) queue.push(dep);
      inDegree.set(dep, newDegree);
    }
  }

  return result;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("05");
  const { rules, updates } = parseInput(input);
  let sum = 0;
  const positions = new Map<number, number>();

  for (const update of updates) {
    if (isValidOrder(update, rules, positions)) {
      sum += update[update.length >> 1];
    }
  }

  return sum;
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("05");
  const { rules, updates } = parseInput(input);
  let sum = 0;
  const positions = new Map<number, number>();
  const graph = new Map<number, Set<number>>();

  for (const update of updates) {
    if (!isValidOrder(update, rules, positions)) {
      const sorted = topologicalSort(update, rules, graph);
      sum += sorted[sorted.length >> 1];
    }
  }

  return sum;
});
