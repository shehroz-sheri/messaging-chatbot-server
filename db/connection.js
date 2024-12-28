const mongoose = require("mongoose");

const connectMongoDb = async (url) => {
  await mongoose.connect(url);
};

module.exports = connectMongoDb;
