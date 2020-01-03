const jwt = require('jsonwebtoken');
import User from '../data/models/User';
import UserClaim from '../data/models/UserClaim';
const PassportLocalStrategy = require('passport-local').Strategy;
import config from '../config';
import _ from 'underscore';
const bcrypt = require('bcryptjs');
/**
 * Return the Passport Local Strategy object.
 */
export default new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim()
  };

  // find a user by email address
  return User.findOne({ 
    where: { 
      email : userData.email 
    },
    include: [{ model: UserClaim, as: 'claims'}]
  }).then((user) => {
    bcrypt.compare(userData.password, user.password, (passwordErr, isMatch) => {
    if (passwordErr) { return done(passwordErr); }
      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';
        return done(error);
      }

      if(user.time_deleted){
        const error = new Error('This account has been deleted');
        error.name = 'DeletedAccountError';
        return done(error);
      }

      return user.getProfile().then((profile) => {

        const payload = {
          id: user.id,
          profile: { name: profile.displayName, img: profile.picture }
        };

        if(user.claims && _(user.claims).any((item) => item.type == 'isAdministrator')){
          payload.admin = true;
        }

        // create a token string
        const token = jwt.sign(payload, config.auth.jwt.secret);

        const data = {
            name: profile.displayName
        };
        return done(null, token, data);
      }).catch((err) => { 
        return done(err)});
      });
    }).catch((err) => {
      return done(err);
  });
});