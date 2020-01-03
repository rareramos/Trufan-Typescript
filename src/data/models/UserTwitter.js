/* eslint-disable */
// Jeremy: not sure what the right fixes are. Ignoring ES Lint for this file.

import sequelize from 'sequelize';
import _ from 'underscore';
import Model from '../sequelize';
import config from '../../config';
import { UserClaim } from '.';

const Twit = require('twit');

const RATE_LIMIT_BASE = 15 * 60;
const RATE_LIMIT_FOLLOWERS = (RATE_LIMIT_BASE / 15 + 1) * 1000;

const UserTwitter = Model.define('UserTwitter', {
  twitter_handle: {
    type: sequelize.STRING,
  },

  next_cursor_str: {
    type: sequelize.STRING,
  },

  last_processed_time: {
    type: sequelize.DATE,
    allowNull: true,
  },

  users: {
    type: sequelize.JSON,
  },

  users_trending: {
    type: sequelize.JSON,
  },

  users_trending_time: {
    type: sequelize.DATE,
    allowNull: true,
  },
});

// var json = { users: [], next_cursor_str: '-1' };

// fs.writeFile('goswish.json', JSON.stringify(json), 'utf8', callback);
const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: config.auth.twitter.key,
  consumer_secret: config.auth.twitter.secret,
  access_token_key: config.auth.twitter.access_token_key,
  access_token_secret: config.auth.twitter.access_token_secret,
});

const params = { screen_name: '', count: 200 };

function setIntervalAndExecute(fn, t) {
  fn();
  return setInterval(fn, t);
}

setIntervalAndExecute(() => {
  console.log('Looking for trending twitter accounts');
  UserTwitter.findOne({
    where: {
      users_trending_time: null,
      userId: { [sequelize.Op.not]: null },
    },
    order: [['updatedAt', 'ASC']],
  }).then(userTwitter => {
    if (userTwitter) {
      console.log('found operation to run');
      return UserClaim.findOne({
        where: { userId: userTwitter.userId, type: claimtype_twitter_key },
      }).then(claim_key => {
        return UserClaim.findOne({
          where: { userId: userTwitter.userId, type: claimtype_twitter_secret },
        }).then(claim_secret => {
          var T = new Twit({
            consumer_key: config.auth.twitter.key,
            consumer_secret: config.auth.twitter.secret,
            access_token: claim_key.value,
            access_token_secret: claim_secret.value,
          });
          var params = { screen_name: '', count: 200 };
          params.screen_name = userTwitter.twitter_handle;
          params.cursor = '-1';

          recurseTrendingTwitter(3, params, userTwitter, T);
        });
      });
      // console.log(userTwitter.users);
    }
  });
}, RATE_LIMIT_FOLLOWERS);

// T.get('account/verify_credentials', {}, function(error, tweets, response) {
//   if (!error) {
//     console.log(JSON.stringify(tweets));
//   } else {
//     console.log(error);
//     // console.log(`last_id: ${last_id}`);
//   }
// });

// T.post('direct_messages/events/new',
//   { "event": {
//     "type": "message_create",
//     "message_create": {
//       "target": {
//         "recipient_id": "488131406"
//       },
//       "message_data": {
//         "text": "Hello! You are one of Colin's top followers! Click this link for a discount.. "
//       }
//     }
//   }
// }
// , function(error, tweets, response) {
//   if (!error) {
//     console.log(JSON.stringify(tweets));
//   } else {
//     console.log(error);
//   }
// });

// UserTwitter.findAll().then((user_twitters) => {
//   console.log(user_twitters);
//   const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//   _(user_twitters).forEach((user) => {
//     const csvWriter = createCsvWriter({
//         path: `trufan-export-${user.twitter_handle}.csv`,
//         header: [
//           { id:'username', title:'handle' }
//         ]
//     });

//     const records = _(user.users).map((follower) => {
//       return { username: follower.username };
//     })

//     csvWriter.writeRecords(records)       // returns a promise
//         .then(() => {
//             console.log('...Done');
//         });
//   });
// });

setIntervalAndExecute(() => {
  // console.log('checking followers');
  UserTwitter.findOne({
    where: {
      last_processed_time: null,
    },
    order: [['updatedAt', 'ASC']],
  }).then(userTwitter => {
    const user = userTwitter;
    if (user) {
      // console.log('found operation to run');
      params.screen_name = user.twitter_handle;
      params.cursor = user.next_cursor_str;
      // console.log(userTwitter.users);
      client.get('followers/list', params, (error, followers) => {
        if (!error) {
          const analyizedUsers = _(followers.users).map(follower => {
            const returnFollower = {
              name: follower.name,
              username: follower.screen_name,
              description: follower.description,
              followers_count: follower.followers_count,
              friends_count: follower.friends_count / 20,
              listed_count: follower.listed_count / 3,
              statuses_count: follower.statuses_count / 2,
              favourites_count: follower.favourites_count / 2,
              verified: follower.verified,
              profile_img: follower.profile_image_url_https,
              created_at: follower.created_at,
              id: follower.id_str,
            };

            returnFollower.influence =
              returnFollower.followers_count +
              returnFollower.friends_count +
              returnFollower.statuses_count +
              returnFollower.favourites_count;

            if (returnFollower.verified) {
              returnFollower.influence *= 1.3;
            }

            return returnFollower;
          });

          user.users = (user.users || []).concat(analyizedUsers);
          // console.log(userTwitter.users.length)
          user.users = _(user.users)
            .chain()
            .sortBy(follower => follower.influence * -1)
            .value()
            .slice(0, 500);

          if (userTwitter.next_cursor_str === 0) {
            user.last_processed_time = new Date();
          } else {
            user.next_cursor_str = followers.next_cursor_str;
          }

          return user.save().then(() => {
            // console.log(`Updating ${user.twitter_handle}'s followers`);
          });
        }
        // console.log(error);
        // console.log('Nothing to update');
        return error;
      });
    }
  });
}, RATE_LIMIT_FOLLOWERS);

export default UserTwitter;
/* eslint-enable */
