import { AppBar, fade, IconButton, InputBase, makeStyles, TextField, Toolbar, Typography } from "@material-ui/core";
import { FunctionComponent, useState } from "react";
import SearchIcon from '@material-ui/icons/Search';
import SettingsIcon from '@material-ui/icons/Settings';
import { Region, useAvailableRegions } from "../facade/fetchData";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useAddRegion } from "../facade/RegionStorage";

const useStyles = makeStyles((theme) => ( {
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${ theme.spacing(4) }px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
} ));

interface Props {
  showAdministerDialog: () => void;
}

export const TopBar: FunctionComponent<Props> = ({showAdministerDialog}) => {
  const classes = useStyles();
  const { data: regions } = useAvailableRegions()
  const { mutateAsync: addRegion } = useAddRegion();
  const [query, setQuery] = useState("");
  const loadedRegions = regions ?? [];

  async function onSelectRegion(region: Region | null): Promise<void> {
    setQuery('');
    if (region !== null) {
      await addRegion(region);
    }
  }

  return <div className={ classes.root }>
    <AppBar>
      <Toolbar>
        <Typography variant="h6" noWrap className={ classes.title }>
          COVID Historie
        </Typography>
        <div className={ classes.search }>
          <div className={ classes.searchIcon }>
            <SearchIcon/>
          </div>
          <Autocomplete
            id="rs-select"
            style={ { width: 300 } }
            inputValue={query}
            disableListWrap
            getOptionLabel={ option => option.name }
            options={ loadedRegions }
            clearOnBlur={true}
            onChange={ async (_event: any, value: any) => onSelectRegion(value) }
            renderInput={ (params) => {
              const { InputLabelProps, InputProps, ...rest } = params;
              return <InputBase
                placeholder="Kreis hinzufügen…"
                onChange={ (e): void => setQuery(e.target.value) }
                { ...params.InputProps } { ...rest }
                classes={ {
                  root: classes.inputRoot,
                  input: classes.inputInput,
                } }
              />;
            } }
            renderOption={ (option) => <Typography noWrap>{ option.name }</Typography> }
          />
        </div>
        <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={showAdministerDialog}>
          <SettingsIcon/>
        </IconButton>
      </Toolbar>
    </AppBar>
  </div>
}
