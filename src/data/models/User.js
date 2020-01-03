/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import DataType from 'sequelize';
import Model from '../sequelize';
import sequelize from 'sequelize';
const bcrypt = require('bcryptjs');

const hashingHook = function(member, options) {
  const SALT_FACTOR = 5;
  if (!member.changed('password')) {
    return sequelize.Promise.resolve("password not modified");
  }

  return bcrypt.genSalt(SALT_FACTOR).then(function(salt) {
    return bcrypt.hash(member.password, salt, null);
  }).then(function(hash) {
    member.setDataValue('password', hash);
  }).catch(function(err) {
    return sequelize.Promise.reject(err);
  });
};

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    email: {
      type: DataType.STRING(255),
      validate: { isEmail: true },
    },

    emailConfirmed: {
      type: DataType.BOOLEAN,
      defaultValue: false,
    },

    password : {
      type: DataType.STRING(255)
    },
  },
  {
    indexes: [{ fields: ['email'] }],
    hooks: {
      beforeCreate: hashingHook,
      beforeUpdate: hashingHook
    }
  },
);

export default User;
