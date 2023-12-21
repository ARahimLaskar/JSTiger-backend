const { connectDatabase } = require("./config/db");
const mogoose = require("mongoose");

const passport = require("passport");
// const cookieSession = require("cookie-session");
// const session = require("express-session");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { authentication } = require("./Middleware/authentication");

const passportSetup = require("./Middleware/passportGoogle");
const userRoutes = require("./Routes/userRoutes");
const vendorDataRoutes = require("./Routes/vendorDataRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// app.use(
//   session({
//     secret: "your-secret-key", // Change this to your secret key
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       secure: false, // Change this to 'true' in production if using HTTPS
//       maxAge: 24 * 60 * 60 * 1000, // Session max age in milliseconds
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.use("/auth", userRoutes);
// app.use(authentication);
app.use("/data", vendorDataRoutes);

const port = process.env.PORT || 8080;
connectDatabase().then(() => {
  app.listen(port, (err) => {
    if (err) {
      console.log("server Error", err);
    }
    console.log(`server listening on port ${port}`);
  });
});
