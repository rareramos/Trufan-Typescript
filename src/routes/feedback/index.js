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
import Feedback from './Feedback';
import Cookies from 'universal-cookie';

const title = 'Feedback';

function action({fetch}) {

  let id_token = "";
  if(process.env.BROWSER){
    var cookies = new Cookies();
    id_token = cookies.get('id_token');
  }

  return {
    chunks: ['feedback'],
    title,
    component: (
      <Layout>
        <Feedback title={title} fetch={fetch} id_token={id_token}/>
      </Layout>
    ),
  };
}

export default action;
