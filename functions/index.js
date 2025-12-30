const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let currentToken = 0;

// Hardware updates token here
app.post("/updateToken", (req, res) => {
  currentToken = req.body.token;
  res.json({success: true});
});

// Frontend reads token here
app.get("/getToken", (req, res) => {
  res.json({token: currentToken});
});

exports.api = functions.https.onRequest(app);
