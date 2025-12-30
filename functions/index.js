const functions = require("firebase-functions");

let currentToken = 0;

// Callable function for getting current token
exports.getToken = functions.https.onCall((data, context) => {
  return {"token": currentToken};
});

// HTTP function for updating token (for hardware)
exports.updateToken = functions.https.onRequest((req, res) => {
  if (req.method === "POST") {
    currentToken = req.body.token;
    res.json({"success": true});
  } else {
    res.status(405).json({"error": "Method not allowed"});
  }
});
