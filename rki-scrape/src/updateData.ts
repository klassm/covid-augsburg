import { fetchData, RkiData } from "./rkiFacade";
import { DayData, load, save, writeAllRsFile } from "./storedData";

const stadtkreisAugsburg = "09761"
const landkreisAugsburg = "09772"
const allRs = [stadtkreisAugsburg, landkreisAugsburg];

function newDataFrom(lastData: DayData | undefined, newData: RkiData): DayData {
  return {
    date: newData.lastUpdate,
    rs: newData.rs,
    cases: newData.cases,
    name: newData.name,
    incidence: newData.incidence,
    casesDiff: lastData === undefined ? 0 : newData.cases - lastData.cases
  }
}

async function updateLkData(data: RkiData) {
  const storedItems = await load(data.rs);
  const lastItem = storedItems[storedItems.length - 1];

  if (lastItem && lastItem.date === data.lastUpdate) {
    return;
  }
  const newData = newDataFrom(lastItem, data);

  const allNewData = [...storedItems, newData];
  save(data.rs, allNewData);
}

export async function updateData() {
  const data = await fetchData(allRs);
  for (const item of data) {
    await updateLkData(item);
  }

  writeAllRsFile(allRs);
}
