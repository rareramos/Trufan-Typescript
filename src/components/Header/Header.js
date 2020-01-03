import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Cookies from 'universal-cookie';
import {
  MenuItem,
  Menu,
  AppBar,
  Chip,
  Toolbar,
  Typography,
  Icon,
  IconButton,
  Divider,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Auth from '../../modules/Auth';
import Link from '../Link';
import TruFanLogo from './trufan-logo.png';

const drawerWidth = 340;

const styles = theme => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    backgroundColor: '#fff',
    color: '#000',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    boxShadow: '0px 1px 0 0 rgba(0,0,0,0.1), 0px 0 1px 0px rgba(0,0,0,0.1)',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  logo: {
    width: 110,
    marginRight: 'auto',
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line
      img: '',
      isAuthenticated: false,
      drawerIsOpen: false,
    };
  }

  componentDidMount() {
    this.updateProfile();
  }

  toggleDrawer = () => {
    this.setState(prev => ({ drawerIsOpen: !prev.drawerIsOpen }));
  };

  updateProfile = () => {
    this.cookies = new Cookies();
    if (this.cookies.get('id_token')) {
      this.setState(prev => ({ isAuthenticated: true }));
    }
  };

  pressLogout = () => {
    if (this.state.isAuthenticated) {
      Auth.deauthenticateUser();
      this.cookies.remove('id_token');
    }
    this.forceUpdate();
  };

  renderMenuButton = () => (
    <IconButton
      color="inherit"
      aria-label="Open drawer"
      onClick={this.toggleDrawer}
      className={classNames(this.props.classes.menuButton)}
    >
      <Icon>menu</Icon>
    </IconButton>
  );

  renderMessagesRemaining = () => (
    <div>
      <Chip label={`${this.props.messagesRemaining} Messages Remaining`} />
    </div>
  );

  renderDrawer = () => (
    <Drawer open={this.state.drawerIsOpen} onClose={this.toggleDrawer}>
      <List>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <ListItem button key="home">
            <ListItemIcon>
              <Icon>home</Icon>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <ListItem button key="dashboard">
            <ListItemIcon>
              <Icon>dashboard</Icon>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List subheader={<ListSubheader component="div">Socials</ListSubheader>}>
        <ListItem button key="yt-itsjbecks">
          <ListItemText primary="Youtube" />
        </ListItem>
        <ListItem button key="tw-itsjbecks">
          <ListItemText primary="Twitter" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="Settings">
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem button key="Logout" onClick={() => this.pressLogout()}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );

  render() {
    const { isAuthenticated } = this.state;

    return (
      <React.Fragment>
        <AppBar
          position="fixed"
          className={classNames(this.props.classes.appBar)}
        >
          <Toolbar disableGutters className={this.props.classes.toolbar}>
            {isAuthenticated ? this.renderMenuButton() : null}
            <img
              src={TruFanLogo}
              className={this.props.classes.logo}
              alt="TruFan Logo"
            />
            {isAuthenticated ? this.renderMessagesRemaining() : null}
          </Toolbar>
        </AppBar>
        {isAuthenticated ? this.renderDrawer() : null}
        <div className={this.props.classes.appBarSpacer} />
      </React.Fragment>
    );
  }
}

Header.propTypes = {
  // eslint-disable-next-line
  classes: PropTypes.object,
  messagesRemaining: PropTypes.number,
};

Header.defaultProps = {
  classes: {},
  messagesRemaining: 28,
};

export default withStyles(styles)(Header);
