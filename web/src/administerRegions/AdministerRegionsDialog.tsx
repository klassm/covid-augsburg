import {
  AppBar,
  Dialog,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import RootRef from "@material-ui/core/RootRef";
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import { keyBy } from "lodash";
import { FunctionComponent, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useAvailableRegions } from "../facade/fetchData";
import { useRemoveRegion, useSetRegions, useUserRegions } from "../facade/RegionStorage";

interface Props {
  onClose: () => void
}

const useStyles = makeStyles((theme) => ( {
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
} ));

export const AdministerRegionsDialog: FunctionComponent<Props> = ({ onClose }) => {
  const classes = useStyles();
  const { data: regions } = useAvailableRegions()
  const { data: userRegions } = useUserRegions();
  const { mutateAsync: removeRegion } = useRemoveRegion();
  const { mutateAsync: setRegions } = useSetRegions();

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  async function onDragEnd({ source, destination }: DropResult) {
    if (!destination) {
      return;
    }

    const newRegions = reorder(
      userRegions ?? [],
      source.index,
      destination.index
    );
    await setRegions({ newRegions });
  }

  function renderList() {
    if (!regions || !userRegions) {
      return <LinearProgress/>
    }

    const indexedRegions = keyBy(regions, region => region.rs);
    const toRender = userRegions.map(rs => indexedRegions[rs]);
    const ListItemAny = ListItem as any;
    const listItems = toRender.map((item, index) => (
      <Draggable draggableId={ item.rs } key={ item.rs } index={ index }>
        { (provided) => (
          <ListItemAny
            ContainerComponent="li"
            ContainerProps={ { ref: provided.innerRef } }
            { ...provided.draggableProps }
            { ...provided.dragHandleProps }
          >
            <ListItemText
              primary={ item.name }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={ async () => removeRegion({ rs: item.rs }) }>
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemAny>
        ) }
      </Draggable>
    ));

    return <DragDropContext onDragEnd={ onDragEnd }>
      <Droppable droppableId="rs_droppable">
        { (provided) => (
          <RootRef rootRef={ provided.innerRef }>
            <List dense={ true }>
              { listItems }
              { provided.placeholder }
            </List>
          </RootRef>
        ) }
      </Droppable>
    </DragDropContext>
  }

  return <Dialog fullScreen open={ true } onClose={ onClose }>
    <AppBar className={ classes.appBar }>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={ onClose } aria-label="close">
          <CloseIcon/>
        </IconButton>
        <Typography variant="h6" className={ classes.title }>
          Kreise verwalten
        </Typography>
      </Toolbar>
    </AppBar>
    { renderList() }
  </Dialog>
}
