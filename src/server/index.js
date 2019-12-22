// Setup empty JS object to act as endpoint for all routes
const projectData = [];
const travelPlanner = {};

// Require Express to run server and routes
const express = require('express');
const request = require('request');
const https = require('https');
const util = require('util');
const DarkSky = require('dark-sky');
const moment = require('moment');
const pixabay = require('pixabay-api');
const dotenv = require('dotenv');
dotenv.config();

const PixabayApi = require('node-pixabayclient');
const PixabayPhotos = new PixabayApi({ apiUrl: "https://pixabay.com/api/" });

// Start up an instance of app
const app = express();

const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Initialize the main project folder
app.use(express.static('dist'));

const port = 8080;

// Setup Server
const server = app.listen(port, listening);

function listening(){
    console.log('Server running');
    console.log(`running on localhost: ${port}`);
};

// From https://stackoverflow.com/questions/563406/add-days-to-javascript-date
// Date.prototype.addDays = function(days) {
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
// }

app.get('/user', function(req, res) {
    res.status(200).json({ name: 'john' });
  });

app.post('/getWeather', async (req, res, next) => {
    const travelPlanner = [];
    let low = '';
    let high = '';
    
    //console.log("Getting weather data at latitude: " + req.body.lat);
    //console.log("Getting weather data at longitude: " + req.body.lng);
    let latitude = req.body.lat;
    let longitude = req.body.lng;
    let location = req.body.location;
    let departureDate = req.body.date;
    console.log("Departure Date is: " + departureDate);
    var dateLiterals = departureDate.split("/");
    
    let year = dateLiterals[2];
    let month = dateLiterals[0];
    let day = dateLiterals[1];

    //Convert month to number and subtract one
    let monthInNum = parseInt(month);
    let properMonth = monthInNum - 1;

    console.log("Year: " + year);
    console.log("Month: " + properMonth);
    console.log("Day: " + day);

    var target = new Date(year, properMonth, day);

    var today = new Date();

    var nextWeek = new Date();
    
    nextWeek.setDate(today.getDate()+7);

    console.log("Today is: " + today);
    console.log("Next week is: " + nextWeek);
    console.log("Target is: " + target);
    let theTime = year+'-'+monthInNum+'-'+day;

    console.log("The time is: " + theTime);

    var diff = (target - today)/1000;
    //diff = Math.abs(Math.floor(diff));
    diff = Math.floor(diff);

    var days = Math.floor(diff/(24*60*60));

    console.log("Date difference from target days is: " + days);

    var daysToTrip = '';

    if(days < 0) {
        daysToTrip = Math.abs(days) + ' days ago';
    } else if(days > 0) {
        daysToTrip = Math.abs(days) + ' days away';
    } else {
        daysToTrip = 'today';
    }

    // if(target > nextWeek) {
    //     console.log("Date supplied is greater than next week");
    // } else {
    //     console.log("Date supplied is within this week");
    // }

    let apiKey = `${process.env.DARK_SKY_API_KEY}`
    console.log("DarkSky API Key in env is: " + apiKey);
    
    let proxy = 'https://cors-anywhere.herokuapp.com/';
    // let theAppURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+latitude+','+longitude+'?exclude=currently,flags';
    let theAppURL = 'https://api.darksky.net/forecast/'+apiKey+'/'+latitude+','+longitude;
    console.log("Calling: "+ theAppURL);

    const darksky = new DarkSky(apiKey) // Your API KEY can be hardcoded, but I recommend setting it as an env variable.
    
    try {
        const forecast = await darksky
        .options({
            latitude,
            longitude,
            //time: moment().subtract(1, 'weeks')
            time: theTime //Based on the time it gets the data as forecast or current
        })
        .get()
        //res.status(200).json(forecast)
        //console.log("The Response is: " + util.inspect(forecast));
        //console.log("The Response is: " + forecast.daily.data[0].summary);

        summary = forecast.currently.summary;
        high = forecast.daily.data[0].temperatureHigh;
        low = forecast.daily.data[0].temperatureLow;
        console.log("Summary is: " + summary);
        //console.log("Temerature is: " + forecast.currently.temperature);
        
        //return the summary, temperature, pressure and the imagelink
    }  catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }

    console.log("Pixabay API Key in env is: " + `${process.env.PIXABAY_API_KEY}`);
    try {
        var params = {
            key: `${process.env.PIXABAY_API_KEY}`,
            q: location, // automatically URL-encoded
            image_type: "photo",
          };

          console.log("Calling Pixabay API");

          PixabayPhotos.query(params, function(errors, response, req) {
            if (errors) {
              console.log('One or more errors were encountered:');
              console.log('- ' + errors.join('\n- '));
              return;
            }
          
            //console.log('Photos request:');
            //console.log(req);
          
            console.log('Photos API response:');
            //console.log(util.inspect(response));
            let imgURL = response.hits[0].largeImageURL;
            //console.log("Large Image URL: " + imgURL);
            travelPlanner["image"] = imgURL;
            newEntry = {
                theSummary: summary,
                theLow: low,
                theHigh: high,
                theImage: imgURL,
                tripDays: daysToTrip
            }

            projectData.push(newEntry);

            //console.log("Travel Planner contains: " + util.inspect(travelPlanner));
            console.log("Travel planner is: " + projectData);

            res.send(projectData);
          });
    }  catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
})

module.exports = app;