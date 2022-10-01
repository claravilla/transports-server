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
     res.status('200').send({status: data.data[0].lineStatuses[0].statusSeverityDescription, details: data.data[0].lineStatuses[0].reason });
 }).catch((error) => {
     res.status(error.response.data.httpStatusCode).send(error.response.data.message);
 })

})

app.get('/', function(req,res) {
    res.status(200).send('this is not the page you are looking for');
})

app.get('/stop/:id', (req, res)=> {
    const { id: stopId } = req.params;
    const url = `https://api.tfl.gov.uk//StopPoint/${stopId}/Arrivals?app_id=${process.env.PRIMARY_KEY}&app_key=${process.env.SECONDARY_KEY}`;
  axios.get(url)
  .then((data)=> {
      const results = data.data;
      let busTimes = results.map((eachBus)=>{
          return {
              bus:eachBus.lineId, 
              time: Math.floor(eachBus.timeToStation/60),
          }
      }).sort((a, b)=>{
          return (a.time-b.time);
      })
      res.send(busTimes);
  })
  .catch((error) => {
    res.status(error.response.data.httpStatusCode).send(error.response.data.message);
});
   
})




app.listen(process.env.PORT || 8080, function(){
    console.log ("server is listening on port 8080");
});