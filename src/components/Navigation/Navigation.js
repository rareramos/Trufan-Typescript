/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import PropTypes from 'prop-types';
import s from './Navigation.css';
import Link from '../Link';
import profile from './icon.jpg';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    const { target, name } = this.props;
    this.state = {
      toggled: false,
      target,
      name,
    };
  }

  showToggle = () => {
    const { toggled } = this.state;
    return (
      <button
        className={`${s.hamburgerMenu} ${toggled ? 'toggled' : ''}`}
        onClick={this.revealNavigation}
      >
        <div className={`${s.hamburgerLine}`} />
        <div className={`${s.hamburgerLine}`} />
        <div className={`${s.hamburgerLine}`} />
      </button>
    );
  };

  showSidebar = () => {
    const { name } = this.state;
    return (
      <div className={s['sidebar-root']} id={name} role="navigation">
        {/* <Link className={s.link} to="/dashboard">Rewards</Link> */}
        <Link className={s['nav-link']} to="/dashboard">
          Dashboard
        </Link>
        <Link className={s.link} to="/dashboard-yt">
          Youtube
        </Link>
        {/* <Link className={s.link} to="/dashboard">
          Messages
        </Link> */}
        <span className={s.spacer}> | </span>
        {this.state.isAuthenticated && (
          <Link className={s.link} to="/dashboard">
            <img
              alt="profile"
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 5,
              }}
              src={this.state.img || profile}
            />
            {/* Colin Gagich */}
          </Link>
        )}
        {/* <span className={s.spacer}>or</span> */}
      </div>
    );
  };

  revealNavigation = () => {
    const { toggled, navType } = this.state;
    let navState = 'toggle';
    if (navType === 'toggle') {
      navState = 'sidebar';
    }
    this.setState({
      toggled: !toggled,
      navType: navState,
    });
  };

  render() {
    const { navType, name } = this.props;
    const { target } = this.state;
    if (navType === 'toggle') {
      return this.showToggle(target);
    }
    return this.showSidebar(name);
  }
}

Navigation.propTypes = {
  target: PropTypes.string,
  name: PropTypes.string,
  navType: PropTypes.string,
};

Navigation.defaultProps = {
  target: null,
  name: null,
  navType: 'sidebar',
};

export default withStyles(s)(Navigation);
