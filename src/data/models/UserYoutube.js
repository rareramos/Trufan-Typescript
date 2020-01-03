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

const UserYoutube = Model.define('UserYoutube', {

  channel_id: {
    type: DataType.STRING,
  },

  channel_name: {
    type: DataType.STRING,
  },

  users: {
    type: DataType.JSON,
  },
});


export default UserYoutube;
