export class Measure {
  constructor() {

    this.labelEntity;
    this.line_result;
    this.polygonEntity = [];
  }



  drawLine() {
    viewer.canvas.style.cursor = 'crosshair';
    dynamicCompenet.PolyLine(function (addLabel) {
    }, true);



  }

  /**
 * Calculate the distance between two points
 * @param firstPoint
 * @param secondPoint
 */
  getLengthText(firstPoint, secondPoint) {
    // calculate distance
    let length = Cesium.Cartesian3.distance(firstPoint, secondPoint);
    $('.label-class').text(length.toFixed(2) + "M");
    return length.toFixed(2)
  };

  showLabel() {
    if (LineSecondPosition != 0) {
      var lengthText = this.getLengthText(LineFirstPosition, LineSecondPosition);
      let centerPoint = Cesium.Cartesian3.midpoint(LineFirstPosition, LineSecondPosition, new Cesium.Cartesian3());
      dynamicCompenet.addLabel(centerPoint, lengthText, "up");


    }
  }

  /**
   * Polygon Measure
   */
  measurePolygon(callback) {
    showMessage("To complete PolyLine using Right Click!")
    viewer.canvas.style.cursor = 'crosshair';
    let positions = [];
    let clickStatus = false;
    let labelEntity = null;
    let labelPositions = [];
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
      clickStatus = true;
      let cartesian = viewer.scene.pickPosition(clickEvent.position);
      if (positions.length == 0) {
        positions.push(cartesian.clone());
        labelPositions.push(cartesian.clone());

        dynamicCompenet.addPoint(cartesian);
        viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
          console.log("moving");
          let movePosition = viewer.scene.pickPosition(moveEvent.endPosition);
          if (!movePosition) {
            return false;
          }
          if (positions.length == 1) {
            positions.push(movePosition);
            dynamicCompenet.add3DLineForPolygon(positions);
          } else {
            if (clickStatus) {
              positions.push(movePosition);
            } else {
              positions.pop();
              positions.push(movePosition);
            }
          }
          if (positions.length >= 3) {
            if (labelEntity) {
              viewer.entities.remove(labelEntity);
              entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
            }

          }
          clickStatus = false;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


      } else if (positions.length == 2) {
        if (!cartesian) {
          return false
        }
        positions.pop();
        positions.push(cartesian.clone());
        dynamicCompenet.addPoint(cartesian);
        viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {

          let clickPosition = viewer.scene.pickPosition(clickEvent.position);
          if (!clickPosition) {
            return false;
          }
          positions.pop();
          positions.push(clickPosition);
          positions.push(positions[0]);
          viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
          viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);

          if (callback) {
            callback()
          }
          let polygonCenter;
          if (positions.length > 2) {
            // Calculate polygon center
            polygonCenter = this.calculatePolygonCenter(positions);

          }

          let text = this.calculateArea(positions);
          console.log(text);

          dynamicCompenet.addLabel(polygonCenter, text, "up");
          entityCollection.push(labelEntity);

          this.line_result = [];
          this.line_result.push(labelEntity)


          viewer.canvas.style.cursor = 'default';
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

      } else if (positions.length >= 3) {
        if (!cartesian) {
          return false
        }
        positions.pop();
        positions.push(cartesian.clone());

        dynamicCompenet.addPoint(cartesian);


      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };




  cartesianToLatLon(cartesians) {
    return cartesians.map((cartesian) => {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      return {
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        longitude: Cesium.Math.toDegrees(cartographic.longitude)
      };
    });
  }
  calculatePolygonArea(latLonPositions) {
    const numPoints = latLonPositions.length;
    if (numPoints < 3) return 0;

    let area = 0;
    for (let i = 0; i < numPoints; i++) {
      const j = (i + 1) % numPoints;
      area += latLonPositions[i].longitude * latLonPositions[j].latitude;
      area -= latLonPositions[j].longitude * latLonPositions[i].latitude;
    }
    area = Math.abs(area) / 2;
    const radius = 6371000;
    const areaInSquareMeters = area * Math.PI * (radius * radius) / 180 / 180;

    return areaInSquareMeters;
  }

  calculatePerimeter(positions) {
    let perimeter = 0;
    const numPoints = positions.length;

    for (let i = 0; i < numPoints - 1; i++) {
      const current = positions[i];
      const next = positions[(i + 1) % numPoints]; // Wrap around to the first point

      perimeter += this.haversineDistance(
        current.latitude,
        current.longitude,
        next.latitude,
        next.longitude
      );
    }

    return perimeter;
  }

  haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius of the Earth in meters
    const toRadians = (degree) => degree * Math.PI / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }



  calculatePolygonCenter(positions) {
    if (positions.length === 0) return new Cesium.Cartesian3();

    let xSum = 0;
    let ySum = 0;
    let zSum = 0;

    for (const pos of positions) {
      xSum += pos.x;
      ySum += pos.y;
      zSum += pos.z;
    }

    const count = positions.length;
    return new Cesium.Cartesian3(xSum / count, ySum / count, zSum / count);
  }


  calculateArea(coordinates) {
    var ps = [];

    // Cartesian3 koordinatları oluşturma
    for (var i = 0; i < coordinates.length; i++) {
      var coordinate = coordinates[i];
      var cartesian = new Cesium.Cartesian3(coordinate.x, coordinate.y, coordinate.z);
      ps.push(cartesian);
    }

    var s = 0;

    // Green'in teoremini kullanarak alan hesaplama
    for (var i = 0; i < ps.length; i++) {
      var p1 = ps[i];
      var p2 = ps[(i + 1) % ps.length];
      s += p1.x * p2.y - p2.x * p1.y;
    }

    // Mutlak değer alarak alanı hesaplama
    var area = Math.abs(s);

    console.log(area);

    return Number(area);
  }

  ChangeUnit(unit) {
    let labelEntity;
    entityCollection.forEach(entity => {
      if (entity.label) {
        labelEntity = entity.label;
      }
    });
    let labelText = $('.label-class').text();
    let unitValue = parseFloat(labelText);

    if (isNaN(unitValue)) {
      console.log("Invalid unit value");
      return;
    }

    let currentUnit = labelText.replace(/[0-9.\s]/g, '').toLowerCase();
    let convertedValue = unitValue;
    if (currentUnit === "km") {
      // Convert kilometers to meters
      convertedValue = unitValue * 1000;
    } else if (currentUnit === "feet") {
      // Convert feet to meters
      convertedValue = unitValue / 3.28084;
    } else if (currentUnit === "meter") {
      // If already in meters, no need to convert
      convertedValue = unitValue;
    }

    if (unit === "meter") {
      let label = convertedValue.toFixed(2) + " m";
      $('.label-class').text(label);
      labelEntity.text = label;
    } else if (unit === "kilometer") {
      convertedValue = convertedValue / 1000;
      let label = convertedValue.toFixed(4) + " Km";
      $('.label-class').text(label);
      labelEntity.text = label;
    } else if (unit === "feet") {
      convertedValue = convertedValue * 3.28084;
      let label = convertedValue.toFixed(2) + " Feet";
      $('.label-class').text(label);
      labelEntity.text = label;
    } else {
      console.log("Unit Not Available");
      return;
    }

  }




  resetMeasurement() {
    $('.label-class').text("");
    viewer.canvas.style.cursor = 'default';
    viewer.entities.remove(this.labelEntity);
    viewer.entities.removeAll();


  }

}


/****Algorithm for Measure Class
1-Initialization
Create a Measure class with the following properties:
labelEntity: To hold label information.
line_result: To store results of line measurements.
polygonEntity: An array to hold polygon entities.

2-Draw Line
Method: drawLine()
Change the cursor style to 'crosshair'.
Initiate a dynamic polyline drawing component.

3-Calculate Length of Line
Method: getLengthText(firstPoint, secondPoint)
Calculate the distance between two Cartesian points using Cesium.Cartesian3.distance().
Update the length label displayed in the UI.

4-Show Label for Line Measurement
Method: showLabel()
If the second point of the line is defined:
Calculate the length of the line.
Determine the midpoint of the line.
Display the length at the midpoint.

5-Measure Polygon
Method: measurePolygon(callback)
Show a message to the user indicating how to complete the polygon.
Set the cursor to 'crosshair' and prepare to collect positions.
Set up event listeners for mouse clicks and movements:
On Left Click:
Capture the Cartesian position.
Store the position and add it as a point to the polygon.
On the second point, start drawing a line.
On Mouse Move:
Update the current position dynamically and draw a temporary line.
On Right Click:
Finalize the polygon by closing it.
Calculate the area and center of the polygon.
Display the area at the polygon's center.
If more than two points are added, update the polygon points.

6-Convert Cartesian to Latitude/Longitude
Method: cartesianToLatLon(cartesians)
Map Cartesian points to their respective latitude and longitude.

7-Calculate Polygon Area
Method: calculatePolygonArea(latLonPositions)
Use the shoelace formula to calculate the area based on latitude and longitude.
Convert the area from degrees to square meters.

8-Calculate Perimeter
Method: calculatePerimeter(positions)
Loop through the polygon points and use the Haversine formula to calculate the distance between each pair of points.

9-Haversine Distance Calculation
Method: haversineDistance(lat1, lon1, lat2, lon2)
Compute the distance between two geographical points.

10-Calculate Polygon Center
Method: calculatePolygonCenter(positions)
Calculate the average Cartesian coordinates of the polygon vertices to find the center.

11-Calculate Area
Method: calculateArea(coordinates)
Use Green's theorem to calculate the area based on Cartesian coordinates.

12-Change Measurement Units
Method: ChangeUnit(unit)
Convert the currently displayed measurement to the specified unit (meters, kilometers, feet).
Update the label displayed in the UI.

13-Reset Measurement
Method: resetMeasurement()
Clear the displayed measurement label and remove all entities from the viewer.
 * 
 */