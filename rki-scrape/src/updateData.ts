import { fetchData, RkiData } from "./rkiFacade";
import { DayData, load, Region, save, writeAllRsFile } from "./storedData";

const stadtkreisAugsburg = "09761"
const landkreisAugsburg = "09772"
const allRs = [stadtkreisAugsburg, landkreisAugsburg];

function newDataFrom(lastData: DayData | undefined, newData: RkiData): DayData {
  return {
    date: newData.lastUpdate,
    cases: newData.cases,
    incidence: newData.incidence,
    casesDiff: lastData === undefined ? 0 : newData.cases - lastData.cases
  }
}

async function updateLkData(data: RkiData) {
  const storedData = await load(data.rs);
  const baseData: Region = storedData ?? {
    rs: data.rs,
    name: data.name,
    entries: []
  }

  const lastItem = baseData.entries[baseData.entries.length - 1];
  if (lastItem && lastItem.date === data.lastUpdate) {
    console.log(`${data.name} - already up to date`)
    return;
  }
  const newData = newDataFrom(lastItem, data);
  console.log(`${data.name} - incidence to ${data.incidence}`)

  const allNewData = [...baseData.entries, newData];
  save({ ...baseData, entries: allNewData });
}

export async function updateData() {
  const data = await fetchData(allRs);
  for (const item of data) {
    await updateLkData(item);
  }

  writeAllRsFile(allRs);
}
