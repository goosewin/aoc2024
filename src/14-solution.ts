import { readInput, withTiming } from "./common";

function parseRobots(input: string): {
  px: number[], py: number[],
  vx: number[], vy: number[],
  count: number
} {
  const lines = input.trim().split('\n');
  const count = lines.length;
  const px = new Array(count);
  const py = new Array(count);
  const vx = new Array(count);
  const vy = new Array(count);

  for (let i = 0; i < count; i++) {
    const line = lines[i];
    px[i] = parseInt(line.slice(line.indexOf('=') + 1, line.indexOf(',')));
    py[i] = parseInt(line.slice(line.indexOf(',') + 1, line.indexOf(' ')));
    vx[i] = parseInt(line.slice(line.lastIndexOf('=') + 1, line.lastIndexOf(',')));
    vy[i] = parseInt(line.slice(line.lastIndexOf(',') + 1));
  }

  return { px, py, vx, vy, count };
}

const newPx = new Array(400);
const newPy = new Array(400);

function moveRobots(robots: ReturnType<typeof parseRobots>, width: number, height: number, seconds: number): void {
  const { px, py, vx, vy, count } = robots;

  for (let i = 0; i < count; i++) {
    let x = px[i] + vx[i] * seconds;
    let y = py[i] + vy[i] * seconds;

    x = x - Math.floor(x / width) * width;
    if (x < 0) x += width;

    y = y - Math.floor(y / height) * height;
    if (y < 0) y += height;

    newPx[i] = x;
    newPy[i] = y;
  }
}

function countQuadrants(width: number, height: number): number {
  const midX = (width / 2) | 0;
  const midY = (height / 2) | 0;
  let tl = 0, tr = 0, bl = 0, br = 0;

  for (let i = 0; i < robotCount; i++) {
    const x = newPx[i];
    const y = newPy[i];

    if (((x + 0.5) | 0) === midX || ((y + 0.5) | 0) === midY) continue;

    if (x < midX) {
      if (y < midY) tl++;
      else bl++;
    } else {
      if (y < midY) tr++;
      else br++;
    }
  }

  return tl * tr * bl * br;
}

function calculateSpread(): number {
  let centerX = 0;
  let centerY = 0;
  for (let i = 0; i < robotCount; i++) {
    centerX += newPx[i];
    centerY += newPy[i];
  }
  centerX /= robotCount;
  centerY /= robotCount;

  let spread = 0;
  for (let i = 0; i < robotCount; i++) {
    const dx = newPx[i] - centerX;
    const dy = newPy[i] - centerY;
    spread += dx * dx + dy * dy;
  }
  return spread / robotCount;
}

let robotCount = 0;

export const part1 = async () => withTiming(async () => {
  const input = await readInput("14");
  const robots = parseRobots(input);
  robotCount = robots.count;
  const width = 101;
  const height = 103;

  moveRobots(robots, width, height, 100);
  return countQuadrants(width, height);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("14");
  const robots = parseRobots(input);
  robotCount = robots.count;
  const width = 101;
  const height = 103;

  let minSpread = Infinity;
  let bestTime = -1;

  for (let time = 0; time < 10000; time++) {
    moveRobots(robots, width, height, time);
    const spread = calculateSpread();

    if (spread < minSpread) {
      minSpread = spread;
      bestTime = time;
    }
  }

  return bestTime;
});

if (import.meta.main) {
  part1();
  part2();
}
