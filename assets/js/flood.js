export class FloodAnalysis {
    constructor() {
        this.clippingPlaneCollection = [];
    }

    loadFlood() {
        viewer.canvas.style.cursor = 'crosshair';
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction((click) => {
            const cartesian = viewer.scene.pickPosition(click.position);

            if (cartesian) {
                dynamicCompenet.addPoint(cartesian);

                const center = Cesium.Cartographic.fromCartesian(cartesian);
                const positions = this.generateCircle(center, 5000);

                waterSurface = viewer.entities.add({
                    name: 'Water Surface',
                    polygon: {
                        hierarchy: new Cesium.PolygonHierarchy(positions),
                        height: waterHeight,
                        extrudedHeight: waterHeight + 1,
                        material: new Cesium.ColorMaterialProperty(
                            new Cesium.CallbackProperty(() => {
                                return Cesium.Color.fromCssColorString('#003366')
                                    .withAlpha(0.7 + (Math.sin(Date.now() / 200) * 0.08));
                            }, false)
                        ),
                        outline: false,
                    },
                });

                this.simulateFlood();

                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

                viewer.canvas.style.cursor = 'default';
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }


    simulateFlood() {
        if (waterSurface && waterHeight <= 50) {
            waterHeight += 0.1;
            waterSurface.polygon.height = waterHeight;
            waterSurface.polygon.extrudedHeight = waterHeight + 1;
        }
    }

    generateCircle(center, radius) {
        const positions = [];
        const numPoints = 64;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;

            const offsetX = radius * Math.cos(angle);
            const offsetY = radius * Math.sin(angle);

            const cartoPoint = new Cesium.Cartographic(
                center.longitude + offsetX / Cesium.Ellipsoid.WGS84.maximumRadius,
                center.latitude + offsetY / Cesium.Ellipsoid.WGS84.maximumRadius
            );

            positions.push(Cesium.Cartesian3.fromRadians(cartoPoint.longitude, cartoPoint.latitude));
        }

        return positions;
    }

    dynamicWaterHeight(waterHeight) {
        waterSurface.polygon.height = waterHeight;
        viewer.scene.requestRender();

    }


    starFloodChart() {
        const ctx = document.getElementById('floodChart').getContext('2d');

        floodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Flood Level (m)',
                    data: floodData,
                    backgroundColor: 'rgba(0, 123, 255, 0.3)',
                    borderColor: 'rgba(0, 123, 255, 1)',  
                    fill: true,  
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Flood Level (m)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                }
            }
        });

    }

    destroy() {

        showLoading();
        setTimeout(function () {
            hideLoading();
        }, 3000);
        viewer.entities.removeAll();
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }

        if (this.clippingPlaneCollection.length > 0) {
            this.clippingPlaneCollection.removeAll();
            this.clippingPlaneCollection = [];
        }

        waterSurface = null;
        waterHeight = 0;  

        viewer.canvas.style.cursor = 'default';
        if (floodChart) {
            floodChart.data.labels = [];  
            floodChart.data.datasets.forEach((dataset) => {
                dataset.data = [];  
            });

            floodChart.update();
        }
        viewer.scene.requestRender();
    }

}


/**** Algorithm for FloodAnalysis*******************
1-Class Initialization:
Initialize an instance of the FloodAnalysis class.
Define an empty array for clippingPlaneCollection to manage clipping planes.

2-Load Flood Simulation:
Set the cursor style to crosshair.
Create a ScreenSpaceEventHandler for handling mouse interactions.
Define the left-click event action:
Capture Click Position:
Get the 3D position (Cartesian coordinates) of the mouse click on the globe.
Add Clicked Point:
Call a method (e.g., dynamicCompenet.addPoint()) to register the clicked point for further processing.
Generate Flood Polygon:
Convert the clicked Cartesian position to cartographic coordinates (longitude, latitude).
Generate a circular polygon around the clicked point with a specified radius (5000 meters).
Create Water Surface Entity:
Add a water surface entity with dynamic properties (color, height).
Define the water surface as a polygon with extruded height for visual representation.
Start Flood Simulation:
Initiate the flood simulation.
Clean Up Handler:
Remove the left-click input action and reset the cursor style.

3-Simulate Flood:
Check if the water surface exists and if the water height is less than or equal to 50:
Increment the waterHeight (simulate rising water).
Update the polygon's height and extruded height for the water surface.

4-Generate Circular Positions:
Define a method to generate circular positions based on a center point and radius:
Initialize an empty array for positions.
Loop through a defined number of points (e.g., 64):
Calculate the angle for each point.
Determine the Cartesian offsets based on the angle and radius.
Create a new Cartographic point using the adjusted longitude and latitude.
Convert to Cartesian coordinates and push to the positions array.
Return the array of positions.

5-Dynamic Water Height Adjustment:
Define a method to dynamically update the water height:
Set the polygon's height to the provided waterHeight.
Request a render of the scene to reflect the changes.

6-Start Flood Chart Visualization:
Define a method to initialize and display a flood level chart using Chart.js:
Get the drawing context of the canvas element.
Create a new chart instance with the specified data and options for visual representation.

7-Clean Up Resources:
Define a destroy method to clean up and reset the flood analysis:
Show a loading indicator and hide it after a delay.
Remove all entities from the viewer.
Destroy the event handler if it exists.
Clear any clipping planes from the clipping plane collection.
Reset the water surface and height values.
Reset the cursor style.
Clear and update the flood chart data.
Request a render of the scene to reflect the final state.
*/ 

