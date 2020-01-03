import React from 'react';
import ReactDOM from 'react-dom';
import { CSVDownload } from 'react-csv';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
// import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
// import InputLabel from '@material-ui/core/InputLabel';
// import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import FilledInput from '@material-ui/core/FilledInput';
import InputBase from '@material-ui/core/InputBase';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MapMarkerIcon from 'mdi-react/MapMarkerIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import RadiusOutlineIcon from 'mdi-react/RadiusOutlineIcon';
import Select from '@material-ui/core/Select';
// import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// import FilterRemoveOutlineIcon from 'mdi-react/FilterRemoveOutlineIcon';
import ThumbDownIcon from 'mdi-react/ThumbDownIcon';
import ThumbUpIcon from 'mdi-react/ThumbUpIcon';
import AccountCircleIcon from 'mdi-react/AccountCircleIcon';
import AccountCircleOutlineIcon from 'mdi-react/AccountCircleOutlineIcon';
import ClockOutlineIcon from 'mdi-react/ClockOutlineIcon';
import EmoticonNeutralOutlineIcon from 'mdi-react/EmoticonNeutralOutlineIcon';
import EmoticonOutlineIcon from 'mdi-react/EmoticonOutlineIcon';
import FireIcon from 'mdi-react/FireIcon';

import s from './AccountSidebar.css';
import {
  FanFilters,
  setFanFilter,
  runFanFilter,
  setUserFilter,
  runUserFilter,
  UserFilters,
} from '../../actions';
import TwitterHelper from '../../helpers/Twitter';
import NumbersHelper from '../../helpers/Numbers';
import profile from './icon.jpg';

class AccountSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // showFilterButtons: false,
      sentimentFilterSelection: '',
      location: '',
      distance: '',
      followers: '',
    };
    this.resetUserFilter = this.resetUserFilter.bind(this);
    // this.setUserFilter = this.setUserFilter.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }

  getFilterIcon = filterName => {
    if (filterName === 'Neutral') {
      return <EmoticonNeutralOutlineIcon size="35px" />;
    } else if (filterName === 'Negative') {
      return <ThumbDownIcon size="35px" />;
    } else if (filterName === 'Positive') {
      return <ThumbUpIcon size="35px" />;
    }
    return <EmoticonOutlineIcon size="35px" />;
  };

  getCSVData = () => {
    const { fans } = this.props;
    const csvData = [['username', 'handle']];
    fans.shown.map(fan => csvData.push([fan.name, fan.username]));
    return csvData;
  };

  setUserFilter(type, event) {
    const newState = {};
    // FIXME: Hacky
    newState[type.split('_')[1].toLowerCase()] = event.target.value;
    this.setState(newState);
    this.props.setUserFilter(type, event.target.value);
  }

  resetUserFilter() {
    this.props.setUserFilter(UserFilters.CHANGE_DISTANCE, '');
    this.props.setUserFilter(UserFilters.CHANGE_FOLLOWERS, '');
    this.props.setUserFilter(UserFilters.CHANGE_LOCATION, '');
    this.props.setUserFilter(UserFilters.CHANGE_SENTIMENT, '');
    this.setState({
      distance: '',
      followers: '',
      location: '',
      sentimentFilterSelection: '',
    });
    this.runUserFilter();
  }

  runUserFilter = () => {
    this.props.runUserFilter();
  };

  handleFanFilterClick = filter => {
    const { currentFilterGroup } = this.state;
    const filterToUse = currentFilterGroup === filter ? 'SHOW_ALL' : filter;
    this.props.setFanFilter(filterToUse);
    this.setState({ currentFilterGroup: filterToUse });
    this.props.runFanFilter(filterToUse);
  };

  showFanGroups = () => {
    const fanFilters = {
      engaged: {
        filter: FanFilters.SHOW_ENGAGED,
        text: 'Engaged',
        icon: <ClockOutlineIcon />,
      },
      influential: {
        filter: FanFilters.SHOW_INFLUENTIAL,
        text: 'Influential',
        icon: <AccountCircleOutlineIcon />,
      },
      trending: {
        filter: FanFilters.SHOW_TRENDING,
        text: 'Trending',
        icon: <FireIcon />,
      },
      // all: {
      //   filter: FanFilters.SHOW_ALL,
      //   text: 'Show All',
      //   icon: <FilterRemoveOutlineIcon />,
      // },
    };

    return (
      <List
        subheader={<ListSubheader component="div">Fans</ListSubheader>}
        classes={{ root: s.filter_group__container }}
      >
        <Divider />
        {Object.keys(fanFilters).map((fanFilterKey, index) => {
          const fanFilter = fanFilters[fanFilterKey];
          return (
            <ListItem
              button
              divider
              onClick={() => this.handleFanFilterClick(fanFilter.filter)}
              onKeyDown={() => this.handleFanFilterClick(fanFilter.filter)}
              tabIndex={parseInt(index, 10) + 100}
              role="button"
              key={fanFilter.filter}
              className={`
              ${s['filter-group']}
              ${
                fanFilter.filter === this.state.currentFilterGroup
                  ? s['filter-group--active']
                  : ''
              }`}
            >
              <ListItemText primary={fanFilter.text} />
              <ListItemIcon>{fanFilter.icon}</ListItemIcon>
            </ListItem>
          );
        })}
      </List>
    );
  };

  // toggleFilterOptions = () => {
  //   const { showFilterButtons } = this.state;
  //   this.setState({
  //     showFilterButtons: !showFilterButtons,
  //   });
  // };

  showFilters = () => {
    const {
      // showFilterButtons,
      sentimentFilterSelection,
      location,
      distance,
      followers,
      // sentiment,
    } = this.state;
    return (
      <List
        subheader={<ListSubheader component="div">Filters</ListSubheader>}
        classes={{ root: s.filter_group__container }}
      >
        <Divider />
        {/* Location Filter */}
        <ListItem className={`${s.filter__input} ${s.filter__input__location}`}>
          <InputBase
            fullWidth
            id="userFilter-location"
            // label="Location"
            placeholder="Location"
            classes={{ root: s.filter__input__location__root }}
            // classes={`${s.filter__input} ${s.filter__input__location}`}
            // class={{ root: s.filter_input_element }}
            value={location}
            onChange={e => {
              this.setUserFilter(UserFilters.CHANGE_LOCATION, e);
            }}
            margin="none"
            startAdornment={
              <MapMarkerIcon
                fontSize="35px"
                color="rgb(97, 97, 97)"
                className={s.icon}
              />
            }
          />
        </ListItem>
        <Typography variant="h5" className={s.filter__input_subtitle}>
          City, Region, or Zip
        </Typography>
        {/* Distance Filter */}
        <ListItem className={`${s.filter__input} ${s.filter__input__distance}`}>
          <InputBase
            id="userFilter-distance"
            type="number"
            // label="Distance"
            placeholder="Distance"
            classes={{ root: s.filter__input__distance__root }}
            // className={`${s.filter__input} ${s.filter__input__distance}`}
            value={distance}
            onChange={e => {
              this.setUserFilter(UserFilters.CHANGE_DISTANCE, e);
            }}
            margin="normal"
            startAdornment={
              <RadiusOutlineIcon
                fontSize="35px"
                color="rgb(97, 97, 97)"
                className={s.icon}
              />
            }
          />
        </ListItem>
        <Typography variant="h5" className={s.filter__input_subtitle}>
          Radius in Miles
        </Typography>
        {/* Followers Filter */}
        <ListItem
          className={`${s.filter__input} ${s.filter__input__followers}`}
        >
          <InputBase
            id="userFilter-followers"
            type="number"
            // label="Followers"
            placeholder="Followers"
            classes={{ root: s.filter__input__followers__root }}
            // className={`${s.filter__input} ${s.filter__input__followers}`}
            value={followers}
            onChange={e => {
              this.setUserFilter(UserFilters.CHANGE_FOLLOWERS, e);
            }}
            margin="normal"
            startAdornment={
              <AccountCircleIcon
                fontSize="95px"
                color="rgb(97, 97, 97)"
                className={s.icon}
              />
            }
          />
        </ListItem>
        {/* Sentiment Filter */}
        {/* <ListItem
        // className={`${s.filter__input} ${s.filter__input__followers}`}
        > */}
        {/* <FormControl variant="filled"> */}
        {/* <InputLabel htmlFor="age-helper">Sentiment</InputLabel> */}
        <Select
          value={sentimentFilterSelection}
          inputProps={{
            name: 'userFilter-sentiment',
            id: 'userFilter-sentiment',
          }}
          input={
            <FilledInput
              // defaultValue=""
              disableUnderline
              onChange={e => this.selectSentimentButton(e, e.target.value)}
            />
          }
          className={s.filter__input}
          classes={{
            select: s.filter__input__select,
          }}
          // placeholder="Sentiment"
          displayEmpty
        >
          <MenuItem value="" divider>
            <EmoticonOutlineIcon
              fontSize="35px"
              color="rgb(97, 97, 97)"
              className={s.icon}
            />{' '}
            Any Sentiment
          </MenuItem>
          <MenuItem value="positive" divider>
            <ThumbUpIcon
              fontSize="35px"
              color="rgb(97, 97, 97)"
              className={s.icon}
            />{' '}
            Positive
          </MenuItem>
          <MenuItem value="neutral" divider>
            <EmoticonNeutralOutlineIcon
              fontSize="35px"
              color="rgb(97, 97, 97)"
              className={s.icon}
            />{' '}
            Neutral
          </MenuItem>
          <MenuItem value="negative">
            <ThumbDownIcon
              fontSize="35px"
              color="rgb(97, 97, 97)"
              className={s.icon}
            />{' '}
            Negative
          </MenuItem>
        </Select>
        {/* </FormControl> */}
        {/* </ListItem> */}

        {/* Filter Buttons */}
        <ListItem
        // className={s['filter-buttons']}
        >
          <Grid container direction="row" justify="space-between">
            <Grid item xs={7}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.runUserFilter}
                className={s['filter-buttons__filter']}
              >
                Filter
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                onClick={this.resetUserFilter}
                className={s['filter-buttons__reset']}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    );
  };

  selectSentimentButton(event, buttonName) {
    // this.toggleFilterOptions();
    this.setState({
      sentimentFilterSelection: buttonName,
    });
    this.props.setUserFilter(UserFilters.CHANGE_SENTIMENT, buttonName);
  }

  downloadCSV() {
    const element = (
      <CSVDownload
        filename="trufan-export.csv"
        data={this.getCSVData()}
        target="_blank"
      />
    );
    ReactDOM.render(element, document.querySelector('#csvDownload'));
  }

  render() {
    const {
      username,
      accountType,
      displayName,
      imgSrc,
      following,
      followers,
      engagementRate,
    } = this.props;
    const followerInfo = {
      following: NumbersHelper.makeNumberHumanReadable(following),
      followers: NumbersHelper.makeNumberHumanReadable(followers),
      'eng. rate': `${Math.floor(engagementRate * 10000) / 100}%`,
    };
    let formattedUsername = '';
    if (accountType === 'twitter') {
      formattedUsername = TwitterHelper.formatUsername(username);
    }

    return (
      <Paper className={s.root}>
        <div
        // className={s.header}
        >
          {/* <img className={s.header__image} src={imgSrc} alt={username} /> */}
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
            // classes={{ container: s['header__image-grid'] }}
          >
            <Grid item>
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="Fan"
                    src={imgSrc}
                    // className={classes.avatar}
                    onError={e => {
                      e.target.src = profile;
                    }}
                    className={s.header__image}
                  />
                }
                title={displayName}
                subheader={formattedUsername}
              />
            </Grid>
            <Grid
              container
              direction="row"
              justify="space-between"
              className={s['follower-info']}
            >
              {Object.keys(followerInfo).map(key => {
                const value = followerInfo[key];
                return (
                  <Grid item className={s['follower-info__item']} key={key}>
                    <Typography
                      variant="h3"
                      color="inherit"
                      className={s['follower-info__item__value']}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="h4"
                      color="inherit"
                      className={s['follower-info__item__description']}
                    >
                      {key}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
            <Grid item>
              <Divider />
            </Grid>
            {this.showFanGroups()}
            {this.showFilters()}
            <Divider />
            <Grid item classes={{ item: s['filter-buttons__export--sticky'] }}>
              {typeof window !== 'undefined' && (
                <Button
                  variant="contained"
                  onClick={this.downloadCSV}
                  className={s['filter-buttons__export']}
                >
                  Export CSV
                  <div id="csvDownload" />
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      </Paper>
    );
  }
}

AccountSidebar.defaultProps = {
  username: 'default_user',
  displayName: 'Default User',
  accountType: 'twitter',
  imgSrc: profile,
  following: 15251,
  followers: 233321524351,
  engagementRate: 0.098765,
};

AccountSidebar.propTypes = {
  username: PropTypes.string,
  displayName: PropTypes.string,
  accountType: PropTypes.string,
  imgSrc: PropTypes.string,
  following: PropTypes.number,
  followers: PropTypes.number,
  engagementRate: PropTypes.number,

  // Redux Props
  fans: PropTypes.objectOf(PropTypes.array).isRequired,
  setFanFilter: PropTypes.func.isRequired,
  runFanFilter: PropTypes.func.isRequired,
  runUserFilter: PropTypes.func.isRequired,
  setUserFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { setFanFilter, runFanFilter, runUserFilter, setUserFilter },
)(withStyles(s)(AccountSidebar));
