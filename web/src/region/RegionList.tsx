import { makeStyles } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { FunctionComponent, useEffect, useState } from "react";
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

  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });


  const { data: availableRegions } = useAvailableRegions()
  const {data: savedRegions } = useUserRegions();

  const handleResize = () => {
    setWidth(window.innerWidth)
  }

  const entriesToShow = Math.max(width / 40, 7);
  if (!availableRegions || !savedRegions) {
    return <div className={classes.loadingIndicator}><CircularProgress size={80}/></div>
  }

  const regionsToDisplay = savedRegions.filter(rs => availableRegions.some(region => region.rs === rs));

  const regions = regionsToDisplay.map(rs => <Region key={`region_${rs}`} rs={rs} entriesToShow={entriesToShow}/>)
  return <div>{regions}</div>
}
