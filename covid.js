
//MAKE THE CHART

//function 1 = calculate concentration, input = AQI

//function 2 = get particles inhaled, input = type of mask, AQI (call function 1)

//test case if AQI = 145 it should return 53.36, if AQI = 50, it should return 12.

//predefined type kept as string

//var location = {"bts": 10, "taxi": 4, "bus": 10, "mall": 2, "park": 1};
var locations = {"bts": 10, "taxi": 4, "bus": 10, "empty_mall": 2, "busy_mall": 3, "park": 1};
var avgdistancefromOthers = {"bts": 1, "taxi": 1, "bus": 0.1, "empty_mall": 2, "busy_mall": 0.5, "park": 5};
var maskTypes =  {"noMask": 1, "clothMask": 0.85, "n95": 0.05};
var TOTAL_DROPLET_PER_COUGH = 151550;
var minDropletsToGetInfected = TOTAL_DROPLET_PER_COUGH;
var TIME_BETWEEN_COUGH = 1;
var keys = getMaskTypes();
var bestSickPeopleProportion = 0.1;
var worstSickPeopleProportion = 0.5;
var minimumDistanceToNotGetInfectedMeters = 2;


function howmanyCough(duration) {
  return duration/TIME_BETWEEN_COUGH;
}

function maskTypesStringToMaskTypes(maskTypesString) {
  maskTypesString[0] = "No Mask";
  maskTypesString[1] = "Cloth Mask";
  maskTypesString[2] = "N95 Mask";
  return maskTypesString;
}

function dropletsPerMask(duration, locationInput) {
  maskChart = []
  maskChartBest = [];
  maskChartWorst = [];
  for (i=0;i<keys.length;i++) {
    filter = maskTypes[keys[i]]
    filteredBestCase = getDropletsExposed(bestSickPeopleProportion, duration, locationInput) * filter
    maskChartBest.push(filteredBestCase);
    filteredWorstCase = getDropletsExposed(worstSickPeopleProportion, duration, locationInput) * filter
    maskChartWorst.push(filteredWorstCase);
  }
  maskChart.push(maskChartBest);
  maskChart.push(maskChartWorst);
  return maskChart;
}
console.log(dropletsPerMask(10, "bts"))

function getDropletsExposed(sickPeopleRatio, duration, locationInput) {
  var howmanyCoughs = howmanyCough(duration);
  //console.log("Coughs = "+ str(howmanyCoughs))
  var totalCoughs = sickPeopleRatio*howmanyCoughs*locations[locationInput];
  var avgDistanceByLocation = avgdistancefromOthers[locationInput];
  var factor = Math.max((-avgDistanceByLocation/minimumDistanceToNotGetInfectedMeters + 1),0);
  var totalDroplets = factor*totalCoughs*TOTAL_DROPLET_PER_COUGH;
  return totalDroplets;
//   // location (eg. bts) is how many people within distance where cough can infect
//   // multiply with 0.1 or 0.5 for best/worst case
//   // multiply number of coughs with "location" to get total cough
//   // multiply total cough with droplet per cough
//   // return number of droplets exposed
//
//   //cough  0 < x < 2m high risk
//   //sneeze  0 < x < 4m high risk
//   //droplet * multiplier (depends on distance, is 1 for 0m)
//   //dropletMultiplierCough = -distance/2 + 1
//   //dropletMultiplierSneeze = -distance/4 + 1
//   //assume that number of particles decreases linearly with avgdistancefromOthers
//   //use average droplets per cough (900 + 302200) / 2 = 151,550
//
//
//   //ex 1 best case
//   //location = bts (10 people) * 0.1 (ratio of sick to not sick) = 1 (people who will cough)
//   //assume that people are facing you.
//   //avgdistancefromOthers = 1, dropletMultiplierCough = -1/2 + 1 = 0.5
//   //duration = 10 minute
//   //avgtimebetweencough = 1 Minute
//   //droplet per cough = lower bound: 900 * number of cough, higher bound: 302200 * number of cough
//   //droplets total best = 151,550 * (10 / 1) * (10 * 0.1) * 0.5 = 757,750 particles
//   //droplets total worst = 151,550 * (10 / 1) * (10 * 0.5) * 0.5 = 3,788,750 particles
//   //droplets to get infected = 900 particles, research for correct one
//   //droplet per sneeze
  }
console.log(getDropletsExposed(0.5, 10, "bus", 1));
console.log(getDropletsExposed(0.1, 10, "bus", 1));


function getMaskTypes(){
  console.log(maskTypes);
  var keys = Object.keys(maskTypes);
  return keys;
}


function adddataCovid() {
  console.log("Going into adddata")
  var inputtedLocation = document.getElementById("locationInput").value;
  console.log("location: " + inputtedLocation)
  var timeSpent = document.getElementById("duration").value;
  console.log("duration: " + timeSpent)
  var chosenMask = document.getElementById("selectedMask").value;
  console.log("mask: " + chosenMask)
  var indexOfMask = maskTypesString.indexOf(chosenMask);
  data = dropletsPerMask(timeSpent, inputtedLocation);
  console.log("data: " + data)

  //update data
  console.log("initial dataset: " + myChart.data.datasets[0].data)
  myChart.data.datasets[0].data = data[0];
  console.log("changed dataset: " + myChart.data.datasets[0].data)
  myChart.data.datasets[1].data = data[1];

  //default color
  //for (i=0; i<3; i++) {
  //  myChart.data.datasets[0].backgroundColor[i] = 'rgba(192,192,192, 1)';
//  }

  //update color
  myChart.data.datasets[0].backgroundColor[indexOfMask] = 'rgba(0,192,0, 1)';
  console.log("Color: " + myChart.data.datasets[0].backgroundColor[indexOfMask])

  //update healthy
  console.log("Minimum droplets to get infected: " + minDropletsToGetInfected )
  myChart.options.annotation.annotations[0].value = minDropletsToGetInfected;
  myChart.options.annotation.annotations[0].label.content = "Minimum number of droplets for infection: " + minDropletsToGetInfected
  myChart.update();
}


function initCovid() {
  var maskTypesString = maskTypesStringToMaskTypes(getMaskTypes());
  var ctx = document.getElementById('myChart');
  data = dropletsPerMask(defaultDuration, defaultLocation);

  Chart.defaults.global.defaultFontSize = 17;
  Chart.defaults.global.defaultFontColor = '#000000';
  console.log(data);
  console.log("Mask Types:" + maskTypesString);
  console.log(maskTypesString[0]);
  console.log("Minimum droplets to get infected: " + minDropletsToGetInfected);
  console.log("ctx: " + ctx);
  myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: maskTypesString,
          datasets: [
            {
              label: "Best Case",
              backgroundColor: "pink",
              borderColor: "red",
              borderWidth: 1,
              data: data[0]
            },
            {
              label: "Worst case",
              backgroundColor: "lightblue",
              borderColor: "blue",
              borderWidth: 1,
              data: data[1]
            }
          ]},
      options: {
        title: {
            display: true,
            text: 'Total Germ Droplets Exposed to for Each Mask Type (Microgram)',
            fontSize: 20
        },
        annotation: {
          annotations: [{
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: minDropletsToGetInfected,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 5,
            label: {
              enabled: true,
              content: "Minimum droplets to get infected: " + minDropletsToGetInfected
            }
          }],
        },
        scales: {
            yAxes: [{scaleLabel: {
                      display: true,
                      labelString: 'Total Number of Droplets Exposed'},
                ticks: {
                    beginAtZero: true //Add comma to Y-axis
                }
            }],
            xAxes: [{scaleLabel: {
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
