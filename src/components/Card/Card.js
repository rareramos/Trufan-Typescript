import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
// import Link from '@material-ui/core/Link';
import MUICard from '@material-ui/core/Card';
// import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import ChartBarIcon from 'mdi-react/ChartBarIcon';
import ChartLineIcon from 'mdi-react/ChartLineIcon';
import CheckCircleIcon from 'mdi-react/CheckCircleIcon';
import ThumbDownOutlineIcon from 'mdi-react/ThumbDownOutlineIcon';
import ThumbUpOutlineIcon from 'mdi-react/ThumbUpOutlineIcon';

import { selectFan } from '../../actions';
import profile from './icon.jpg';
import s from './Card.css';
import TwitterHelper from '../../helpers/Twitter';
import Popup from '../Popup';

class Card extends React.Component {
  constructor(props) {
    super(props);

    const { username, socialType } = props;
    let url = null;
    if (socialType === 'twitter') {
      url = `https:www.twitter.com/${username}`;
    }

    this.state = {
      showPopup: false,
      url,
    };

    this.setSelected = this.setSelected.bind(this);
    this.openLink = this.openLink.bind(this);
  }

  setSelected(event) {
    const { username } = this.props;
    if (event.key === undefined || event.keyCode === 13) {
      this.props.selectFan(username);
    }
    // this.setState(state => { selected: !state.selected });
  }

  openLink() {
    this.setState({ showPopup: false });
    window.open(this.state.url, '_blank');
  }

  twitterCard() {
    const { displayName, username, imgSrc, stats, fans } = this.props;
    const { linkPopupLink } = this.state;
    const formattedUsername = TwitterHelper.formatUsername(username);
    const selected = fans.selected.indexOf(username) > -1;

    return (
      <MUICard
        className={`${s.card} ${selected ? s['card--selected'] : ''}`}
        onClick={this.setSelected}
        onKeyDown={this.setSelected}
        raised={selected}
        // role="button"
        // tabIndex={(parseInt(stats.index, 10) + 1000).toString()} // Pushing cards to the end of the tabIndex
      >
        {/* Selection indication icon */}
        <CheckCircleIcon
          hidden={!selected}
          className={s['card__icon--selected']}
          // size="1.5rem"
        />
        {/* Sentiment indication icon */}
        <div className={s.grid__sentiment}>
          {stats.sentiment === 'positive' && (
            <ThumbUpOutlineIcon
              // hidden={selected}
              color="rgb(80, 176, 33)"
            />
          )}
          {stats.sentiment === 'negative' && (
            <ThumbDownOutlineIcon
              // hidden={selected}
              color="rgb(173, 6, 36)"
            />
          )}
          {stats.sentiment !== 'positive' && stats.sentiment !== 'negative' && (
            <ThumbUpOutlineIcon
              // hidden={selected}
              color="rgb(211, 171, 39)"
            />
          )}
        </div>

        <CardHeader
          avatar={
            <Avatar
              aria-label="Fan"
              src={imgSrc}
              // className={classes.avatar}
              onError={e => {
                e.target.src = profile;
              }}
              className={s.userImage}
              width={45}
            />
          }
          title={
            // <Tooltip
            //   title={displayName}
            //   enterDelay={500}
            // >
            <span title={displayName}>{displayName}</span>
            // </Tooltip>
          }
          subheader={
            // <Link href={`https:www.twitter.com/${username}`} target="_blank">
            //   {formattedUsername}
            // </Link>
            <Button
              // variant="contained"
              // className={`${s.button} ${s['button--dark']}`}
              classes={{
                text: s.username_button,
                label: s.username,
              }}
              onClick={() => {
                this.setState({ showPopup: true });
              }}
            >
              {formattedUsername}
            </Button>
          }
          classes={{
            title: s['display-name'],
            subheader: s.username,
          }}
        />
        <div className={`${s.grid__user_stats} ${s.iconStats}`}>
          <div className={s.iconStat}>
            <ChartBarIcon className={s.iconStat_icon} />
            <Typography
              variant="h3"
              color="inherit"
              className={s.iconStat_stat_value}
            >
              {stats.engagement}
            </Typography>
            <Typography
              variant="h4"
              color="inherit"
              className={s.iconStat_stat_type}
            >
              Engagement
            </Typography>
          </div>
          <div className={s.iconStat}>
            <ChartLineIcon className={s.iconStat_icon} />
            <Typography
              variant="h3"
              color="inherit"
              className={s.iconStat_stat_value}
            >
              {stats.influence}
            </Typography>
            <Typography
              variant="h4"
              color="inherit"
              className={s.iconStat_stat_type}
            >
              Influence
            </Typography>
          </div>
        </div>

        <Grid
          container
          className={s.grid__stats}
          direction="row"
          justify="space-between"
        >
          <Grid item>
            <Typography
              variant="h5"
              color="inherit"
              className={s.statisticSimple}
            >
              {stats.followers} Followers
            </Typography>
          </Grid>
          <Grid item className={s.statisticDivider}>
            |
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              color="inherit"
              className={s.statisticSimple}
            >
              {stats.following} Following
            </Typography>
          </Grid>
          <Grid item className={s.statisticDivider}>
            |
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              color="inherit"
              className={s.statisticSimple}
            >
              {stats.tweets} Tweets
            </Typography>
          </Grid>
        </Grid>
        {/* Fan link Popup \/\/ */}
        {this.state.showPopup && (
          <Popup
            title="Twitter"
            description={`Do you want to visit ${formattedUsername} on Twitter?`}
            onClick={this.openLink}
            onClose={() => this.setState({ showPopup: false })}
            acceptText="Go"
          >
            {linkPopupLink}
          </Popup>
        )}
        {/* Fan link Popup /\/\ */}
      </MUICard>
    );
  }

  render() {
    const { socialType } = this.props;

    if (socialType === 'twitter') {
      return this.twitterCard();
    }
    return (
      <div className={s.card}>
        <Typography variant="h1" color="inherit">
          {socialType} is not configured.
        </Typography>
      </div>
    );
  }
}

Card.defaultProps = {
  // selected: false,
  imgSrc: 'null',
};

Card.propTypes = {
  socialType: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
  stats: PropTypes.objectOf(PropTypes.string).isRequired,
  // selected: PropTypes.bool,
  // countSelectedFans: PropTypes.func.isRequired,
  // Redux Props
  selectFan: PropTypes.func.isRequired,
  fans: PropTypes.objectOf(PropTypes.array).isRequired,
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { selectFan },
)(withStyles(s)(Card));
