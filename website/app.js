/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Personal API Key for OpenWeatherMap API
//let baseURL = 'http://api.openweathermap.org/data/2.5/forecast?id=2332459&APPID=';
let baseURL = 'http://api.openweathermap.org/data/2.5/forecast?';

const apiKey = 'c28b57828b6519027d80f56bc35387fa';

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e){
  //getWeatherData(baseURL, apiKey)
  const feelings = document.getElementById('feelings').value;
  const zipCode = document.getElementById('zip').value;
  
  let theZip = `zip=${zipCode}`;
  
  let theAPIKey = `&apiKey=${apiKey}`;
  
  getWeatherData(baseURL, theZip, theAPIKey)
  .then(function(data){
    //console.log(data);
    postData('/addWeatherData', {temp:data.list[0].main.temp, pressure:data.list[0].main.pressure, feelings: feelings})
    
    updateUI()
  })
}

const updateUI = async () => {
  const request = await fetch('/all')
  try {
    const allData = await request.json()
    // console.log("All data is "+ allData);
    // var last = allData[allData.length - 1];
    // allData.forEach(function(element) {
    //   console.log("Last Temp is: " + element.temp);
    //   console.log("Last Pressure is: " + element.pressure);
    //   console.log("Last Feeling is: " + element.feelings);
    // });
    
    document.getElementById('date').innerHTML = newDate;
    document.getElementById('temp').innerHTML = allData[allData.length - 1].temp;
    document.getElementById('content').innerHTML = allData[allData.length - 1].feelings;

  } catch(error){
    console.log("error", error);
  }
}

/* Function to GET Web API Data*/
const getWeatherData = async (baseUrl, zip, key)=>{
    console.log("Calling the new web api at: " + `${baseUrl}?zip=${zip}&apiKey=${key}`);
    console.log("Base URL is: " + baseURL + " Zip: " + zip + " API KEY: " + key);
    const res = await fetch(baseURL+zip+key);
   //const resp = await fetch(`${baseUrl}?zip=${zip}&apiKey=${key}`);
    try {
  
      const data = await res.json();
      //console.log(data)
      //postData('/addWeatherData', {temperature:data.list[0].main.temp, pressure:data.list[0].main.pressure, userData: 'Happy'});
      return data;
    }  catch(error) {
      console.log("error", error);
      // appropriately handle the error
    }
  }

/* Function to POST data */
const postData = async(url = '', data = {})=>{
  //console.log(data);
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  try {
    const newData = await response.json();
    // console.log("Printing Post Data");
    // console.log(newData);
    return newData;
  } catch(error) {
    console.log("error", error);
    // handle error
  }
}

/* Function to GET Project Data */