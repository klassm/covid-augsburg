import { createStyles, makeStyles } from "@material-ui/core";
import React, { FunctionComponent } from "react";
import { takeRight, maxBy } from "lodash";
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
  if (diff === undefined || diff === 0) {
    return "";
  }
  return diff > 0 ? `+${diff}` : `-${Math.abs(diff)}`;
}

const colors = ["", "#fefac0", "#f6c97a", "#ec925b", "#dc543f", "#ac3135"]
function colorFor(incidence: number): number {

  if (incidence > 200) {
    return 5;
  }
  if (incidence > 100) {
    return 4;
  }
  if (incidence > 50) {
    return 3;
  }
  if (incidence > 35) {
    return 2;
  }
  return 1;
}

function formatIncidence(incidence: number): number {
  if (incidence > 100) {
    return Math.ceil(incidence);
  }

  return Math.ceil(incidence * 10) / 10;
}

export const Region: FunctionComponent<Props> = ({ rs }) => {
  const classes = useStyles();
  const { data: regionData } = useRegion(rs)
  if (!regionData) {
    return null;
  }

  const screenWidth = window.innerWidth - 20;
  const entries = takeRight(regionData.entries, 10)
    .map(day => ({...day, date: day.date.split(".").slice(0, 2).join(".")}));
  const graphData = entries
    .map(day => ({x: day.date, y: day.incidence, color: colorFor(day.incidence)}));
  const maxDate = maxBy(entries, entry => entry.incidence)?.date;
  const casesLabelsData = entries.map((day) => ({x: day.date as any, y: day.incidence, yOffset: day.date === maxDate ? -20 : 0, label: day.incidence < 10 ? "" : formatDiff(day.casesDiff), style: {fontSize: 12}}))
  const incidenceLabelsData = entries.map((day) => ({x: day.date as any, y: 0, yOffset: -10, style: {fontSize: 12}, label: `${formatIncidence(day.incidence)}`}))

  return <div className={classes.body}>
    <h3>{ regionData.name }</h3>

    <XYPlot height={ 250 } width={ screenWidth } xType="ordinal">
      <VerticalGridLines />
      <HorizontalGridLines />
      <XAxis />
      <YAxis />
      <VerticalBarSeries colorType="log" data={graphData} barWidth={0.8} colorRange={colors} colorDomain={[0, 1, 2, 3, 4]}/>
      <LabelSeries data={casesLabelsData} xType="ordinal" labelAnchorX="middle" labelAnchorY="text-after-edge" allowOffsetToBeReversed={true}/>
      <LabelSeries data={incidenceLabelsData} xType="ordinal" labelAnchorX="middle"/>
    </XYPlot>
  </div>
}
