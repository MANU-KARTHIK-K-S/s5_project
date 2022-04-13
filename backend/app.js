const express = require("express");
const path = require("path");
const cors = require("cors");
const management = require("./routes/management_controller");
const port = 3001;

//Connection Info

const app = express();

app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(management);

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;
