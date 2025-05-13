require("dotenv").config();
const path = require("path");
const getFacts = require("./controllers/factController");
const scrapeWiki = require("./utils/scrapper");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

const PORT = process.env.PORT;

app.get("/check", (req, res) => {
  res.status(200).send("App is running...");
});

app.post("/facts", getFacts);
app.post("/all-events", scrapeWiki);

app.listen(PORT, () => {
  console.log(`app is running at port ${PORT}...`);
});
