//below are functions
function updatePerson(duration,aqi,mask,activity) {
    var activityList = {"Light": 30, "Medium": 50, "Strenuous": 80};
    var paceList =  {"Light": 3, "Medium": 1.5, "Strenuous": 0.5};
    var pace = paceList[activity] //light 3,medium 1.5,strenuous 0.5
    var data = getBreathPerMask(activity, duration, aqi)
    var width = activityList[activity]
    var masks = getLabels()
    var breathBasedOnMask = data[masks.indexOf(mask)]

    // set logic to update person according to our AQI anaylysis here

    //set walking man parameters based on our aqi stuff
    if(healthy>breathBasedOnMask) {
      var color = 'green';
      var widthpixels = '60px';
    } else {
      var color = 'red';
      var widthpixels = '200px';
    }

    //update person, you can add more functions in person.js
    setChestWidth(widthpixels)
    setChestColor(color);
    setPace(pace);

    //update particles, you can add more functions in particles.js
    var numParticles = aqi;
    // updateParticles("#565C5E", 'particles-js', numParticles)

    if(aqi<50){
      var backgroundcolor = '#7AE4FE'
    }
    else if (aqi<150){
      var backgroundcolor = '#8FBDC9'
    }
    else {
      var backgroundcolor = '#626768'
    }

    // setBackgroundColor(backgroundcolor)
  }

function setChestColor(color) {
  $('.body').css({
    'background-color': color,
  });
}

function setChestWidth(width) {
  $('.body').css({
    'width': width
  });
}

function setPersonSize(width) {
  $('.body').css({
    'width': width
  });
}

function setPace(pace) {
  var animationDelay = (-1)*pace/2;
  $('.human').css({
    'animation': 'bodyBop '+pace+'s infinite'
  });

  $('.head').css({
      'animation': 'headBop '+pace+'s '+(0.4*pace)+'s infinite'
  });

  $('.arm').css({
      'animation': 'rotateArm '+pace+'s infinite'
  });

  $('.arm.left').css({
      'animation-delay': animationDelay+'s'
  });

  $('.arm.lower').css({
      'animation-delay': 'rotateLowerArm '+pace+'s infinite'
  });

  $('.leg').css({
      'animation': 'rotateLeg '+pace+'s infinite'
  });

  $('.leg.right').css({
      'animation-delay': animationDelay+'s'
  });

  $('.leg.right.foot').css({
      'animation-delay': animationDelay+'s'
  });

  $('.leg.lower').css({
      'animation': 'rotateLowerLeg '+pace+'s infinite'
  });

  $('.foot').css({
      'animation': 'rotateFoot '+pace+'s infinite'
  });
}
