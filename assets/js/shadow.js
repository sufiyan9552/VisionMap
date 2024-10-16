export class ShadowAnalysis {
  constructor() {
    viewer.scene.globe.depthTestAgainstTerrain = true;
    //   this.element = document.getElementById("shadow-check");

    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.dynamicAtmosphereLighting = true;
    viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;
    let _this = this;

    this.scratchIcrfToFixed = new Cesium.Matrix3();
    this.scratchMoonPosition = new Cesium.Cartesian3();
    this.scratchMoonDirection = new Cesium.Cartesian3();

    //   this.element.addEventListener("change", function () {
    //     if (this.checked) {
    //       _this.start();
    //     } else {
    //       _this.destroy();
    //     }
    //   });


    //   this.date.valueAsDate = new Date();
    //   this.time.value = "12";
    this.timerId = null;
  }

//   stop() {
//     // Ensure elements are initialized before accessing them
//     const dateElement = document.getElementById("date");
//     const timeElement = document.getElementById("time");

//     if (!dateElement || !timeElement) {
//         console.error("Date or time elements are not found.");
//         return;
//     }

//     // Turn off shadows
//     viewer.shadows = false;
//     clearTimeout(this.timerId);  // Clear any running timer

//     // Disable terrain lighting
//     viewer.scene.globe.enableLighting = false;

//     // Get the current date and set the time to 12:00 PM (noon)
//     const currentDate = new Date();
//     currentDate.setHours(12, 0, 0, 0);  // Set the time to 12:00:00 (noon)

//     // Reset the clock to the current time and enable animation
//     viewer.clock.currentTime = Cesium.JulianDate.now();
//     viewer.clock.shouldAnimate = true;

//     // Reset the date and time values in the input fields
//     dateElement.valueAsDate = currentDate; // Set date to current
//     timeElement.value = "12";  // Set time to 12 PM (noon)
//     this.setTiimeLabel(timeElement.value);

//     // Reset light settings
//     const moonLight = new Cesium.DirectionalLight({
//         direction: this.getMoonDirection(), // Updated every frame
//         color: new Cesium.Color(0.9, 0.925, 1.0),
//         intensity: 0.5,
//     });

//     const timeValue = parseInt(timeElement.value);
//     if (timeValue <= 18 || timeValue >= 7) {
//         const sunLight = new Cesium.SunLight();
//         viewer.scene.light = sunLight;
//     } else {
//         viewer.scene.light.direction = this.getMoonDirection(viewer.scene.light.direction);
//         viewer.scene.light = moonLight;
//     }
// }

  

  destroy() {
    viewer.shadows = false;
    clearTimeout(this.viewer);
    //Activate to turn on the shading of the terrain model.
    // viewer.terrainShadows = Cesium.ShadowMode.DISABLED
    //   this.shadow_body_element.classList.remove("visible");

    viewer.scene.globe.enableLighting = false;

    // Reset time to current time
    viewer.clock.currentTime = Cesium.JulianDate.now();
    viewer.clock.shouldAnimate = true;
    this.element.checked = false;
    this.date.valueAsDate = new Date();
    this.time.value = "12";
    this.setTiimeLabel(this.time.value);

    //--------------- Setting light in viewer's scene -----------
    const moonLight = new Cesium.DirectionalLight({
      direction: this.getMoonDirection(), // Updated every frame
      color: new Cesium.Color(0.9, 0.925, 1.0),
      intensity: 0.5,
    });

    let dateTimeString = this.date.value + "T" + this.time.value + ":00Z";
    let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
    let hours = Cesium.JulianDate.addHours(
      newTime,
      -5,
      new Cesium.JulianDate()
    );
    let minutes = Cesium.JulianDate.addMinutes(
      hours,
      -30,
      new Cesium.JulianDate()
    );
    let timeValue = this.time.value;

    if (timeValue <= 18 || timeValue >= 7) {
      const sunLight = new Cesium.SunLight();
      viewer.scene.light = sunLight;
    }

    if (timeValue >= 19 || timeValue <= 6) {
      viewer.scene.light.direction = this.getMoonDirection(
        viewer.scene.light.direction
      );
      viewer.scene.light = moonLight;
    }

    viewer.clock.currentTime = minutes;
  }

  getMoonDirection(result) {
    result = Cesium.defined(result) ? result : new Cesium.Cartesian3();
    const icrfToFixed = this.scratchIcrfToFixed;
    const date = viewer.clock.currentTime;
    if (
      !Cesium.defined(
        Cesium.Transforms.computeIcrfToFixedMatrix(date, icrfToFixed)
      )
    ) {
      Cesium.Transforms.computeTemeToPseudoFixedMatrix(date, icrfToFixed);
    }
    const moonPosition =
      Cesium.Simon1994PlanetaryPositions.computeMoonPositionInEarthInertialFrame(
        date,
        this.scratchMoonPosition
      );
    Cesium.Matrix3.multiplyByVector(icrfToFixed, moonPosition, moonPosition);
    const moonDirection = Cesium.Cartesian3.normalize(
      moonPosition,
      this.scratchMoonDirection
    );
    return Cesium.Cartesian3.negate(moonDirection, result);
  }

  start(sdate, stime) {
    let _this = this;
    viewer.shadows = true;
    viewer.scene.globe.enableLighting = true;
    const moonLight = new Cesium.DirectionalLight({
      direction: this.getMoonDirection(), // Updated every frame
      color: new Cesium.Color(0.9, 0.925, 1.0),
      intensity: 0.5,
    });
    let staticdate = "2024-09-06";  // Static date
    let statictime = "12:00";       // Static time
    let dateTimeString = sdate + "T" + statictime + ":00Z";

    let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
    let hours = Cesium.JulianDate.addHours(
      newTime,
      -5,
      new Cesium.JulianDate()
    );
    let minutes = Cesium.JulianDate.addMinutes(
      hours,
      -30,
      new Cesium.JulianDate()
    );
    viewer.clock.currentTime = minutes;
    viewer.clock.shouldAnimate = false;

    //   shadow_body_element.classList.add("visible");
    //   date.addEventListener("change", function () {
    //     let dateValue = _this.date.value;
    //     let timeValue = _this.time.value;

    //     if (timeValue < 10) {
    //       timeValue = `0${timeValue}`;
    //     }

    //     if (dateValue && timeValue) {
    //       let dateTimeString = dateValue + "T" + timeValue + ":00Z";
    //       let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
    //       let hours = Cesium.JulianDate.addHours(
    //         newTime,
    //         -5,
    //         new Cesium.JulianDate()
    //       );
    //       let minutes = Cesium.JulianDate.addMinutes(
    //         hours,
    //         -30,
    //         new Cesium.JulianDate()
    //       );
    //       viewer.clock.currentTime = minutes;
    //       viewer.clock.shouldAnimate = false;
    //     }
    //   });
    //   time.addEventListener("change", function () {
    //     let dateValue = date.value;
    //     let timeValue = time.value;
    //     console.log(timeValue);
    //     this.setTiimeLabel(timeValue);

    //     if (timeValue < 10) {
    //       timeValue = `0${timeValue}`;
    //     }

    //     if (timeValue <= 18 || timeValue >= 7) {
    //       const sunLight = new Cesium.SunLight();
    //       viewer.scene.light = sunLight;
    //     }

    //     if (timeValue >= 19 || timeValue <= 6) {
    //       viewer.scene.light.direction = getMoonDirection(
    //       viewer.scene.light.direction
    //       );
    //       viewer.scene.light = moonLight;
    //     }

    //     if (dateValue && timeValue) {
    //       let dateTimeString = dateValue + "T" + timeValue + ":00Z";
    //       let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
    //       let hours = Cesium.JulianDate.addHours(
    //         newTime,
    //         -5,
    //         new Cesium.JulianDate()
    //       );
    //       let minutes = Cesium.JulianDate.addMinutes(
    //         hours,
    //         -30,
    //         new Cesium.JulianDate()
    //       );
    //       viewer.clock.currentTime = minutes;
    //       viewer.clock.shouldAnimate = false;
    //     }
    //   });
  }


  setTiimeLabel(time) {


    if (time > 11 && time <= 24) {
      if (time == 12) {
        document.getElementById('rs-bullet').innerHTML = "12 pm";
      } else if (time == 24) {
        document.getElementById('rs-bullet').innerHTML = "12 am";
      } else {
        document.getElementById('rs-bullet').innerHTML = (time - 12) + " pm";
      }

    } else {
      if (time == 0) {
        time = 12;
      }
      document.getElementById('rs-bullet').innerHTML = time + " am";
    }

    var bulletPosition = (document.getElementById('time').value / document.getElementById('time').max);
    document.getElementById('rs-bullet').style.left = (bulletPosition * 80) + "px";

  }


  playTimeWise(date, time) {
    let dateValue = date;
    let timeValue = parseInt(time);
    if (timeValue >= 7 && timeValue <= 18) {
      const sunLight = new Cesium.SunLight();
      viewer.scene.light = sunLight;
    } else if (timeValue >= 19 || timeValue <= 6) {
      const moonLight = new Cesium.DirectionalLight({
        direction: this.getMoonDirection(),
        color: new Cesium.Color(0.9, 0.925, 1.0),
        intensity: 0.5,
      });
      viewer.scene.light = moonLight;
      viewer.scene.light.direction = this.getMoonDirection(viewer.scene.light.direction);
    }
    if (timeValue < 10) {
      timeValue = `0${timeValue}`;
    }
    if (dateValue && timeValue) {
      let dateTimeString = `${dateValue}T${timeValue}:00:00Z`;
      let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
      let adjustedTime = Cesium.JulianDate.addHours(newTime, -5, new Cesium.JulianDate());
      adjustedTime = Cesium.JulianDate.addMinutes(adjustedTime, -30, new Cesium.JulianDate());

      viewer.clock.currentTime = adjustedTime;
      viewer.clock.shouldAnimate = false;
    }
    if (timeslider) {
      timeslider.value = timeValue;  
    }
  timeValue = parseInt(timeValue) + 1;

    if (timeValue <= 24) {
      if (timeValue === 24) {
        $('#btn_play').removeClass("hidden");
        $('#btn_pause').addClass("hidden");
      } else {
        this.timerId = setTimeout(() => {
          this.playTimeWise(date, timeValue); 
        }, 3000); 
      }
    } else {
      $('#btn_play').removeClass("hidden");
      $('#btn_pause').addClass("hidden");
    }
  }


  onDateChange(date, time) {
    let dateValue = date;
    let timeValue = time;

    if (timeValue < 10) {
      timeValue = `0${timeValue}`;
    }

    if (dateValue && timeValue) {
      let dateTimeString = dateValue + "T" + timeValue + ":00Z";
      let newTime = Cesium.JulianDate.fromIso8601(dateTimeString);
      let hours = Cesium.JulianDate.addHours(
        newTime,
        -5,
        new Cesium.JulianDate()
      );
      let minutes = Cesium.JulianDate.addMinutes(
        hours,
        -30,
        new Cesium.JulianDate()
      );
      viewer.clock.currentTime = minutes;
      viewer.clock.shouldAnimate = false;
    }

  }
}
