import User from '../data/models/User';
import UserProfile from '../data/models/UserProfile';

const PassportLocalStrategy = require('passport-local').Strategy;

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
    password: password.trim(),
    emailConfirmed: false
  };

  return User.create(userData)
    .then((user) => {
      return UserProfile.create({
        userId: user.id
      }).then((profile) => {
          return done(null);
      }).catch((err) => {
        return done(err)
      });
    }).catch((err) => {
      return done(err)
    });

  // newUser.save((err) => {
  // if (err) { 
  //     console.log("ERROR PG: " + err);
  //     return done(err); 
  // }

  // return done(null);
  //});
});