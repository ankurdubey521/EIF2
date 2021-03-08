const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

var request = require("request-promise");
const app = express();
const port = 5000;

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var probs = {
    "high": ["Andhra Pradesh","Odisha","Puducherry","Goa","Lakshadweep","Tamil Nadu","Kerala","Andaman and Nicobar Islands"],
    "med": ["West Bengal","Gujarat","Maharashtra","Karnataka"],
    "low": ["Telangana","Punjab","Haryana","Jammu & Kashmir","Himachal Pradesh","Rajasthan","Assam","Delhi","Bihar","Jharkhand","Chhattisgarh","Madhya Pradesh","Uttar Pradesh"]
};

app.get("/cyclone_prob", async (req, res) => {
  var {lat,lon} = req.query;
  var premium_rate;
  let route_url = "https://nominatim.openstreetmap.org/reverse?email=susiejojo1@gmail.com&format=jsonv2&lat="+lat+"&lon="+lon;
  const getobj = {
      method: "GET",
      uri: route_url
  }
  await request(getobj).then(function(result){
      console.log(result);
    //   console.log(result.place_id);
      let state = JSON.parse(result);
      state = state.address.state;
      console.log(state);
    //   let prob = JSON.parse(probs);
      var {high,med,low} = probs;
      var i;
      for (i = 0; i < high.length; i++) {
          if (high[i]==state){
            premium_rate = 0;
            console.log("High risk");
            break;
          }
        };
      for (i = 0; i < med.length; i++) {
        if (med[i]==state){
            premium_rate = 0;
            console.log("Medium risk");
            break;
        }
        };
            
      for (i = 0; i < low.length; i++) {
        if (low[i]==state){
            premium_rate = 0;
            console.log("Low risk");
            break;
        }
        };

    //   console.log(address);
    //   temp = weather.response[0].periods[0].tempC;


  }).catch(function(err){
      console.log(err);
      return res.status(400).json(JSON.parse(err.error));
  });
  res.status(200).json({"premium": premium_rate});
});

app.get("/check_payout",async(req,res)=>{
    var {lat,lon} = req.query;
    lat = parseFloat(lat).toFixed(2);
    lon = parseFloat(lon).toFixed(2);
    var cond,wind_speed,pressure;
    let api_key = "be43a2575f43d25e1508d83bba9465d7";
    let route_url = "https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+api_key;
    const getobj = {
        method: "GET",
        uri: route_url
    }
    await request(getobj).then(function(result){
        let weather = JSON.parse(result);
        cond = weather.weather[0].description;
        wind_speed = weather.wind.speed;
        pressure = weather.main.pressure;
        console.log(cond);


    }).catch(function(err){
        return res.status(400).json(JSON.parse(err.error));
    });
    if (cond=="tornado" && wind_speed>200 || pressure < 980)
        res.status(200).json({"statusCode": 200, "tornado": 1});
    else
    res.status(200).json({"statusCode": 200, "tornado": 0});
});


app.listen(port, () => console.log(`API server running on port ${port}`));