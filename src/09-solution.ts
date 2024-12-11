import { readInput, withTiming } from "./common";

// Constants
const ZERO = '0'.charCodeAt(0);
const FREE_SPACE = -1;

interface Disk {
  readonly blocks: number[];
  readonly size: number;
}

/**
 * Creates a disk representation from the input string.
 * Each block is represented by its ID (0-based), and -1 represents free space.
 */
function createDisk(input: string): Disk {
  if (!input) {
    return { blocks: [], size: 0 };
  }

  const numbers = input.split('').map(x => x.charCodeAt(0) - ZERO);
  const size = numbers.reduce((a, b) => a + b, 0);
  const blocks = new Array<number>(size).fill(FREE_SPACE);

  let pos = 0;
  let id = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (i % 2 === 0) {
      // Fill block
      const blockSize = numbers[i];
      blocks.fill(id, pos, pos + blockSize);
      pos += blockSize;
      id++;
    } else {
      // Skip free space
      pos += numbers[i];
    }
  }

  return { blocks, size };
}

/**
 * Part 1: Move blocks from right to left, filling the leftmost gaps first
 */
function compactDiskPart1(disk: Disk): number {
  const { blocks, size } = disk;
  if (size === 0) return 0;

  const workingDisk = new Int32Array(blocks);

  // Optimize by tracking the first free space position
  let freePos = workingDisk.indexOf(FREE_SPACE);

  // Move blocks from right to left
  for (let i = size - 1; i > freePos; i--) {
    const blockId = workingDisk[i];
    if (blockId !== FREE_SPACE) {
      // Move block to first free space
      workingDisk[freePos] = blockId;
      workingDisk[i] = FREE_SPACE;

      // Find next free space
      freePos = workingDisk.indexOf(FREE_SPACE, freePos + 1);
      if (freePos === -1) break;
    }
  }

  // Calculate checksum
  let checksum = 0;
  for (let i = 0; i < size; i++) {
    if (workingDisk[i] !== FREE_SPACE) {
      checksum += i * workingDisk[i];
    }
  }

  return checksum;
}

/**
 * Part 2: Move blocks from highest ID to lowest, preserving order of other blocks
 */
function compactDiskPart2(disk: Disk): number {
  const { blocks, size } = disk;
  if (size === 0) return 0;

  const workingDisk = new Int32Array(blocks);

  // Find max block ID
  let maxId = FREE_SPACE;
  for (let i = 0; i < size; i++) {
    if (workingDisk[i] > maxId) maxId = workingDisk[i];
  }

  // Process blocks from highest ID to lowest
  for (let id = maxId; id > 0; id--) {
    // Find block span
    let blockStart = -1;
    let blockLen = 0;

    for (let i = 0; i < size; i++) {
      if (workingDisk[i] === id) {
        if (blockStart === -1) blockStart = i;
        blockLen++;
      }
    }

    if (blockStart === -1) continue;

    // Find leftmost free span that can fit this block
    let freeStart = -1;
    let freeLen = 0;

    for (let i = 0; i < blockStart; i++) {
      if (workingDisk[i] === FREE_SPACE) {
        if (freeStart === -1) freeStart = i;
        freeLen++;
        if (freeLen >= blockLen) break;
      } else {
        freeStart = -1;
        freeLen = 0;
      }
    }

    // Move block if we found a suitable free span
    if (freeLen >= blockLen) {
      // Use TypedArray.set for efficient block movement
      const blockData = workingDisk.slice(blockStart, blockStart + blockLen);
      workingDisk.set(blockData, freeStart);
      workingDisk.fill(FREE_SPACE, blockStart, blockStart + blockLen);
    }
  }

  // Calculate checksum
  let checksum = 0;
  for (let i = 0; i < size; i++) {
    if (workingDisk[i] !== FREE_SPACE) {
      checksum += i * workingDisk[i];
    }
  }

  return checksum;
}

export const part1 = async () => withTiming(async () => {
  const input = await readInput("09");
  const disk = createDisk(input.trim());
  return compactDiskPart1(disk);
});

export const part2 = async () => withTiming(async () => {
  const input = await readInput("09");
  const disk = createDisk(input.trim());
  return compactDiskPart2(disk);
});

if (import.meta.main) {
  part1();
  part2();
}
