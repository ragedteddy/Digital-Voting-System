const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const GOOGLE_CLIENT_ID = '826805191452-72kusqvqiqde8iun0c831mbcs64trcdn.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: '826805191452-72kusqvqiqde8iun0c831mbcs64trcdn.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: "http://localhost:5000/auth/google/callback",
  passReqToCallback: true,
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
