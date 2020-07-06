getSupportedCountries();

//function 1 = calculate concentration, input = AQI

//function 2 = get particles inhaled, input = type of mask, AQI (call function 1)

//test case if AQI = 145 it should return 53.36, if AQI = 50, it should return 12.

//predefined type kept as string

//git status to see changed files

var concentrationrangeList = [12, 23.3, 19.9, 94.9, 99.9, 99.9, 99.9, 99.9, 149.9, 149.9];
var concentrationlowList = [0, 12.1, 35.5, 55.5, 150.5, 150.5, 250.5, 250.5, 350.5, 350.5];
var aqiList = [0, 51, 101, 151, 201, 201, 301, 301, 401, 401];
var aqirangeList = [50, 49, 49, 50 , 100, 100, 100, 100, 100, 100];

var maskTypes =  {"noMask": 1, "clothMask": 0.85, "n95": 0.05};
var activity =  {"Light": 30, "Medium": 50, "Strenuous": 80};


function calcConcentration(aqi) {
  var index = ~~(aqi/50);
  //console.log(index);
  var concentrationRange = concentrationrangeList[index];
  //console.log(concentrationRange);
  var aqiLow = aqiList[index];
  //console.log(aqiLow);
  var concentrationLow = concentrationlowList[index];
  var aqiRange = aqirangeList[index];
  //console.log(aqiRange);
  var concentration = ((aqi-aqiLow)*(concentrationRange)/(aqiRange)) + concentrationLow;

  return concentration;
}


//console.log(calcConcentration(aqi));

function maskFilter(aqi, mask) {
  var maskTypes =  {"noMask": 1, "clothMask": 0.85, "n95": 0.05};

  var inhaled = maskTypes[mask]*calcConcentration(aqi);
  return inhaled;
}

function getLabels(){
  const keys = Object.keys(maskTypes);
  return keys;
}

function getReadableMaskName(maskCode) {
  var namesDict = {'clothMask':"Cloth mask",'noMask':"No mask",'n95':'N95 mask'}
  return namesDict[maskCode]
}

function getReadableLabels(myKeys) {
  var readableLabels = [];
  for (i=0; i<myKeys.length; i++) {
    var maskCode = myKeys[i];
    readableLabels.push(getReadableMaskName(maskCode));
  }
  // console.log("hereeeeee"+str(myKeys));
  return readableLabels;
}
var keys = getLabels();

function getData(keys) {
  var data = [];
  for (i=0; i<keys.length; i++) {
    var mask = keys[i];
    data.push(maskFilter(aqi, mask));
    console.log(data)
  }
  return data;
}

function getLitrePerMinuteByActivity(activityName) {
  var activity =  {"Light": 30, "Medium": 50, "Strenuous": 80};
  return activity[activityName];
}

function getPollutionBreath(litrePerMinute, concentrationMicrogramsPerMeterCubed, duration) {
  var perLitre = convertMicroGramPerCubicMetreToMicroGramPerLiter(concentrationMicrogramsPerMeterCubed)
  console.log(perLitre)
  return Math.round(litrePerMinute*perLitre*duration);

  //activity is in Litres per minute
  //concentration is Micrograms/Meter^3
  //duration is in Minutes
  //output in micrograms
}

function getHealthyMicrogram(duration){
  perLitre = getLitrePerMinuteByActivity("Light")
  return Math.round(perLitre*0.0354*duration)
}

function getActivityLabels(){
  const activityKeys = Object.keys(activity);
  console.log(activityKeys);
  return activityKeys;
}

function getBreathPerMask(activity, duration, aqi) {
  var data = [];
  var keys = getLabels();
  activityKey = getLitrePerMinuteByActivity(activity)
  for (i=0; i<keys.length; i++) {
    var perLitre = maskFilter(aqi, keys[i]);
    console.log("getPollutionBreath: " + getPollutionBreath(activityKey, perLitre, duration))
    console.log("activityKey: " + activityKey)
    console.log("perLitre: " + perLitre)
    console.log("duration: " + duration)
    data.push(getPollutionBreath(activityKey, perLitre, duration));
    //activity is int
    //activityKey is string
    //perliter is int
    //duration is int
    //
  }
  return data;
}

function convertMicroGramPerCubicMetreToMicroGramPerLiter(concentration) {
  console.log("hi ")
  console.log(concentration)
  return concentration/1000;
  //input is in Micrograms/Meter^3
  //output is in Micrograms/Liter

}

//console.log(getActivities(activityKeys))

//console.log("Calling getBreathPerMask")
//console.log(getBreathPerMask("Light", 5, 50))

//console.log(getData(keys));
//console.log(getLitrePerMinuteByActivity("Light"))
//console.log(convertMicroGramPerCubicMetreToMicroGramPerLiter(100))

//console.log(maskFilter(aqi, "noMask"));

function loadFirstAqiDataAndInitVisualization() {

    var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
    var aqi;
    var settings = {
      "url": "https://api.airvisual.com/v2/nearest_city?key="+key,
      "method": "GET",
      "timeout": 0,
    };


    $.ajax(settings).done(function (response) {
    // console.
      aqi = response['data']['current']['pollution']['aqius']
      localStorage.setItem("aqi", aqi);

      locationName = response['data']['state']+", "+response['data']['country']
      document.getElementById('locationName').innerHTML = "Your city is "+locationName+", current AQI level is "+aqi
      console.log(response);
      console.log(aqi)
      init(aqi)
      updatePerson(defaultDuration,aqi,'noMask',defaultActivity)
    });

    console.log(getSupportedCountries());
  }

  function loadAqiOnButtonClick() {

      var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
      var aqi;
      var city = document.getElementById("city").value;
      var state = document.getElementById("state").value;
      var country = document.getElementById("country").value;

      var settings = {
        "url": "https://api.airvisual.com/v2/city?city="+city+"&state="+state+"&country="+country+"&key="+key,
        "method": "GET",
        "timeout": 0,
      };


      $.ajax(settings).done(function (response) {
      // console.
        aqi = response['data']['current']['pollution']['aqius']
        localStorage.setItem("aqi", aqi);

        locationName = response['data']['state']+", "+response['data']['country']
        document.getElementById('locationName').innerHTML = "Your city is "+locationName+", current AQI level is "+aqi
        console.log("LINE 190"+response);
        console.log(aqi)
        // init(aqi)
        //updatePerson(defaultDuration,aqi,'noMask',defaultActivity)
        //return aqi;
        adddata(aqi);
      });

      console.log(getSupportedCountries());

    }

function getSupportedCountries(){
    var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
    var aqi;
    var settings = {
      "url": "https://api.airvisual.com/v2/countries?key="+key,
      "method": "GET",
      "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
    // console.
      // aqi = response['data']['current']['pollution']['aqius']
      // localStorage.setItem("aqi", aqi);
      //locationName = response['data']['state']+", "+response['data']['country']
      //document.getElementById('locationName').innerHTML = "Your nearest city is "+locationName+", current aqi level is "+aqi
      var countriesDictionary = response['data'];
      console.log(countriesDictionary)
      var countriesArray = [];
      for (i=0; i<countriesDictionary.length; i++) {
        for (var propName in countriesDictionary[i]) {
          if(countriesDictionary[i].hasOwnProperty(propName)) {
            var propValue = countriesDictionary[i][propName];
            countriesArray.push(propValue);
          }
        }
      }
      console.log(countriesArray);
      addCountriesToDropdown(countriesArray);
    });
}

function addCountriesToDropdown(countriesArray){
    var countryDropdown = document.getElementById("country");

    for(var i = 0; i < countriesArray.length; i++) {
        var country = countriesArray[i];
        var element = document.createElement("option");
        element.textContent = country;
        element.value = country;
        countryDropdown.appendChild(element);
        //console.log(element)
    }
    console.log(countryDropdown)
}

function addStatesToDropdown(statesArray){
    var stateDropdown = document.getElementById("state");

    for(var i = 0; i < statesArray.length; i++) {
        var state = statesArray[i];
        var element = document.createElement("option");
        element.textContent = state;
        element.value = state;
        stateDropdown.appendChild(element);
        console.log(element)
    }
    console.log(stateDropdown)
}

function addCitiesToDropdown(citiesArray){
    var cityDropdown = document.getElementById("city");

    for(var i = 0; i < citiesArray.length; i++) {
        var city = citiesArray[i];
        var element = document.createElement("option");
        element.textContent = city;
        element.value = city;
        cityDropdown.appendChild(element);
        console.log(element)
    }
    console.log(cityDropdown)
}

function reload(){
    var container = document.getElementById("country");
    var content = container.innerHTML;
    container.innerHTML= content;

   //this line is to watch the result in console , you can remove it later
    console.log("Refreshed");
}

function removePreviousElements(selectName) {
    var i, L = selectName.options.length - 1;
    for(i = L; i >= 0; i--) {
      selectName.remove(i);
    }
}

function defaultCityRemove(){
    $("select#city option[value='defaultCity']").remove();
}

function stateAndCityBoxReset(){
    removePreviousElements(document.getElementById("state"));
    removePreviousElements(document.getElementById("city"));
    $("select#country option[value='defaultCountry']").remove(); //remove the default country
    $("#state").append('<option id="defaultState" value="defaultState">*Select State*</option>');
    $("#city").append('<option id="defaultCity" value="defaultCity">*Select City*</option>');
}
function cityBoxReset(){
    removePreviousElements(document.getElementById("city"));
    $("select#state option[value='defaultState']").remove();
    $("#city").append('<option id="defaultCity" value="defaultCity">*Select City*</option>');
}

function getSupportedStates(country) {
    var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
    var settings = {
      "url": "https://api.airvisual.com/v2/states?country="+country+"&key="+key,
      "method": "GET",
      "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
    // console.
      // aqi = response['data']['current']['pollution']['aqius']
      // localStorage.setItem("aqi", aqi);
      //locationName = response['data']['state']+", "+response['data']['country']
      //document.getElementById('locationName').innerHTML = "Your nearest city is "+locationName+", current aqi level is "+aqi
      stateAndCityBoxReset();
      var statesDictionary = response['data'];
      console.log(statesDictionary)
      var statesArray = [];
      for (i=0; i<statesDictionary.length; i++) {
        for (var propName in statesDictionary[i]) {
          if(statesDictionary[i].hasOwnProperty(propName)) {
            var propValue = statesDictionary[i][propName];
            statesArray.push(propValue);
          }
        }
      }
      console.log(statesArray);
      addStatesToDropdown(statesArray);
    });
  }

function getSupportedCities(state) {
  var key = "28b76057-00b8-4fd0-b3a2-8dec32ad5459"
  var country = document.getElementById("country").value;
  var settings = {
    "url": "https://api.airvisual.com/v2/cities?state="+state+"&country="+country+"&key="+key,
    "method": "GET",
    "timeout": 0,
  };

  $.ajax(settings).done(function (response) {
  // console.
    // aqi = response['data']['current']['pollution']['aqius']
    // localStorage.setItem("aqi", aqi);
    //locationName = response['data']['state']+", "+response['data']['country']
    //document.getElementById('locationName').innerHTML = "Your nearest city is "+locationName+", current aqi level is "+aqi
    cityBoxReset()
    var citiesDictionary = response['data'];
    console.log(citiesDictionary)
    var citiesArray = [];
    for (i=0; i<citiesDictionary.length; i++) {
      for (var propName in citiesDictionary[i]) {
        if(citiesDictionary[i].hasOwnProperty(propName)) {
          var propValue = citiesDictionary[i][propName];
          citiesArray.push(propValue);
        }
      }
    }
    console.log(citiesArray);
    addCitiesToDropdown(citiesArray);
    });
}

function adddata(aqiInput) {
    console.log("Going into adddata")
    var activity = document.getElementById("activity").value;
    console.log("activity: " + activity)
    var duration = document.getElementById("timeSpent").value;
    console.log("duration: " + duration)
    var chosenMask = document.getElementById("selectedMask").value;
    console.log("mask: " + chosenMask)
    //aqi = loadAqiOnButtonClick(city, state, country)
    console.log("At line 386, aqi="+aqi)
    var indexOfMask = maskTypesString.indexOf(chosenMask);
    var aqi = aqiInput;
    data = getBreathPerMask(activity, duration, aqi);
    console.log("data: " + data)

    updatePerson(duration,100,chosenMask,activity)

    //update data
    myChart.data.datasets[0].data = data;

    //update healthy
    healthy = getHealthyMicrogram(duration);
    console.log("healthy: " + healthy)
    myChart.options.annotation.annotations[0].value = healthy;
    myChart.options.annotation.annotations[0].label.content = "Maximum Healthy Level: " + healthy

    //default color
    for (i=0; i<3; i++) {
      myChart.data.datasets[0].backgroundColor[i] = 'rgba(192,192,192, 1)';
    }

    //update color
    var greenBound = 0.1*healthy;
    var redBound = healthy;

    for (i=0; i<3; i++) {
      if(data[i]<=greenBound) {
          myChart.data.datasets[0].backgroundColor[i] = 'rgba(0,192,0, 1)';
      }
      else if (data[i]>=redBound) {
          myChart.data.datasets[0].backgroundColor[i] = 'rgba(192,0,0, 1)';
      }
      else {
          myChart.data.datasets[0].backgroundColor[i] = 'rgba(255, 165, 0, 1)';
      }
    }

    myChart.options.scales.xAxes[0].ticks.suggestedMax = 1.2*healthy;

    //myChart.data.datasets[0].backgroundColor[indexOfMask] = 'rgba(0,192,0, 1)';
    myChart.update();
    //addCountriesToDropdown();
}


function init(aqi) {
    var ctx = document.getElementById('myChart');
    healthy = getHealthyMicrogram(defaultDuration);
    data = getBreathPerMask(defaultActivity, defaultDuration, aqi);

    Chart.defaults.global.defaultFontSize = 17;
    Chart.defaults.global.defaultFontColor = '#000000';
    myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: getReadableLabels(maskTypesString),
            datasets: [{
                data: data,
                backgroundColor: [
                colorNoMask, colorClothMask, colorN95
                ],

                borderColor: [
                    'rgba(192,192,192, 1)',
                    'rgba(192,192,192, 1)',
                    'rgba(192,192,192, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'PM 2.5 Breathed in For Each Type of Mask (Microgram)',
            fontSize:20
          },
          annotation: {
            annotations: [{
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: healthy,
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 5,
              label: {
                enabled: true,
                content: "Maximum Healthy Level: " + healthy
              }
            }],
          },
          scales: {
              xAxes: [{scaleLabel: {
                        display: true,
                        labelString: 'PM 2.5 Breathed in total duration (Microgram)'},
                  ticks: {
                      suggestedMax: 1.2*healthy,
                      beginAtZero: true
                  }
              }],
              yAxes: [{scaleLabel: {
                        display: true,
                        labelString: 'Type of Mask'},
                  ticks: {
                      beginAtZero: true
                  }
              }]
            }
        }
    });
}
