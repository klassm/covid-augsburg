import { createStyles, makeStyles } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import {
  HorizontalGridLines, LabelSeries,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  XYPlot,
  YAxis
} from "react-vis";
import { useRegion } from "../facade/fetchData";
import '../../node_modules/react-vis/dist/style.css';

interface Props {
  rs: string;
}


const useStyles = makeStyles(() =>
  createStyles({
    body: {
      padding: 5
    }
  })
);

function formatDiff(diff: number | undefined): string {
  if (diff === undefined) {
    return "";
  }
  return diff > 0 ? `+ ${diff}` : `- ${Math.abs(diff)}`;
}

const colors = ["#fefac0", "#f6c97a", "#ec925b", "#dc543f", "#ac3135"]
function colorFor(incidence: number): number {

  if (incidence > 200) {
    return 4;
  }
  if (incidence > 100) {
    return 3;
  }
  if (incidence > 50) {
    return 2;
  }
  if (incidence > 35) {
    return 1;
  }
  return 0;
}

export const Region: FunctionComponent<Props> = ({ rs }) => {
  const classes = useStyles();
  const { data: regionData } = useRegion(rs)
  if (!regionData) {
    return null;
  }

  const screenWidth = window.innerWidth - 20;
  const entries = regionData.entries
    .slice(regionData.entries.length - 10, regionData.entries.length)
    .map(day => ({...day, date: day.date.split(".").slice(0, 2).join(".")}));
  const graphData = entries
    .map(day => ({x: day.date, y: day.incidence, color: colorFor(day.incidence)}));
  const casesLabelsData = entries.map((day) => ({x: day.date as any, y: day.incidence + 15, label: formatDiff(day.casesDiff)}))
  const incidenceLabelsData = entries.map((day) => ({x: day.date as any, y: 10, label: `${Math.ceil(day.incidence)}`}))

  return <div className={classes.body}>
    <h3>{ regionData.name }</h3>

    <XYPlot height={ 300 } width={ screenWidth } xType="ordinal">
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <VerticalBarSeries colorType="log" data={graphData}  barWidth={0.8} colorRange={colors} colorDomain={[0, 1, 2, 3, 4]}/>
      <LabelSeries data={casesLabelsData} xType="ordinal" labelAnchorX="middle"/>
      <LabelSeries data={incidenceLabelsData} xType="ordinal" labelAnchorX="middle"/>
    </XYPlot>
  </div>
}
