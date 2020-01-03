/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import DashboardYT from './Dashboard-yt';
import _ from 'underscore';
import faker from 'faker';
import Auth from '../../modules/Auth';
import Cookies from 'universal-cookie';
import history from '../../history';

const title = 'Dashboard-YT';

async function action({ fetch }) {

  let users = [];
  let pusers = [];
  let id_token = "";
  if(process.env.BROWSER){
    var cookies = new Cookies();
    id_token = cookies.get('id_token');
    if(!id_token)
      history.push("/login");
    var resp = await fetch('/api/my-y-fans', {
      headers: { Authorization: `Bearer ${id_token}` }
    });
    var newUsers = (await resp.json());
    console.log("new users: ")
    console.log(newUsers)
    users = newUsers.users;
  }

  return {
    chunks: ['dashboard-yt'],
    title,
    component: (
      <Layout>
        <DashboardYT title={title} fans={users} fetch={fetch} id_token={id_token} />
      </Layout>
    ),
  };
}

export default action;
