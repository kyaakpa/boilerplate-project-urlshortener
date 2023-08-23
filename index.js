require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const { randomInt } = require('crypto');
const { METHODS } = require('http');

// Basic Configuration
const port = process.env.PORT || 3000;

const shortenedURLs = {};
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// app.post('/api/shorturl', (req,res) => {
//   const shortenedURL = randomInt(200);
//   const url = req.body.url
//   dns.lookup(url, (err) => {
//     if(err){
//       console.log(err)
//       return res.status(200).json({error: 'Invalid URL'})
//     } else{
//       console.log(`Validation success for ${url}`)
//       shortenedURLs[0] = url
//       res.json({original_url: url, short_url: shortenedURL})
//     }

//   })
// })

// app.get('/api/shorturl/:shortURL', (req,res)=> {
//   const requestedShortURL = parseInt(req.params.shortURL);
//   const originalURL = shortenedURLs[0]

//   if(requestedShortURL === shortenedURL){
//     console.log('yes they are same')
//     console.log(originalURL)
//     res.redirect(originalURL)
//   } else{
//     res.status(404).send('404 error')
//   }
// })

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  dns.lookup(url, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Invalid URL' });
    } else {
      const shortenedURL = randomInt(200).toString();
      shortenedURLs[shortenedURL] = url; // Store the mapping
      console.log(`Validation success for ${url}`);
      res.json({ original_url: url, short_url: shortenedURL });
    }
  });
});

app.get('/api/shorturl/:shortURL', (req, res) => {
  const requestedShortURL = req.params.shortURL;
  const originalURL = shortenedURLs[requestedShortURL];

  if (originalURL) {
    res.redirect(originalURL);
  } else {
    res.status(404).send('Shortened URL not found');
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}..`);
});
