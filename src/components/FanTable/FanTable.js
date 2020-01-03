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
import s from './FanTable.css';
import history from '../../history';

class FanTable extends React.Component {
  constructor(props) {
    super(props);
    let { fans } = props;
    const { updateFanSelected } = props;
    let maxInfluence = 1;

    if (fans[0]) {
      maxInfluence = fans[0].influence || fans[0].interactions;
    }
    // console.log(maxInfluence);
    fans = _(fans).map(fan => {
      const newFan = fan;
      newFan.influence = Math.round(
        ((newFan.influence || newFan.interactions) * 100) / maxInfluence,
      );
      if (Number.isNaN(newFan.influence)) {
        newFan.influence = 1;
      }
      return newFan;
    });
    this.state = { fans, selectedAll: false, updateFanSelected };
  }

  componentWillReceiveProps(nextProps) {
    let { fans } = nextProps;
    let maxInfluence = 1;

    if (fans[0]) {
      maxInfluence = fans[0].influence || fans[0].interactions;
    }
    // console.log(maxInfluence);
    fans = _(fans).map(fan => {
      const newFan = fan;
      newFan.influence = Math.round(
        ((newFan.influence || newFan.interactions) * 100) / maxInfluence,
      );
      if (Number.isNaN(newFan.influence)) {
        newFan.influence = 1;
      }
      return newFan;
    });
    this.setState({ fans });
  }

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
    this.setState({ fans, selectedAll: selectionChangedTo }, () => {
      this.state.updateFanSelected();
    });
  };

  onClickSelectAll = () => {
    if (_(this.props.fans).all(fan => fan.selected)) {
      this.changeAllFansToSelect(false);
    } else {
      this.changeAllFansToSelect(true);
    }
  };

  changeAllFansToSelect = value => {
    this.setState({
      fans: this.props.fans.map(fanMap => {
        const newFanMap = fanMap;
        newFanMap.selected = value;
        return newFanMap;
      }),
      selectedAll: value,
    });
  };

  render() {
    const { type } = this.props;
    const fansElement = this.props.fans.map(fan => (
      <tr key={fan.id}>
        <td>
          <checkbox
            onClick={() => this.onClickFanElement(fan.id)}
            checked={fan.selected}
          />
          <img
            className={s.clickable_content}
            style={{ width: 40, height: 40, borderRadius: 20 }}
            src={fan.profile_img}
            alt="profile"
          />
        </td>
        <td>
          <div
            className={s.clickable_content}
            onClick={() => history.push(`/fan/${fan.id}`)}
            onKeyDown={() => history.push(`/fan/${fan.id}`)}
            role="button"
            tabIndex="-1"
          >
            {fan.name}{' '}
            {fan.verified ? (
              <img
                alt="verified!"
                src="/img/twitter_verified.jpg"
                style={{
                  marginTop: -2,
                  marginRight: 10,
                  width: 15,
                  height: 15,
                }}
              />
            ) : null}
          </div>
        </td>
        <td>
          <div
            className={s.clickable_content}
            onClick={() =>
              window.open(`https://twitter.com/${fan.username}`, '_blank')
            }
            onKeyDown={() =>
              window.open(`https://twitter.com/${fan.username}`, '_blank')
            }
            role="button"
            tabIndex="-1"
          >
            {`@${fan.username}`}
          </div>
        </td>
        <td>
          <div
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
          />
        </td>
        {/* <td>
          <img
              src={logoUrl}
              width="25"
              alt="Favourite"
            />
        </td> */}
      </tr>
    ));
    return (
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onClick={this.onClickSelectAll}
                checked={this.state.selectedAll}
              />
              Profile
            </th>
            <th>Name</th>
            <th>Username</th>
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

FanTable.propTypes = {
  fans: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateFanSelected: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default withStyles(s)(FanTable);
