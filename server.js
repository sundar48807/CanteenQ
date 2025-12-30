import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let currentToken = 0;

// Hardware updates token here
app.post("/api/updateToken", (req, res) => {
  currentToken = req.body.token;
  res.json({ success: true });
});

// Frontend reads token here
app.get("/api/getToken", (req, res) => {
  res.json({ token: currentToken });
});

app.listen(5000, () => console.log("Server running on port 5000"));
