/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import { Button, Search, Tabs, Tab, Icons, Columns, Box, Layer, Title, TextInput, Split, Select, Form, FormField, SearchInput, Text, Tiles, Tile } from 'grommet';
// import _ from 'underscore';
// import { CSVLink } from 'react-csv';
// import Popup from '../../components/Popup/Popup';
import FanTableYT from '../../components/FanTableYT/FanTableYT';
import s from './Dashboard-yt.css';

// const csvData = [['username', 'handle']];

class DashboardYT extends React.Component {
  static propTypes = {
    // title: PropTypes.string.isRequired,
    fans: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { fans } = props;
    // console.log(fans);

    this.state = {
      fans,
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    return (
      <div className={s.root}>
        <div className={s.container}>
          {/* {this.state.showPopup ? popup : null} */}
          {!loading && (
            <div>
              <div title="Top Commentors">
                <FanTableYT
                  key="8dsf76sidfhsd876fsd"
                  type="Score"
                  fans={this.state.fans}
                />
              </div>
              <div title="Influential Subscribers">
                <FanTableYT
                  key="8dsf76sidfhsd876fsasdad"
                  type="Score"
                  fans={this.state.fans}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(DashboardYT);
