import axios from "axios";
import { useQuery } from "react-query";

const baseUrl = "https://raw.githubusercontent.com/klassm/covid-augsburg/master/rki-scrape/data"

export interface DayData {
  date: string;
  incidence: number;
  cases: number;
  casesDiff: number;
}

export interface Region {
  rs: string;
  name: string;
}

export interface RegionWithData extends Region {
  entries: DayData[]
}


export function useAvailableRegions() {
  return useQuery("available-regions", fetchAvailableRegions)
}

export async function fetchAvailableRegions(): Promise<Region[]> {
  const response = await axios.get(`${baseUrl}/regions.json`)
  return response.data;
}

export function useRegion(rs: string) {
  return useQuery([rs, "region"], async () => fetchRegion(rs))
}

export async function fetchRegion(rs: string): Promise<RegionWithData> {
  const response = await axios.get(`${baseUrl}/${rs}.json`)
  return response.data;
}
