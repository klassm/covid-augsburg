import fs from "fs";
import path from "path";

export interface DayData {
  rs: string;
  name: string;
  date: string;
  incidence: number;
  cases: number;
  casesDiff: number;
}

function pathFor(filename: string): string {
  return path.join(__dirname, "..", "data", `${filename}.json`);
}

export async function load(rs: string): Promise<DayData[]> {
  const file = pathFor(rs);
  if (!fs.existsSync(file)) {
    return [];
  }
  const readData = fs.readFileSync(file).toString("utf-8");
  return JSON.parse(readData);
}

export function save(rs: string, data: DayData[]) {
  const file = pathFor(rs);
  const json = JSON.stringify(data);
  fs.writeFileSync(file, json);
}

export function writeAllRsFile(rs: string[]) {
  const path = pathFor("all");
  fs.writeFileSync(path, JSON.stringify(rs));
}
