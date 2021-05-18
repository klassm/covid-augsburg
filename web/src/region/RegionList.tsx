import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent } from "react";
import { useAvailableRegions } from "../facade/fetchData";
import { Region } from "./Region";

export const RegionList: FunctionComponent = () => {
  const { data } = useAvailableRegions()
  if (!data) {
    return <CircularProgress/>
  }

  const regions = data.map(rs => <Region key={`region_${rs}`} rs={rs}/>)
  return <div>{regions}</div>
}
