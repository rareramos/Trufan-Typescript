/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from 'sequelize';
import _ from 'underscore';
import Model from '../sequelize';
import config from '../../config';

const { Op } = sequelize;
const RATE_LIMIT_BASE = 15 * 60 * 1000;
// const RATE_LIMIT_FOLLOWERS = RATE_LIMIT_BASE / 15 + 1;
const RATE_LIMIT_RETWEETERS = RATE_LIMIT_BASE / 300 + 250;
const RATE_LIMIT_SEARCH_MENTIONS = RATE_LIMIT_BASE / 30 + 250;

const UserTwitterPassionate = Model.define('UserTwitterPassionate', {
  twitter_handle: {
    type: sequelize.STRING,
  },
  got_tweets_time: {
    type: sequelize.DATE,
    allowNull: true,
  },
  got_engagement_time: {
    type: sequelize.DATE,
    allowNull: true,
  },
  got_reverse_fans_time: {
    type: sequelize.DATE,
    allowNull: true,
  },
  tweets: {
    type: sequelize.JSON,
  },
  fans: {
    type: sequelize.JSON,
  },
  users: {
    type: sequelize.JSON,
  },
});

const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: config.auth.twitter.key,
  consumer_secret: config.auth.twitter.secret,
  bearer_token: config.auth.twitter.bearer_token,
});

function setIntervalAndExecute(fn, t) {
  fn();
  return setInterval(fn, t);
}

const reverseLookupRecurse = (i, result, tpId) => {
  if (i >= 5) {
    // we're done here boys
    return UserTwitterPassionate.update(
      { users: result, got_reverse_fans_time: new Date() },
      { where: { id: tpId } },
    ).then(() => {});
  }
  // ELSE
  const userId = result.slice(i * 100, (i + 1) * 100);
  // console.log(userId);
  client.get(
    'users/lookup',
    {
      user_id: _(userId)
        .map(user => user.id_str)
        .join(','),
      include_entities: false,
    },
    (error, users) => {
      if (!error) {
        // console.log(users);
        users.forEach(user => {
          const resultToChange = _(result).find(
            res => res.id_str === user.id_str,
          );
          if (resultToChange) {
            resultToChange.username = user.screen_name;
            resultToChange.name = user.name;
            resultToChange.followers_count = user.followers_count;
            resultToChange.profile_img = user.profile_image_url_https;
            resultToChange.verified = user.verified;
            resultToChange.id = resultToChange.id_str;
            resultToChange.id_str = undefined;
          }
        });
        reverseLookupRecurse(i + 1, result, tpId);
      } else {
        reverseLookupRecurse(i + 1, result, tpId);
      }
    },
  );
  return null;
};

const startUserReverseLookup = () => {
  UserTwitterPassionate.findOne({
    where: {
      got_tweets_time: { [Op.not]: null },
      got_engagement_time: { [Op.not]: null },
      got_reverse_fans_time: null,
    },
  }).then(twitterPassionate => {
    if (twitterPassionate) {
      if (twitterPassionate.fans) {
        let result = Object.keys(twitterPassionate.fans).map(e => ({
          id_str: e,
          interactions: twitterPassionate.fans[e],
        }));
        result = _(result)
          .sortBy(user => user.interactions * -1)
          .slice(0, 500);
        reverseLookupRecurse(0, result, twitterPassionate.id);
      }
    }
  });
};

client.get('application/rate_limit_status', {}, (error, tweets) => {
  if (!error && tweets) {
    // console.log(JSON.stringify(tweets));
  } else {
    // console.log(error);
  }
});

const startProcessTweets = () =>
  UserTwitterPassionate.findOne({
    where: { got_tweets_time: { [Op.not]: null }, got_engagement_time: null },
    order: [['createdAt', 'ASC']],
  }).then(twitterPassionate => {
    if (twitterPassionate) {
      // console.log(twitterPassionate);
      if (twitterPassionate.tweets && twitterPassionate.tweets.length) {
        const ids = twitterPassionate.tweets;
        const id = ids.pop();
        // console.log(
        //   `analyzing tweet ${id}, ${
        //     twitterPassionate.tweets.length
        //   } tweet(s) left.`,
        // );
        const params2 = { count: 100, id, stringify_ids: true };
        return client.get(
          'statuses/retweeters/ids',
          params2,
          (error, retweets) => {
            if (!error) {
              const fans = _(twitterPassionate.fans || {}).clone();
              _(retweets.ids).forEach(retweet => {
                fans[retweet] = (fans[retweet] || 0) + 1;
              });
              return UserTwitterPassionate.update(
                { tweets: ids, fans },
                { where: { id: twitterPassionate.id } },
              );
              // .then(thing => {
              //   console.log(thing);
              // })
              // .catch(err => {
              //   console.log(err);
              // });
            }
            // console.log(error);
            return error;
          },
        );
      }

      // console.log('no more tweets to analyze');
      return UserTwitterPassionate.update(
        { got_engagement_time: new Date() },
        { where: { id: twitterPassionate.id } },
      ).then(() => {});
    }
    return null;
  });

const handleNoRemainingCalls = (tweetsQueued, tpId) => {
  const tweetsToAnalyze = _(tweetsQueued)
    .chain()
    .sortBy(tweet => tweet.retweet_count * -1)
    .map(tweet => tweet.id_str)
    .value()
    .slice(0, process.env.TWITTER_NUMBER_TWEETS_ENGAGED || 600);
  return UserTwitterPassionate.update(
    {
      tweets: tweetsToAnalyze,
      got_tweets_time: new Date(),
      fans: {},
    },
    {
      where: {
        twitter_handle: tpId,
      },
    },
  );
};

const getAccountTweets = (lastId, tweetsQueued, remainingCalls, tpId) => {
  if (remainingCalls === 0) {
    return handleNoRemainingCalls(tweetsQueued, tpId);
  }

  const params = {
    screen_name: tpId,
    count: 200,
    exclude_replies: false,
    include_rts: false,
  };
  if (lastId) {
    params.max_id = lastId;
  }

  return client.get('statuses/user_timeline', params, (error, tweets) => {
    if (!error) {
      // console.log(tweets.length);
      if (tweets.length === 0) {
        return getAccountTweets('', tweetsQueued, 0, tpId);
      }
      _(tweets).forEach(tweet => {
        // console.log(tweet);
        if (!tweet.retweeted && tweet.retweet_count > 0) {
          tweetsQueued.push({
            id_str: tweet.id_str,
            retweet_count: tweet.retweet_count,
          });
        }
      });
      return getAccountTweets(
        tweets[tweets.length - 1].id_str,
        tweetsQueued,
        remainingCalls - 1,
        tpId,
      );
      // } else {
      // console.log(error);
      // console.log(`last_id: ${lastId}`);
    }
    return error;
  });
};

const startNextTweet = () => {
  UserTwitterPassionate.findOne({ where: { got_tweets_time: null } }).then(
    twitterPassionate => {
      if (twitterPassionate) {
        // console.log(`Getting ${twitterPassionate.twitter_handle} tweet's`);
        getAccountTweets('', [], 16, twitterPassionate.twitter_handle);
      }
    },
  );
};

setIntervalAndExecute(startProcessTweets, RATE_LIMIT_RETWEETERS);
setIntervalAndExecute(startNextTweet, 60 * 1000);
setIntervalAndExecute(startUserReverseLookup, 60 * 1000);

export default UserTwitterPassionate;
