import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent } from "react";
import { useAvailableRegions } from "../facade/fetchData";
import { useUserRegions } from "../facade/RegionStorage";
import { Region } from "./Region";

const useStyles = makeStyles(() => ( {
    loadingIndicator: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 30
    },
  }
))

export const RegionList: FunctionComponent = () => {
  const classes = useStyles();

  const { data: availableRegions } = useAvailableRegions()
  const {data: savedRegions } = useUserRegions();

  if (!availableRegions || !savedRegions) {
    return <div className={classes.loadingIndicator}><CircularProgress size={80}/></div>
  }

  const regionsToDisplay = savedRegions.filter(rs => availableRegions.some(region => region.rs === rs));

  const regions = regionsToDisplay.map(rs => <Region key={`region_${rs}`} rs={rs}/>)
  return <div>{regions}</div>
}
