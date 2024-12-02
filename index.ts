#!/usr/bin/env bun

import { Command } from "commander";
import { existsSync, readdirSync } from "fs";
import { createInterface } from "readline";

async function promptUser(query: string): Promise<boolean> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer.toLowerCase() === '' || answer.toLowerCase() === 'y');
    });
  });
}

async function runSolution(day: string, part?: string) {
  const dayNumber = day.toString().padStart(2, "0");
  const solutionPath = `./src/${dayNumber}-solution.ts`;

  if (!existsSync(solutionPath)) {
    console.error(`No solution found for day ${day}`);
    process.exit(1);
  }

  try {
    const solution = await import(solutionPath);

    if (!part || part === "both") {
      if (solution.part1) {
        console.log("\nPart 1:");
        await solution.part1();
      }
      if (solution.part2) {
        console.log("\nPart 2:");
        await solution.part2();
      }
    } else {
      const partKey = `part${part}`;
      if (solution[partKey]) {
        console.log(`\nPart ${part}:`);
        await solution[partKey]();
      } else {
        console.error(`No part ${part} found for day ${day}`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error(`Error running solution for day ${day}:`, error);
    process.exit(1);
  }
}

async function runAllSolutions() {
  console.log("🎄 Welcome to Advent of Code 2024!\n");
  console.log("⚠️  About to run all available solutions since day argument was not specified...");

  const proceed = await promptUser("\nPress Enter to continue or 'n' to cancel: ");

  if (!proceed) {
    console.log("\nOperation cancelled.");
    process.exit(0);
  }

  console.log("\nRunning all solutions...\n");

  const solutionFiles = readdirSync("./src")
    .filter(file => file.match(/^\d{2}-solution\.ts$/))
    .sort();

  for (const file of solutionFiles) {
    const currentDay = file.slice(0, 2);
    console.log(`\n=== Day ${parseInt(currentDay)} ===`);
    await runSolution(currentDay);
  }
}

const program = new Command();

program
  .name("aoc2024")
  .description("Dan Goosewin's Advent of Code 2024 Solutions Runner")
  .version("1.0.0");

program
  .argument("[day]", "Day number to run (1-25)")
  .option("-p, --part <number>", "Run specific part (1 or 2)")
  .action(async (day, options) => {
    if (!day) {
      await runAllSolutions();
      return;
    }
    await runSolution(day, options.part);
  });

program.parse();
