export class Gps {
    constructor() {
        this.positions = [];
        this.isRunning = false;
        this.startTime = null;
        this.duration = 50;
    }

    startGps() {
        this.isRunning = true;
        const blackAndWhiteStripeMaterial = new Cesium.StripeMaterialProperty({
            evenColor: Cesium.Color.BLACK,
            oddColor: Cesium.Color.WHITE,
            repeat: 5.0,
            orientation: Cesium.StripeOrientation.HORIZONTAL
        });
        const pointEntity = viewer.entities.add({
            position: startPosition,
            point: {
                color: Cesium.Color.WHITE,
                pixelSize: 20,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                material: blackAndWhiteStripeMaterial
            }
        });
        viewer.entities.add({
            polyline: {
                positions: new Cesium.CallbackProperty(() => {
                    return this.positions;
                }, false),
                width: 8,
                material: Cesium.Color.RED.withAlpha(0.7),
                clampToGround: true,
            }
        });
        // viewer.zoomTo(pointEntity);
        this.startTime = Cesium.JulianDate.now(); // Initialize start time

        viewer.scene.preRender.addEventListener(this.updatePosition.bind(this, pointEntity));
    }

    updatePosition(pointEntity) {
        if (!this.isRunning) return;

        const currentTime = Cesium.JulianDate.now();
        const elapsedSeconds = Cesium.JulianDate.secondsDifference(currentTime, this.startTime);
        const t = Math.min(elapsedSeconds / this.duration, 1);
        const newPosition = Cesium.Cartesian3.add(
            Cesium.Cartesian3.multiplyByScalar(startPosition, 1 - t, new Cesium.Cartesian3()),
            Cesium.Cartesian3.multiplyByScalar(endPosition, t, new Cesium.Cartesian3()),
            new Cesium.Cartesian3()
        );
        pointEntity.position = newPosition;
        this.positions.push(newPosition);
        const cartographic = Cesium.Cartographic.fromCartesian(newPosition);

        if (cartographic) {
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            if (!isNaN(longitude) && !isNaN(latitude)) {
                $('.label-class').text(`${longitude}, ${latitude}`);
                viewer.scene.requestRender();
            } else {
                console.error("Invalid coordinates: Longitude or Latitude is NaN");
            }
        } else {
            console.error("Cartographic conversion failed.");
        }

        if (t >= 1) {
            this.stopGps();
        }
    }

    stopGps() {
        this.isRunning = false;
        viewer.scene.preRender.removeEventListener(this.updatePosition.bind(this));
    }

    restartGps() {
        if (!this.isRunning) {
            this.startGps();
        }
    }

    resetGps() {
        viewer.canvas.style.cursor = 'default';
        viewer.entities.removeAll();
        this.stopGps();
        this.positions = [];
        if (this.pointEntity) {
            viewer.entities.remove(this.pointEntity);
            this.pointEntity = null;
        }
        if (this.polylineEntity) {
            viewer.entities.remove(this.polylineEntity);
            this.polylineEntity = null;
        }
        $('.label-class').text('');

    }
}


/***Algorithm for Gps**************
1-Class Initialization:
Create an instance of the Gps class.
Initialize properties:
positions: An empty array to store GPS positions.
isRunning: A boolean flag to track whether GPS simulation is active (initially set to false).
startTime: Initially set to null (to track the start time of the simulation).
duration: Set to 50 (the duration for the GPS simulation).

2-Start GPS Simulation:
Define the startGps method:
Set isRunning to true.
Create a blackAndWhiteStripeMaterial using Cesium.StripeMaterialProperty.
Create a pointEntity at the startPosition with specific visual properties (color, size, outline, material).
Add a polyline entity to the viewer to represent the path of movement:
Use a Cesium.CallbackProperty to dynamically update the positions based on the positions array.
Set polyline properties (width, material, clamp to ground).
Initialize startTime using Cesium.JulianDate.now().
Register the updatePosition method as an event listener for preRender to update the position of the point and polyline.

3-Update GPS Position:
Define the updatePosition method:
Check Running State:
If isRunning is false, exit the method.
Calculate Elapsed Time:
Get the current time and calculate the elapsed time in seconds.
Normalize the elapsed time (t) based on the duration.
Calculate New Position:
Calculate a new position by interpolating between startPosition and endPosition using t.
Update Point Entity:
Update the position of pointEntity with the new position.

3-Store Position:
Push the new position to the positions array.
Convert to Cartographic Coordinates:
Convert the new position to cartographic coordinates (longitude, latitude).
Update Label:
If valid coordinates, update the label displaying longitude and latitude.
If invalid, log an error message.
Check for Completion:
If t is greater than or equal to 1, call stopGps() to end the simulation.

4-Stop GPS Simulation:
Define the stopGps method:
Set isRunning to false.
Remove the updatePosition method as an event listener from preRender.

5-Restart GPS Simulation:
Define the restartGps method:
If not currently running, call startGps() to restart the simulation.

6-Reset GPS Simulation:
Define the resetGps method:
Change the cursor style to 'default'.
Remove all entities from the viewer.
Call stopGps() to ensure the simulation is halted.
Clear the positions array.
If pointEntity exists, remove it from the viewer.
If polylineEntity exists, remove it from the viewer.
Clear the label text.
 * 
 */