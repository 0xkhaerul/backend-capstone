const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { prisma } = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
          // Do not auto-create users here. Instead pass a temporary object
          // indicating the Google profile info so the callback can decide
          // whether to redirect the user to complete registration.
          return done(null, {
            temp: true,
            email,
            googleId: profile.id,
            name: profile.displayName,
          });
        }

        return done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
