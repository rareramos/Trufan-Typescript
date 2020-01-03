/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: process.env.TRUST_PROXY || 'loopback',

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${process.env.PORT || 3000}`,
  },

  // Database
  databaseUrl: process.env.DATABASE_URL || 'postgres://trufan:password@localhost:5432/trufan',

  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY || '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'
  },

  operations: {
    run_twitter_operations: process.env.RUN_TWITTER_OPERATIONS || false,
    send_signup_email: process.env.SEND_SIGNUP_EMAIL || false
  },

  // Web analytics
  analytics: {
    // https://analytics.google.com/
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  // Authentication
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

    // https://developers.facebook.com/
    facebook: {
      id: process.env.FACEBOOK_APP_ID || '186244551745631',
      secret:
        process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
    },

    // https://cloud.google.com/console/project
    google: {
      id:
        process.env.GOOGLE_CLIENT_ID ||
        '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
      secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
    },

    // https://apps.twitter.com/
    twitter: {
      key: process.env.TWITTER_CONSUMER_KEY || 'la8yRJx1zw8hww2TiWwLP6Loh',
      secret: process.env.TWITTER_CONSUMER_SECRET || 'zfYfqE65MaE9vlg5RxB183jOFNGxQHv4Mex2K05RYHu3SAoda5',
      access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || '78377606-O8qRtv42M4iQoT4rwwtTlvhve8eytsEdMjGpXImNO',
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'ak43EWRMLRgwnGB1YQbQsFVrCyvYJOzeFEl5ODDTSm99r',
      bearer_token: process.env.TWITTER_BEARER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAAUh8wAAAAAAmUTCRcFmniEQ9bv%2BYh%2FOyIX56v0%3D49urkuNYLYGpzeD7TlhqjR89NLIcZYwNoOmTiXhKRbttcLG7Na'
    },
  },
};
