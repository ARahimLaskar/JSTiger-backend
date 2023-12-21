const mongoose = require("mongoose");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.ATLAS_URL);
    console.log("connected to database");
  } catch (error) {
    console.log("error connecting database", error);
  }
}
module.exports = { connectDatabase };
