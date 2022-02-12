import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  AppBar, Dialog,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { keyBy } from "lodash";
import { FunctionComponent } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { useAvailableRegions } from "../facade/fetchData";
import { useRemoveRegion, useSetRegions, useUserRegions } from "../facade/RegionStorage";

interface Props {
  onClose: () => void
}

const StyledTitle = styled(Typography)`
  margin-left: 16px;
  flex: 1;
`

const StyledAppBar = styled(AppBar)`
  position: relative;
`

export const AdministerRegionsDialog: FunctionComponent<Props> = ({ onClose }) => {

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
            ref={provided.innerRef}
            ContainerComponent="li"
            ContainerProps={ { ref: provided.innerRef } }
            { ...provided.draggableProps }
            { ...provided.dragHandleProps }
          >
            <ListItemText
              primary={ item.name }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={ async () => removeRegion({ rs: item.rs }) }
                size="large">
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItemAny>
        ) }
      </Draggable>
    ));

    return (
      <DragDropContext onDragEnd={ onDragEnd }>
        <Droppable droppableId="rs_droppable">
          { (provided) => (
            <div ref={provided.innerRef}>
              <List dense={ true }>
                { listItems }
                { provided.placeholder }
              </List>
            </div>
          ) }
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <Dialog fullScreen open={ true } onClose={ onClose }>
      <StyledAppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={ onClose }
            aria-label="close"
            size="large">
            <CloseIcon/>
          </IconButton>
          <StyledTitle variant="h6">
            Kreise verwalten
          </StyledTitle>
        </Toolbar>
      </StyledAppBar>
      { renderList() }
    </Dialog>
  );
}
