import fs from "fs";
import path from "path";
import { takeRight } from "lodash";

export interface DayData {
  date: string;
  incidence: number;
  cases: number;
  casesDiff: number;
}

export interface Region {
  rs: string;
  name: string;
  entries: DayData[]
}

function pathFor(filename: string): string {
  return path.join(__dirname, "..", "data", `${ filename }.json`);
}

export async function load(rs: string): Promise<Region | undefined> {
  const file = pathFor(rs);
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const readData = fs.readFileSync(file).toString("utf-8");
  return JSON.parse(readData);
}

export function save(data: Region) {
  const file = pathFor(data.rs);
  const json = JSON.stringify(data);
  fs.writeFileSync(file, json);

  const partialFile = pathFor(data.rs + "_partial");
  const partialJson = JSON.stringify({ ...data, entries: takeRight(data.entries, 100) });
  fs.writeFileSync(partialFile, partialJson);
}

export function writeRegionsFile(regions: { rs: string, name: string }[]) {
  const path = pathFor("regions");
  fs.writeFileSync(path, JSON.stringify(regions));
}
