import {
  AppBar,
  Dialog, IconButton, LinearProgress,
  List,
  ListItem, ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from "@material-ui/core";
import { FunctionComponent } from "react";
import CloseIcon from '@material-ui/icons/Close';
import { useAvailableRegions } from "../facade/fetchData";
import { useRemoveRegion, useUserRegions } from "../facade/RegionStorage";
import { keyBy } from "lodash";
import DeleteIcon from '@material-ui/icons/Delete';

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

  function renderList() {
    if (!regions || !userRegions) {
      return <LinearProgress/>
    }

    const indexedRegions = keyBy(regions, region => region.rs);
    const toRender = userRegions.map(rs => indexedRegions[rs]);
    const listItems = toRender.map(item => (
      <ListItem>
        <ListItemText
          primary={item.name}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={async () => removeRegion({ rs: item.rs })}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return <List dense={true}>
      {listItems}
    </List>
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
    {renderList()}
  </Dialog>
}
