/* eslint:disable */
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';
import {
  Card,
  CardContent,
  Grid,
  Icon,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CardActions,
  Typography,
} from '@material-ui/core';

import LineChart from './LineChart';
import Donut from './Donut';

import UserAvatar from '../../components/UserAvatar';
import Box from '../../components/Box';

import TruFanHeart from './heart@2x.png';
import mockData from './mockData';

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: 64,
    marginBottom: 64,
  },
  toolbar: {
    paddingRight: 24,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    paddingTop: 0,
  },
  chartContainer: {
    marginLeft: -22,
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  fanCard: {
    margin: -16,
    marginTop: 6,
  },
  secondRowWrapper: {
    display: 'flex',
    marginTop: 16,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '& > *': {
        marginBottom: 16,
      },
    },
  },
  secondRowCard: {
    flex: 1,
    marginRight: 16,
  },
  secondRowCardItemFirst: {
    flex: 10,
    [theme.breakpoints.down('sm')]: {
      flex: 1,
      width: '100%',
    },
  },
  secondRowCardItemSecond: {
    flex: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flex: 1,
    },
  },
  secondRowCardItemThird: {
    flex: 5,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flex: 1,
    },
  },
  secondRowCardItemFourth: {
    flex: 6,
    marginRight: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      flex: 1,
    },
  },
  secondRowCardEquals: {
    flex: 1,
  },
});

const renderLegend = ({ label, color }) => (
  <div
    style={{
      marginRight: '1em',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Icon fontSize="small" style={{ color }}>
      fiber_manual_record
    </Icon>
    <Typography variant="caption">{label}</Typography>
  </div>
);

const renderHeartIndicator = (value, color) => (
  <div
    style={{
      height: 125,
      width: 120,
      alignSelf: 'center',
      position: 'relative',
      backgroundColor: '#EDEDED',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: value * 1.25,
        backgroundColor: color,
      }}
    />
    <img
      src={TruFanHeart}
      alt="Heart Indicator"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        height: 125,
        width: 120,
      }}
    />
    <Typography
      style={{
        top: 40,
        textAlign: 'center',
        position: 'relative',
      }}
      variant="body2"
    >
      {value}
    </Typography>
  </div>
);

const renderAccountInfo = user => (
  <Grid container spacing={16} style={{ marginBottom: '48px' }}>
    <Grid item lg={2} sm={0} xs={0} />
    <Grid
      item
      lg={8}
      sm={12}
      xs={12}
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <UserAvatar
        name={user.name}
        accountType={user.accountType}
        avatar={user.avatar}
        username={user.username}
        type="full"
      />
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Box
          data={user.following}
          text="following"
          style={{ marginRight: '1em' }}
        />
        <Box
          data={user.followers}
          text="followers"
          style={{ marginRight: '1em' }}
        />
        <Box data={`${user.engagementRate}%`} text="eng. rate" />
      </div>
    </Grid>
    <Grid item lg={2} sm={0} xs={0} />
  </Grid>
);

const renderHealthIndicator = (data, classes) => (
  <Card>
    <CardContent>
      <Grid container>
        <Grid item xs={12} sm={12} lg={4}>
          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              position: 'relative',
            }}
          >
            {renderHeartIndicator(data.value, data.color)}
            <div
              style={{
                bottom: 10,
                position: 'absolute',
                display: 'flex',
              }}
            >
              {data.legend.map(l => renderLegend(l))}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} lg={8}>
          <Typography component="div" className={classes.chartContainer}>
            <LineChart data={data.graph} />
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const renderEngagementGraph = (data, account, classes) => (
  <Card
    className={[
      classes.secondRowCard,
      classes.secondRowCardItemFirst,
      account === 'youtube' ? classes.secondRowCardEquals : null,
    ]}
  >
    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
      <Donut data={data.graph} />
      <div
        style={{
          marginLeft: 16,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">{data.value}%</Typography>
        <Typography variant="body1">{data.label}</Typography>
      </div>
    </CardContent>
  </Card>
);

const renderSentimentGraph = (data, classes) => (
  <Card className={[classes.secondRowCard, classes.secondRowCardItemSecond]}>
    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
      <Donut data={data.graph} />
      <div
        style={{
          marginLeft: 16,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h5">{data.value}%</Typography>
        <Typography variant="body1">{data.label}</Typography>
      </div>
    </CardContent>
  </Card>
);

const renderChangeInFans = (data, account, classes) => (
  <Card
    className={[
      classes.secondRowCard,
      classes.secondRowCardItemThird,
      account === 'youtube' ? classes.secondRowCardEquals : null,
    ]}
  >
    <CardContent
      style={{
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Icon
          style={{
            color: data.upward ? '#A8CD9A' : '#CD9898',
          }}
        >
          {data.upward ? 'arrow_upward' : 'arrow_downward'}
        </Icon>
        <Typography variant="h4">{data.value}</Typography>
      </div>
      <Typography variant="body1">Change In Fans</Typography>
    </CardContent>
  </Card>
);

const renderSecondaryNetwork = (data, classes) => (
  <Card className={[classes.secondRowCard, classes.secondRowCardItemFourth]}>
    <CardContent>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" style={{ display: 'inline-flex' }}>
          {data.value}
        </Typography>
        <Typography variant="body2" style={{ alignSelf: 'flex-end' }}>
          {data.unitLabel}
        </Typography>
      </div>

      <Typography variant="body1">Secondary Network</Typography>
    </CardContent>
  </Card>
);

const renderViews = (data, classes) => (
  <Card
    className={[
      classes.secondRowCard,
      classes.secondRowCardItemFourth,
      classes.secondRowCardEquals,
    ]}
  >
    <CardContent>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h4" style={{ display: 'inline-flex' }}>
          {data.value}
        </Typography>
        <Typography variant="body2" style={{ alignSelf: 'flex-end' }}>
          {data.unitLabel}
        </Typography>
      </div>

      <Typography variant="body1">Total Views</Typography>
    </CardContent>
  </Card>
);
class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount() {
    const cookies = new Cookies();
    if (cookies.get('id_token')) {
      this.setState(prev => ({ isAuthenticated: true }));
    }
  }

  render() {
    const { classes, account } = this.props;
    const data =
      account === 'twitter' ? mockData.twitterData : mockData.youtubeData;

    if (this.state.isAuthenticated) {
      return (
        <React.Fragment>
          <div className={classes.root}>
            <main className={classes.content}>
              {renderAccountInfo(mockData.user)}
              <Grid container spacing={16}>
                <Grid item lg={2} />
                <Grid item lg={8} sm={12} xs={12}>
                  {renderHealthIndicator(data.healthIndicator, classes)}
                  <div className={classes.secondRowWrapper}>
                    {renderEngagementGraph(
                      data.engDistribution,
                      account,
                      classes,
                    )}
                    {account === 'twitter'
                      ? renderSentimentGraph(data.engSentiment, classes)
                      : null}
                    {renderChangeInFans(data.changeInFans, account, classes)}
                    {account === 'twitter'
                      ? renderSecondaryNetwork(data.secondaryNetwork, classes)
                      : null}
                    {account === 'youtube'
                      ? renderViews(data.views, classes)
                      : null}
                  </div>
                  <Grid container spacing={16} style={{ marginTop: 8 }}>
                    <Grid item sm={12} xs={12} lg={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5">Engaged Fans</Typography>
                          <List
                            className={classes.fanCard}
                            style={{ justifyContent: 'space-between' }}
                          >
                            {mockData.twitterUsers.map(fan => (
                              <ListItem
                                key={fan.id}
                                divider
                                alignItems="center"
                              >
                                <ListItemAvatar>
                                  <Avatar alt="Remy Sharp" src={fan.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={fan.name} />
                                {/* <div>
                                  {fan.twitterVerified ? 'true' : 'false'}
                                </div> */}

                                <div>
                                  <Typography>100%</Typography>
                                </div>
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                        <CardActions>
                          <Button>Explore</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item sm={12} xs={12} lg={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5">Influential Fans</Typography>
                          <List className={classes.fanCard}>
                            {mockData.twitterUsers.map(fan => (
                              <ListItem
                                key={fan.id}
                                divider
                                alignItems="center"
                              >
                                <ListItemAvatar>
                                  <Avatar alt="Remy Sharp" src={fan.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={fan.name} />
                                {/* <div>
                                  {fan.twitterVerified ? 'true' : 'false'}
                                </div> */}

                                <div>
                                  <Typography>100%</Typography>
                                </div>
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                        <CardActions>
                          <Button>Explore</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item sm={12} xs={12} lg={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h5">Trending Fans</Typography>

                          <List className={classes.fanCard}>
                            {mockData.twitterUsers.map(fan => (
                              <ListItem
                                key={fan.id}
                                divider
                                alignItems="center"
                              >
                                <ListItemAvatar>
                                  <Avatar alt="Remy Sharp" src={fan.avatar} />
                                </ListItemAvatar>
                                <ListItemText primary={fan.name} />
                                {/* <div>
                                  {fan.twitterVerified ? 'true' : 'false'}
                                </div> */}

                                <div>
                                  <Typography>100%</Typography>
                                </div>
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                        <CardActions>
                          <Button>Explore</Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={2} />
              </Grid>
            </main>
          </div>
        </React.Fragment>
      );
    }
    return <p>Please Login</p>;
  }
}

Home.propTypes = {
  // eslint-disable-next-line
  classes: PropTypes.object.isRequired,
  account: PropTypes.oneOf(['youtube', 'twitter']),
};

Home.defaultProps = {
  account: 'youtube',
};

export default withStyles(styles)(Home);
