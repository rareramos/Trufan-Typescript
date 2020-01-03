/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import _ from 'underscore';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import s from './Dashboard.css';
import { addFanSource, runFanFilter, clearSelectedFans } from '../../actions';
import Popup from '../../components/Popup';
// import FanTable from '../../components/FanTable';
import FanCards from '../../components/FanCards';
import AccountSidebar from '../../components/AccountSidebar';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const { ufans, pfans } = props;
    props.addFanSource(pfans, 'pfans');
    props.addFanSource(ufans, 'ufans');

    this.state = {
      showPopup: false,
      loading: false,
    };
  }

  componentDidMount = () => {
    this.props.runFanFilter();
  };

  // componentDidUpdate = () => {
  //   this.props.runFanFilter();
  // };

  // onChangeSentiment = diff => {
  //   this.setState({ sentiment: diff.value });
  // };

  clearSelectedCards = () => {
    this.props.clearSelectedFans();
  };

  toggleFanMessagePopup = forcedState => {
    const { showPopup } = this.state;
    let popupState = !showPopup;
    if (typeof forcedState !== 'undefined') {
      popupState = Boolean(forcedState);
    }

    this.setState({ showPopup: popupState });
  };

  sendMessageToFans = popupState => {
    const { message } = popupState;
    const { fans } = this.props;
    const ids = [];
    fans.shown.map(fan => {
      if (fans.selected.indexOf(fan.username) > -1) {
        ids.push(fan.id);
      }
      return fan;
    });
    // console.log(ids);
    const request = {
      headers: { Authorization: `Bearer ${this.props.idToken}` },
      body: JSON.stringify({
        message,
        ids,
      }),
    };
    this.setState({ sentMessage: 'Sending..' });
    // FIXME : I don't know if this is live or what so I removed this for safety
    // return this.props.fetch('/api/dm-followers', request).then(res =>
    //   res.json().then(() => {
    //     this.setState(
    //       {
    //         loading: false,
    //         sentMessage: 'Sent!',
    //       },
    //       () => {
    setTimeout(() => {
      this.setState({ sentMessage: '' });
      this.toggleFanMessagePopup(false);
      this.clearSelectedCards();
      this.forceUpdate();
    }, 2000);
    //       },
    //     );
    //   }),
    // );
    return request; // FIXME: see above
  };

  // onChangeFollowing = diff => {
  //   const index = followers_list.indexOf(diff.value);
  //   console.log(`index: ${index}`);

  //   let min = 0;
  //   let max = 50000000;

  //   switch (index) {
  //     case 0:
  //       max = 500;
  //       break;
  //     case 1:
  //       min = 500;
  //       max = 1000;
  //       break;
  //     case 2:
  //       min = 1000;
  //       max = 2000;
  //       break;
  //     case 3:
  //       min = 2000;
  //       max = 5000;
  //       break;
  //     case 4:
  //       min = 5000;
  //       max = 10000;
  //       break;
  //     case 5:
  //       min = 10000;
  //       max = 25000;
  //       break;
  //     case 6:
  //       min = 25000;
  //       max = 50000;
  //       break;
  //     case 7:
  //       min = 50000;
  //       max = 10000;
  //       break;
  //     case 8:
  //       min = 10000;
  //       break;
  //   }

  //   console.log(`min: ${min}`);
  //   console.log(`max: ${max}`);

  //   this.setState({
  //     following: diff.value,
  //     fans_filtered: _(this.state.fans).filter(
  //       fan => fan.followers_count >= min && fan.followers_count <= max,
  //     ),
  //     pfans_filtered: _(this.state.pfans).filter(
  //       fan => fan.followers_count >= min && fan.followers_count <= max,
  //     ),
  //     tfans_filtered: _(this.state.tfans).filter(
  //       fan => fan.followers_count >= min && fan.followers_count <= max,
  //     ),
  //   });
  // };

  // onChangeLocation = diff => {
  //   this.setState({ location: diff.value });
  // };

  render() {
    const { loading, showPopup } = this.state;
    const { fans } = this.props;

    const numberOfSelectedFans = fans.selected.length;
    const fansToShow = fans.shown.slice(0, 50);
    const totalFans = fans.shown.length;

    return (
      <Grid
        container
        // className={s.root}
        direction="row"
        justify="space-between"
        alignItems="stretch"
        spacing={0}
      >
        {/* Selected Fans Overlay Message \/\/ */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={numberOfSelectedFans > 0}
          className={s.toast}
          message={
            <Typography variant="subtitle1" color="inherit">
              You have {numberOfSelectedFans}{' '}
              {numberOfSelectedFans !== 1 ? 'fans' : 'fan'} currently selected
            </Typography>
          }
          // onClose={this.clearSelectedCards}
          action={
            <Button
              classes={{ label: s.toast__button }}
              onClick={this.clearSelectedCards}
            >
              Clear
            </Button>
          }
          transitionDuration={0}
        />
        {/* Selected Fans Overlay Message /\/\ */}

        {/* Fan messaging Popup \/\/ */}
        {this.state.showPopup && (
          <Popup
            title="Message Fans"
            description={
              this.state.sentMessage ||
              `This message will be sent to ${numberOfSelectedFans} fan${
                numberOfSelectedFans !== 1 ? 's' : ''
              }.`
            }
            onClick={this.sendMessageToFans}
            onClose={() => this.toggleFanMessagePopup(false)}
            showPopup={showPopup}
            acceptText="send"
            textInput
          />
        )}
        {/* Fan messaging Popup /\/\ */}

        {!loading && (
          <Grid
            container
            // className={s.root}
            direction="row"
            justify="space-between"
            // alignItems="stretch"
          >
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              xl={2}
              // className={s.dashboard__cards}
            >
              <AccountSidebar
              // username="DennysDiner"
              // accountType="twitter"
              // displayName="Denny's"
              // imgSrc="https://pbs.twimg.com/profile_images/1082632150879555584/STcwZIcj_400x400.jpg"
              // following={2363}
              // followers={520000}
              // engagementRate={25}
              />
            </Grid>
            <Grid
              item
              xs={6}
              sm={8}
              md={9}
              lg={10}
              xl={10}
              // className={s.dashboard__cards}
            >
              <AppBar
                position="sticky"
                color="default"
                className={s.dashboard__toolbar}
              >
                <Toolbar>
                  <Typography variant="subtitle2" color="inherit">
                    Showing {fansToShow.length} of {totalFans}
                  </Typography>
                  {numberOfSelectedFans > 0 && (
                    <div className={s.dashboard__toolbar_buttons_container}>
                      <Button
                        variant="outlined"
                        className={`${s.button} ${s['button--light']}`}
                        onClick={this.props.clearSelectedFans}
                      >
                        Clear Selection
                      </Button>
                      <Button
                        variant="contained"
                        className={`${s.button} ${s['button--dark']}`}
                        onClick={this.toggleFanMessagePopup}
                      >
                        Send Messages
                      </Button>
                    </div>
                  )}
                </Toolbar>
              </AppBar>
              <FanCards socialType="twitter" fansToShow={fansToShow} />
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

Dashboard.defaultProps = {
  // fetch: () => {},
};

Dashboard.propTypes = {
  ufans: PropTypes.arrayOf(PropTypes.object).isRequired,
  pfans: PropTypes.arrayOf(PropTypes.object).isRequired,
  // fetch: PropTypes.func,
  idToken: PropTypes.string.isRequired,
  // Redux Props
  addFanSource: PropTypes.func.isRequired,
  runFanFilter: PropTypes.func.isRequired,
  clearSelectedFans: PropTypes.func.isRequired,
  fans: PropTypes.objectOf(PropTypes.array).isRequired,
};

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { addFanSource, runFanFilter, clearSelectedFans },
)(withStyles(s)(Dashboard));
