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
import Fan from './Fan';
import Cookies from 'universal-cookie';

const title = 'Fan';

async function action({ fetch, params }) {
  console.log(params.id);
  var fan = null;
  if(process.env.BROWSER){
    var cookies = new Cookies();
    const resp = await fetch(`/api/fan/${params.id}`, {
      headers: { Authorization: `Bearer ${cookies.get('id_token')}` }
    });
    fan = (await resp.json());
  }
  return {
    chunks: ['fan'],
    title,
    component: (
      <Layout>
        <Fan title={title} fan={fan}/>
      </Layout>
    ),
  };
}

export default action;
