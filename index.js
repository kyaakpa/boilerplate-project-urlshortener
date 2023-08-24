require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { randomInt } = require("crypto");


const shortURLs = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

// shorturl post page
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const shortenedURL = randomInt(10).toString();

  console.log(url, shortenedURL);
  res.status(200).json({
    original_url: url,
    short_url: shortenedURL,
  });

  shortURLs[shortenedURL] = url;
});

app.get("/api/shorturl/:shortURL", (req, res) => {
  const requestedShortURL = req.params.shortURL;
  const originalURL = shortURLs[requestedShortURL]

  if(originalURL){
    res.redirect(originalURL)
  } else {
    res.status(400).json({error: 'invalid url'})
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}..`);
});
