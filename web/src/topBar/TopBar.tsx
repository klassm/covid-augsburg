import { AppBar, IconButton, InputBase, Toolbar, Typography, Autocomplete } from "@mui/material";
import { styled } from '@mui/material/styles';
import { alpha } from "@mui/material/styles";
import { FunctionComponent, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { Region, useAvailableRegions } from "../facade/fetchData";
import { useAddRegion } from "../facade/RegionStorage";

const PREFIX = 'TopBar';

const classes = {
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`,
  search: `${PREFIX}-search`,
  searchIcon: `${PREFIX}-searchIcon`,
  inputRoot: `${PREFIX}-inputRoot`,
  inputInput: `${PREFIX}-inputInput`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
  },

  [`& .${classes.menuButton}`]: {
    marginRight: 16,
  },

  [`& .${classes.title}`]: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },

  [`& .${classes.search}`]: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 8,
      width: 'auto',
    },
  },

  [`& .${classes.searchIcon}`]: {
    padding: '0 16px',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.inputRoot}`]: {
    color: 'inherit',
  },

  [`& .${classes.inputInput}`]: {
    padding: '4px 4px 4px 0',
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + 32px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  }
}));

interface Props {
  showAdministerDialog: () => void;
}

export const TopBar: FunctionComponent<Props> = ({showAdministerDialog}) => {

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

  return (
    <Root className={ classes.root }>
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
              renderOption={ (props, option) => <li {...props}><Typography noWrap>{ option.name }</Typography></li> }
            />
          </div>
          <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={showAdministerDialog}>
            <SettingsIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Root>
  );
}
