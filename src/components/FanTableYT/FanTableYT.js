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
import _ from 'underscore';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// import {
//   Button,
//   Search,
//   Tabs,
//   Tab,
//   Paragraph,
//   Table,
//   TableRow,
//   Icons,
//   Columns,
//   Box,
//   Layer,
//   Title,
//   TextInput,
//   CheckBox,
// } from 'grommet';
// import FavouriteIcon from 'grommet/components/icons/base/Favorite';
// import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
// import logoUrl from './trufan-logo.png';
import s from './FanTableYT.css';
// import history from '../../history';

class FanTableYT extends React.Component {
  constructor(props) {
    super(props);
    let { fans } = props;
    let maxInfluence = 1;

    if (fans[0]) {
      maxInfluence = fans[0].score; // (fans[0].influence || fans[0].interactions || fans[0].score);
    }
    // console.log(`maxInfluence: ${maxInfluence}`);
    fans = _(fans).map(fan => {
      const newFan = fan;
      newFan.influence = Math.round((fan.score * 100) / maxInfluence);
      if (Number.isNaN(fan.influence)) {
        newFan.influence = 1;
      }
      return newFan;
    });
    this.state = { fans };
  }

  // componentWillReceiveProps(nextProps) {}

  onClickFanElement = fanId => {
    let selectionChangedTo = false;
    // let fans = this.props.fans.map((fanMap) => {
    //   if(fanMap.id == fanId) {
    //     fanMap.selected = !fanMap.selected;
    //     selectionChangedTo = fanMap.selected;
    //   }
    //   return fanMap;
    // })

    const { fans } = this.state;
    const fan = _(fans).find(fanMap => fanMap.id === fanId);
    fan.selected = !fan.selected;
    selectionChangedTo = fan.selected;

    if (selectionChangedTo) {
      selectionChangedTo = _(fans).all(f => f.selected);
    }
    this.setState(
      {
        fans,
        // selectedAll: selectionChangedTo
      },
      () => {
        this.state.updateFanSelected();
      },
    );
  };

  render() {
    const { type } = this.props;
    const fansElement = this.props.fans.map(fan => (
      <tr key={fan.channel_url}>
        <td>
          <img
            className={s.clickable_content}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            alt={fan.channel_name}
            src="https://www.smallbizgeek.co.uk/wp-content/uploads/2017/03/google-plus-blank-profile-pic-300x300.jpg"
          />
        </td>
        <td>
          <div
            className={s.clickable_content}
            tabIndex="-100"
            onClick={() => window.open(`${fan.channel_url}`, '_blank')}
            onKeyDown={() => window.open(`${fan.channel_url}`, '_blank')}
            role="button"
          >
            {fan.channel_name}
          </div>
        </td>
        {/* <td className={s.clickable_content} onClick={()=> window.open(`${fan.channel_url}`, "_blank")} > */}
        {/* {"View Channel"} */}
        {/* </td> */}
        <td style={{ alignItems: 'center' }}>
          {/* <AnnotatedMeter
            className={s.meter}
            align="center"
            type="circle"
            max={100}
            size="small"
            label="%"
            series={[
              { label: type, value: fan.influence, colorIndex: 'graph-1' },
            ]}
            style={{ height: 75, width: 75, 'align-items': 'center' }}
          /> */}
        </td>
      </tr>
    ));
    return (
      <table>
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th style={{ 'text-align': 'center' }}>{type}</th>
            {/* <th>
              Favourite
            </th> */}
          </tr>
        </thead>
        <tbody>{fansElement}</tbody>
      </table>
    );
  }
}

FanTableYT.propTypes = {
  fans: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(s)(FanTableYT);
