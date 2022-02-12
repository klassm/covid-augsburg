import styled from "@emotion/styled";
import CircularProgress from "@mui/material/CircularProgress";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useAvailableRegions } from "../facade/fetchData";
import { useUserRegions } from "../facade/RegionStorage";
import { Region } from "./Region";

const LoadingIndicator = styled.div `
  &.loadingIndicator {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
`;

export const RegionList: FunctionComponent = () => {
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
    return <LoadingIndicator><CircularProgress size={80}/></LoadingIndicator>;
  }

  const regionsToDisplay = savedRegions.filter(rs => availableRegions.some(region => region.rs === rs));

  const regions = regionsToDisplay.map(rs => <Region key={`region_${rs}`} rs={rs} entriesToShow={entriesToShow}/>)
  return <div>{regions}</div>
}
