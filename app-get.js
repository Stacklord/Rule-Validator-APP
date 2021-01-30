const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Joi = require("joi");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 8080;
const appName = "My Validator App";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(cors());

app.get("/", (req, res) => {
  console.log("My Validation APP");
  res.status(200).send({
    message: "My Rule-Validator APP",
    status: "success",
    data: {
      name: "Bamidele Ashiru",
      github: "@Stacklord",
      email: "ashirubamidele@gmail.com",
      mobile: "08166946170",
      twitter: "@hormotourllar",
    },
  });
});

app.listen(PORT, (res) => {
  console.log(`${appName} is listening on ${PORT}`);
});
