import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent } from "react";
import { useAvailableRegions } from "../facade/fetchData";
import { useUserRegions } from "../facade/RegionStorage";
import { Region } from "./Region";

export const RegionList: FunctionComponent = () => {
  const { data: availableRegions } = useAvailableRegions()
  const {data: savedRegions } = useUserRegions();
  if (!availableRegions || !savedRegions) {
    return <CircularProgress/>
  }


  const regionsToDisplay = savedRegions.filter(rs => availableRegions.some(region => region.rs === rs));

  const regions = regionsToDisplay.map(rs => <Region key={`region_${rs}`} rs={rs}/>)
  return <div>{regions}</div>
}
