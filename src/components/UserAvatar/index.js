import React from 'react';
import PropTypes from 'prop-types';

import { Typography, Avatar } from '@material-ui/core';
import ThumbUpOutlined from '@material-ui/icons/ThumbUpOutlined';
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined';

const UserAvatar = ({
  avatar,
  name,
  username,
  engagementRate,
  accountType,
  type,
}) => {
  if (type === 'complete') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          src={avatar}
          alt=""
          style={{
            width: 100,
            height: 100,
            borderRadius: '4%',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: '1em',
          }}
        >
          <Typography variant="body2">{name}</Typography>

          <Typography variant="body1">{username}</Typography>

          <div
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                marginRight: 10,
              }}
            >
              <InsertChartOutlined
                color="primary"
                style={{ alignSelf: 'center' }}
              />
              <div
                style={{
                  display: 'inline-flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                  marginLeft: '10px',
                }}
              >
                <Typography variant="body2">{engagementRate}%</Typography>
                <Typography>Sentiment</Typography>
              </div>
            </div>
            <div
              style={{
                display: 'inline-flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
              }}
            >
              <ThumbUpOutlined
                color="primary"
                style={{ alignSelf: 'center' }}
              />
              <div
                style={{
                  display: 'inline-flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                  marginLeft: '10px',
                }}
              >
                <Typography variant="body2">Positive</Typography>
                <Typography>Sentiment</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex' }}>
      <Avatar
        src={avatar}
        alt=""
        style={{
          width: 75,
          height: 75,
          borderRadius: '100%',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginLeft: '1em',
        }}
      >
        <Typography variant="h6">{name}</Typography>

        {type === 'full' ? (
          <Typography
            variant="body1"
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            {accountType} &middot; {username}
          </Typography>
        ) : (
          <Typography variant="body1">{username}</Typography>
        )}
      </div>
    </div>
  );
};

UserAvatar.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  accountType: PropTypes.string.isRequired,
  engagementRate: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default UserAvatar;
