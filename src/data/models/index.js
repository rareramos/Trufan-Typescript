/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import sequelize from '../sequelize';
import User from './User';
import UserLogin from './UserLogin';
import UserClaim from './UserClaim';
import UserTwitter from './UserTwitter';
import UserTwitterPassionate from './UserTwitterPassionate';
import UserTwitterInteraction from './UserTwitterInteraction';
import UserProfile from './UserProfile';
import UserYoutube from './UserYoutube';

User.hasMany(UserLogin, {
  foreignKey: 'userId',
  as: 'logins',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserClaim, {
  foreignKey: 'userId',
  as: 'claims',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserTwitter, {
  foreignKey: 'userId',
  as: 'twitter_accounts',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserYoutube, {
  foreignKey: 'userId',
  as: 'youtube_accounts',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserTwitterPassionate, {
  foreignKey: 'userId',
  as: 'twitter_accounts_passionate',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasMany(UserTwitterInteraction, {
  foreignKey: 'userId',
  as: 'twitter_user_interactions',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, UserLogin, UserClaim, UserProfile, UserTwitter, UserTwitterPassionate };
