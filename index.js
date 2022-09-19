const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.ORIGIN || 'http://localhost:3000'
}));

app.get('/:id', function (req, res) {
  let { id: tube} = req.params;
  if (tube==='hammersmith') {
      tube = 'hammersmith-city';
  }
  const url = `https://api.tfl.gov.uk/Line/${tube}/Status?app_id=${process.env.PRIMARY_KEY}&app_key=${process.env.SECONDARY_KEY}`
 axios.get(url)
 .then((data) => {
     res.status('200').send(data.data[0].lineStatuses[0].statusSeverityDescription);
 }).catch((error) => {
     res.status(error.response.data.httpStatusCode).send(error.response.data.message);
 })

})





app.listen(8080, function(){
    console.log ("server is listening on port 8080");
});