import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import faker from 'faker';
// import _ from 'underscore';

import s from './Fan.css';

class Fan extends React.Component {
  static propTypes = {
    // title: PropTypes.string.isRequired,
    fan: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);
    if (props.fan) {
      this.state = {
        fan: props.fan,
      };
    }
  }

  generateFan = () => ({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    twitter_verified: Math.random() > 0.9,
    username: `@${faker.internet.userName().toLocaleLowerCase()}`,
    description: faker.lorem.paragraph(),
    avatar: faker.internet.avatar(),
    followers: Math.round(Math.random() * 5000 + 100),
    tweets: Math.round(Math.random() * 5000 + 100),
    following: Math.round(Math.random() * 1000 + 100),
    fandom: Math.round(Math.random() * 50 + 50),
    id: faker.random.uuid(),
    selected: false,
  });

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div separator={false} fixed={false} flex="right">
            <div justify="center" align="center" pad="medium">
              <img
                src={this.state.fan.profile_image_url_https}
                style={{ borderRadius: 64 }}
                alt="profile"
              />
            </div>
            <div pad="medium">
              <div margin="xsmall">
                <div margin="none">
                  {this.state.fan.name}
                  {this.state.fan.verified ? (
                    <img
                      src="/img/twitter_verified.jpg"
                      style={{ marginLeft: -5, width: 20, height: 20 }}
                      alt="verified status"
                    />
                  ) : null}
                </div>
                <div
                  role="button"
                  tabIndex="-1"
                  style={{ cursor: 'pointer' }}
                  margin="small"
                  onClick={() => {
                    window.open(
                      `https://twitter.com/${this.state.fan.screen_name}`,
                      '_blank',
                    );
                  }}
                  onKeyUp={e => {
                    if (e.charCode === 13) {
                      window.open(
                        `https://twitter.com/${this.state.fan.screen_name}`,
                        '_blank',
                      );
                    }
                  }}
                >{`@${this.state.fan.screen_name}`}</div>
              </div>
              <div margin="xsmall">{this.state.fan.description}</div>
              <div size="medium">
                <div
                  align="center"
                  pad="medium"
                  margin="small"
                  colorIndex="light-2"
                >
                  <div size="large" margin="none" padding="none">
                    {this.state.fan.followers_count}
                  </div>
                  <div margin="none" padding="none">
                    followers
                  </div>
                </div>
                <div
                  align="center"
                  pad="medium"
                  margin="small"
                  colorIndex="light-2"
                >
                  <div size="large" margin="none" padding="none">
                    {this.state.fan.statuses_count}
                  </div>
                  <div margin="none" padding="none">
                    tweets
                  </div>
                </div>
                <div
                  align="center"
                  pad="medium"
                  margin="small"
                  colorIndex="light-2"
                >
                  <div size="large" margin="none" padding="none">
                    {this.state.fan.friends_count}
                  </div>
                  <div margin="none" padding="none">
                    following
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Fan);
