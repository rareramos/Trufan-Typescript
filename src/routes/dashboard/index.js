/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
// import _ from 'underscore';
// import faker from 'faker';
import Cookies from 'universal-cookie';
import truFan from '../../reducers';
// import { setFanFilter, FanFilters } from '../../actions';
import Layout from '../../components/Layout';
import Dashboard from './Dashboard';
// import Auth from '../../modules/Auth';
import history from '../../history';

const title = 'Dashboard';
const store = createStore(truFan);

// console.log(store.getState());
// const unsubscribe = store.subscribe(() => console.log(store.getState()));
// store.dispatch(setFanFilter(FanFilters.SHOW_ALL));
// unsubscribe();

// const generateFan = () => ({
//   name: `${faker.name.firstName()} ${faker.name.lastName()}`,
//   twitter_verified: Math.random() > 0.9,
//   username: `@${faker.internet.userName().toLocaleLowerCase()}`,
//   description: faker.lorem.paragraph(),
//   avatar: faker.internet.avatar(),
//   followers: Math.round(Math.random() * 5000 + 100),
//   tweets: Math.round(Math.random() * 5000 + 100),
//   following: Math.round(Math.random() * 1000 + 100),
//   fandom: Math.round(Math.random() * 50 + 50),
//   id: faker.random.uuid(),
//   selected: Math.random() > 0.5,
// });

async function action({ fetch }) {
  // const fansGen = _(Array.from({ length: 100 }, () => generateFan())).toArray();
  // const pfans = _(fansGen.slice(0, 20)).sortBy(fan => fan.fandom * -1);
  // const ifans = _(fansGen.slice(20, 40)).sortBy(fan => fan.fandom * -1);
  // const tfans = _(fansGen.slice(40, 60)).sortBy(fan => fan.fandom * -1);

  // const fans = { pfans, tfans, ifans };

  let users = [];
  // const usersTrending = [];
  let pusers = [];
  let idToken = '';
  if (process.env.BROWSER) {
    const cookies = new Cookies();
    idToken = cookies.get('id_token');
    if (!idToken) {
      history.push('/login');
    }
    let resp = await fetch('/api/my-i-fans', {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    let newUsers = await resp.json();

    // console.log('new users: ');
    // console.log(newUsers);

    users = newUsers.users;

    resp = await fetch('/api/my-p-fans', {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    newUsers = await resp.json();
    pusers = newUsers.users;
  }

  return {
    chunks: ['dashboard'],
    title,
    component: (
      <Provider store={store}>
        <Layout>
          <Dashboard
            ufans={users}
            pfans={pusers}
            fetch={fetch}
            idToken={idToken}
          />
        </Layout>
      </Provider>
    ),
  };
}

export default action;
