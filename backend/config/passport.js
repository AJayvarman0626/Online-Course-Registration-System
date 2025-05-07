const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models").usermodel; // Adjust the path if needed

module.exports = (passport) => {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.MYSECRET; // Ensure your secret is correct and loaded from .env

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // Log the payload to debug if necessary
      console.log("JWT Payload:", jwt_payload);
      User.findById(jwt_payload._id)
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => done(err, false));
    })
  );
};
