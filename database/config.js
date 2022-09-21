const mongoose = require("mongoose");

const dbConnection = () => {
  try {
    const url = `${process.env.DB_CNN}/Maps`;
    mongoose.connection.openUri(url, (err, res) => {
      if (err) throw err;
      console.log(
        "Database running on port 27017: \x1b[32m%s\x1b[0m",
        "online"
      );
    });
  } catch (err) {
    console.log("Error connecting database: ", err);
    throw new Error("Error connecting database");
  }
};

module.exports = {
  dbConnection,
};
