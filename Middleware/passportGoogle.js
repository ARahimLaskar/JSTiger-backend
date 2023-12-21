const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { displayName: name, emails, picture } = profile;
        // console.log("profile", profile);
        const email = emails[0].value;
        const image = picture && picture.length > 0 ? picture[0].value : null;

        // Checking if user does not exist in the database
        let user = await UserModel.findOne({ email });
        if (!user) {
          const password = "";
          const hashedPassword = await bcrypt.hash(password, 10);

          user = new UserModel({
            name,
            email,
            password: hashedPassword,
            picture: image,
          });
          await user.save();
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

//  store the user in the session
passport.serializeUser((user, done) => {
  done(null, user.user.id);
});

// retrieve user information using the stored userId
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
module.exports = passport;
