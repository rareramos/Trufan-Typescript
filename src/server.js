/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import { graphql } from 'graphql';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import passport from './passport';
import router from './router';
import models, { UserLogin, User, UserClaim, UserProfile, UserTwitterPassionate } from './data/models';
import schema from './data/schema';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import LocalSignupStrategy from './passport/local-signup';
import LocalLoginStrategy from './passport/local-login';
import session from 'express-session';
import UserTwitter from './data/models/UserTwitter';
import _ from 'underscore';
import sequelize from 'sequelize';
import { SendNewUserSignupEmail, SendUserFeedbackEmail } from './helpers/EmailSend';
import HttpsRedirect from 'react-https-redirect';
import UserYoutube from './data/models/UserYoutube';

var Op = sequelize.Op;

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  // send entire app down. Process manager will restart it
  process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token || ((req.headers.authorization || '') && req.headers.authorization.split(' ')[1])
  })
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(session({
  secret: "Adjkahdkahkshdkash",
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());

passport.use('local-signup', LocalSignupStrategy);
passport.use('local-login', LocalLoginStrategy);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);

app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.clearCookie('connect.sid');
    res.redirect('/');
  },
);

var TwitterStrategy = require('passport-twitter').Strategy;
const twitter_login_name = 'twitter';
const claimtype_twitter_key = 'urn:twitter:access_key';
const claimtype_twitter_secret = 'urn:twitter:access_secret';

passport.serializeUser((user, cb) => {
  cb(null, user);
  });
  passport.deserializeUser((obj, cb) => {
  cb(null, obj);
  });

passport.use(new TwitterStrategy({
  consumerKey: config.auth.twitter.key,
  consumerSecret: config.auth.twitter.secret,
  callbackURL: `${config.api.serverUrl}/login/twitter/return`
},
function(token, tokenSecret, profile, cb) {
  console.log(`token: ${token}`);
  console.log(`token: ${tokenSecret}`);
  console.log(`token: ${JSON.stringify(profile)}`);

  User.findOne({
    where: {
      '$logins.name$': twitter_login_name,
      '$logins.key$': profile.id 
    },
    include: [
      {
        attributes: ['name', 'key'],
        model: UserLogin,
        as: 'logins',
        required: true,
        duplicating: false
      },
      {
        model: UserProfile,
        as: 'profile'
      }
    ]
  }).then((user) => {
    if(user) {
      return cb(null, {
        id: user.id,
        email: user.email,
        profile: { name: user.profile.displayName, img: user.profile.picture }
      })
    } else {
      return User.create({
        claims: [{
          type: claimtype_twitter_key,
          value: token
        },{
          type: claimtype_twitter_secret,
          value: tokenSecret
        }],
        logins: [{
          name: twitter_login_name,
          key: profile.id
        }],
        profile: {
          displayName: profile._json.name,
          picture: profile._json.profile_image_url_https
        }
      },
      {
        include: [
          { model: UserLogin, as: 'logins' },
          { model: UserClaim, as: 'claims' },
          { model: UserProfile, as: 'profile' },
        ],
      }).then((user) => {
        return SendNewUserSignupEmail(profile.username).then((email) => {
          return UserTwitter.findOne({ where: { twitter_handle: { [Op.iLike]: profile.username}, userId: null }}).then((userTwitter) => {
            if(userTwitter){
              userTwitter.userId = user.id;
              return userTwitter.save().then(() => {
                return UserTwitterPassionate.findOne({ where: { twitter_handle: { [Op.iLike]: profile.username}, userId: null }}).then((userTwitter) => {
                  if(userTwitter){
                    userTwitter.userId = user.id;
                    return userTwitter.save().then(() => {
                      return cb(null, {
                        id: user.id,
                        email: user.email,
                        profile: { name: user.profile.displayName, img: user.profile.picture }
                      });
                    });
                  } else {
                    return cb(null, {
                      id: user.id,
                      email: user.email,
                      profile: { name: user.profile.displayName, img: user.profile.picture }
                    });
                  }
                });
              });
            } else {
              return cb(null, {
                id: user.id,
                email: user.email,
                profile: { name: user.profile.displayName, img: user.profile.picture }
              });
            }
          });
        });
      });
    }
  })
}));

// app.get('/login/twitter', passport.authenticate('jwt', { session: true }), (req, res, next) => {
// 	// Manually start a session
// 	req.login(req.user, err => {
// 		if (err) {
// 			return res.status(401).send({
// 				success: false,
// 				error: err
// 			});
// 		}

// 		return passport.authorize('twitter', { state: req.query.state })(req, res, next);
// 	});
// });

app.get('/login/twitter',
  passport.authenticate('twitter'));

app.get('/login/twitter/return', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: false });
    res.redirect('/dashboard');
  });

app.post('/api/link-twitter/:twitter_handle', (req, res) => {
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  var twitter_handle = req.params.twitter_handle;
  console.log(twitter_handle);
  console.log(payload);
  return UserTwitter.findOne({ where: { twitter_handle: twitter_handle, userId: null }}).then((userTwitter) => {
    if(!userTwitter){
      return UserTwitter.create({ userId: payload.id, next_cursor_str: "-1", twitter_handle: twitter_handle}).then((userTwitter) =>{
        return res.status(200).json({
          success: true
        });
      })
    } else {
      userTwitter.userId = payload.id;
      return userTwitter.save().then(() => {
        return res.status(200).json({
          success: true
        });
      })
    }
  })
});

var Twit = require('twit');
app.post('/api/dm-followers', (req, res) => {
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  console.log(req.body);
  return UserClaim.findOne({ where: { userId : payload.id, type: claimtype_twitter_key }}).then((claim_key) => {
    return UserClaim.findOne({ where: { userId : payload.id, type: claimtype_twitter_secret }}).then((claim_secret) => {
      var T = new Twit({
        consumer_key: config.auth.twitter.key,
        consumer_secret: config.auth.twitter.secret,
        access_token: claim_key.value,
        access_token_secret: claim_secret.value
      });
      _(req.body.ids).forEach((id) => {
        T.post('direct_messages/events/new',
          { "event": {
            "type": "message_create",
            "message_create": {
              "target": {
                "recipient_id": id
              },
              "message_data": {
                "text": req.body.message
              }
            }
          }
        }, function(error, tweets, response) {
          if (!error) {
            console.log(JSON.stringify(tweets));
          } else {
            console.log(error);
          }
        });
      });
      return res.status(200).json({success: true});
    });
  });
});

app.post('/api/feedback', (req, res) => {
  if(req.headers.authorization){
    var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
    var userId = payload.id;
    return UserProfile.findById(userId).then((userProfile) => {
      return SendUserFeedbackEmail(userProfile.displayName, req.body).then(() => {
        return res.status(200).json({});
      });
    });
  }

  return SendUserFeedbackEmail(null, req.body).then(() => {
    return res.status(200).json({});
  });
});

app.post('/api/fan/:id', (req, res) => {
  console.log("my-fans");
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  var Twitter = require('twitter');
  
  var client = new Twitter({
    consumer_key: config.auth.twitter.key,
    consumer_secret: config.auth.twitter.secret,
    access_token_key: config.auth.twitter.access_token_key,
    access_token_secret: config.auth.twitter.access_token_secret
  });

  client.get('users/show', { user_id: req.params.id, include_entities: false}, function(error, user, response) {
    if (!error) {
      res.status(200).json(user);
      console.log(user);
    } else {
      console.log(error);
    }
  });
});

app.post('/api/my-i-fans/', (req, res) => {
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  return UserTwitter.findOne({ where: { userId: payload.id }}).then((userTwitter) => {
    if(!userTwitter){
      return res.status(404).json({
        success: true
      });
    } else {
      return res.status(200).json({
        success: true,
        users: userTwitter.users,
        users_trending: userTwitter.users_trending
      });
    }
  })
});

app.post('/api/my-y-fans/', (req, res) => {
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  return UserYoutube.findOne({ where: { userId: payload.id }}).then((userYoutube) => {
    if(!userYoutube){
      return res.status(404).json({
        success: true
      });
    } else {
      return res.status(200).json({
        success: true,
        users: userYoutube.users
      });
    }
  })
});

app.post('/api/my-p-fans/', (req, res) => {
  var payload = jwt.verify(req.headers.authorization.split(' ')[1], config.auth.jwt.secret);
  return UserTwitterPassionate.findOne({ where: { userId: payload.id }}).then((userTwitter) => {
    if(!userTwitter){
      return res.status(404).json({
        success: true
      });
    } else {
      return res.status(200).json({
        success: true,
        users: userTwitter.users
      });
    }
  })
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Enables critical path CSS rendering
    // https://github.com/kriasoft/isomorphic-style-loader
    const insertCss = (...styles) => {
      // eslint-disable-next-line no-underscore-dangle
      styles.forEach(style => css.add(style._getCss()));
    };

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
      schema,
      graphql,
    });

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      insertCss,
      fetch,
      // The twins below are wild, be careful!
      pathname: req.path,
      query: req.query,
    };

    const route = await router.resolve(context);

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <HttpsRedirect>
        <App context={context}>{route.component}</App>
      </HttpsRedirect>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    const scripts = new Set();
    const addChunk = chunk => {
      if (chunks[chunk]) {
        chunks[chunk].forEach(asset => scripts.add(asset));
      } else if (__DEV__) {
        throw new Error(`Chunk with name '${chunk}' cannot be found`);
      }
    };
    addChunk('client');
    if (route.chunk) addChunk(route.chunk);
    if (route.chunks) route.chunks.forEach(addChunk);

    data.scripts = Array.from(scripts);
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
