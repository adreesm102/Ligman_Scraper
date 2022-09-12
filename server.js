const express = require('express');
const bot=require('./ligman_scraper')
const app = express();
 
app.get('/', async(req, res) => {
  const response=await bot()
  res.send(response)
});
 
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});