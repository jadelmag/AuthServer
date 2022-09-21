const express = require("express");
const cors = require("cors");
const { dbConnection } = require("./database/config");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

dbConnection();

app.use(express.static("./public"));

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route"));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
