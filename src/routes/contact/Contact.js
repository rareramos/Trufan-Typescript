/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import {
//   Button,
//   Search,
//   Tabs,
//   Tab,
//   Icons,
//   Columns,
//   Box,
//   Layer,
//   Title,
//   TextInput,
//   Split,
//   Select,
//   Form,
//   FormField,
//   SearchInput,
//   Text,
// } from 'grommet';
import faker from 'faker';
// import FavouriteIcon from 'grommet/components/icons/base/Favorite';
// import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import _ from 'underscore';

import Popup from '../../components/Popup';
import FanTable from '../../components/FanTable';
import s from './Contact.css';

class Contact extends React.Component {
  // static propTypes = {
  // title: PropTypes.string.isRequired,
  // };

  constructor(props) {
    super(props);
    const pfans = _(
      Array.from({ length: 20 }, () => this.generateFan()),
    ).sortBy(fan => fan.fandom * -1);
    const ifans = _(
      Array.from({ length: 20 }, () => this.generateFan()),
    ).sortBy(fan => fan.fandom * -1);
    const tfans = _(
      Array.from({ length: 20 }, () => this.generateFan()),
    ).sortBy(fan => fan.fandom * -1);
    this.state = {
      showPopup: false,
      pfans,
      ifans,
      tfans,
    };
  }

  clucked = () => {
    this.setState({ showPopup: true });
  };
  closeModal = () => {
    this.setState({ showPopup: false });
  };

  generateFan = () => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    username: `@${faker.internet.userName().toLocaleLowerCase()}`,
    avatar: faker.internet.avatar(),
    fandom: Math.round(Math.random() * 50 + 50),
    id: faker.random.uuid(),
    selected: false,
  });

  render() {
    const toolbar = (
      <div>
        <div justify="between">
          <div align="start" pad="small" size="small" margin="small">
            <input />
          </div>
          <div align="end" pad="small" margin="small">
            <button
              className={s.button}
              label="Send Message"
              onClick={this.clucked}
            />
          </div>
        </div>
      </div>
    );
    const popup = (
      <Popup
        title="Send Message"
        description="This message will be sent to 20 fans."
        onClick={this.clucked}
        onClose={this.closeModal}
      />
    );

    return (
      <div className={s.root}>
        <div className={s.container}>
          {this.state.showPopup ? popup : null}
          <div separator={false} fixed={false} flex="right">
            <div justify="center" align="center" pad="medium">
              <div style={{ height: 120 }} />
              <div pad="small" justify="start" />
              <div pad="small">
                <select
                  placeHolder="Social Platform"
                  options={['Twitter', 'Facebook', 'Instagram', 'YouTube']}
                  value={undefined}
                />
              </div>
              <div pad="small">
                <select
                  placeHolder="Gender"
                  options={['Male', 'Female', 'Other']}
                  value={undefined}
                />
              </div>
              <div pad="small">
                <select
                  placeHolder="Age Range"
                  options={['13-18', '18-24', '25-29', '30-39', '40+']}
                  value={undefined}
                />
              </div>
              <div pad="small">
                <input label="Content" placeHolder="Zipcode" pad="none" />
              </div>
              <div pad="small">
                <select
                  placeHolder="Distance"
                  options={[
                    '<2 miles',
                    '2-5 miles',
                    '5-10 miles',
                    '10-25 miles',
                    '25-50 miles',
                    '+50 miles',
                  ]}
                  value={undefined}
                />
              </div>
            </div>
            <div pad="medium">
              <div>
                <div title="Passionate Fans">
                  {toolbar}
                  <FanTable type="Passion" fans={this.state.pfans} />
                </div>
                <div title="Influential Fans" selected>
                  {toolbar}
                  <FanTable type="Influence" fans={this.state.ifans} />
                </div>
                <div title="Trending Fans">
                  {toolbar}
                  <FanTable type="Trend" fans={this.state.tfans} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Contact);
