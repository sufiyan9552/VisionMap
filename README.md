# VisionMap
This Is VisionMap


/*****************************Algorithem 3Model*****************************
 * 
 * Class Initialization

1-Initialize properties:
-glbEntity (to store the 3D model entity)
-polygonEntity (for storing polygon entities)

2-Method: add3DModel(model)
-Set the cursor style to a crosshair.
-If model is "select_asset", show a message prompting the user to select a model.
-Determine dynamicScale based on the model type.
-Define a click handler function for adding the 3D model:
-On click:
-Retrieve the clicked position in the scene.
-Convert the Cartesian position to Cartographic coordinates.
-Create an orientation for the model using HeadingPitchRoll.
-Add the 3D model to the viewer at the clicked position with the specified scale.
-Reset the cursor style and remove the click handler.
-Register the click handler to the left-click event.

3-Method: updateModelOrientation()
-Check if Modelcartesian is defined; if not, log an error.
-Request a scene render.
-Convert Modelcartesian to Cartographic coordinates.
-Validate Modelheight; log an error if invalid.
-Create a new orientation based on the model's heading, pitch, and roll.
-If glbEntity exists:
-Update its orientation, scale, and position.
-Log an error if glbEntity is not initialized.

4-Method: create3DModel(callback)
-Show a message indicating how to complete a Polyline using right-click.
-Set the cursor style to crosshair and initialize an empty positions array.
-Set the globe depth testing against terrain to true.
-Define a click handler for left-clicks:
-On left-click:
-Check the number of positions:
-If empty, add the clicked position to the array and register a mouse move handler to draw a line.
-If there are two positions, update the last position and register a right-click handler to complete the polygon and call the callback.
-If there are three or more positions, simply update the last position.
-Register the left-click handler.

5-Method: addPolyGon(positions)
-Map the positions to Cartesian coordinates.
-Create a polygon entity with the specified material and add it to the viewer.

6-Method: materialCallback()
-Return a material object with a blue color and alpha value.
-Method: heightCallback(newHeight)

-Iterate through entityCollection:
-For each entity with a polygon, update the extrudedHeight to newHeight.
-Request a scene render and log the updated height.

7-Method: updateMaterial(newMaterial)
-Normalize the color string and check if it corresponds to "BUILDING":
-If so, create and set a building material.
-If not, set the polygon material based on the normalized color.
-Iterate through entityCollection and update materials accordingly.
-Request a scene render and log the updated material.

8-Method: resetAssets()
-Show a loading message.
-Set a timeout to hide the loading message after 3 seconds.
-Remove the glbEntity from the viewer and remove all entities.
-Load a dynamic tool for 3D assets.
 * 
 */



 /**************Algorithem Elevation Profile
 * Algorithm for ElevationProfile Class
1-Class Initialization
-Function: constructor()
-Inputs: None
-Actions: Initializes an instance of the ElevationProfile class.

2-Add Elevation Profile
-Function: addProfile()
-Inputs: None
-Actions:
-Set the cursor to crosshair.
-Initialize an empty array positions to store selected positions and a variable polylineEntity to null.
-Create a ScreenSpaceEventHandler for mouse interactions.
-Handle Left Click Event:
-Get the Cartesian position of the mouse click.
-If the position is valid:
-Sample the terrain elevation at the clicked position.
-Round the elevation value and store it.
-Convert the Cartesian position to Cartographic coordinates and add it to positions.
-If there are more than one position, create or update a polyline entity to visualize the elevation profile.
-Handle Right Click Event:
-Reset the cursor to default.
-If more than one position exists, invoke getElevationProfile() with the positions.
-Show the elevation chart and destroy the event handler.

3-Get Elevation Profile
-Function: getElevationProfile(positions)
-Inputs: positions (array of Cartographic coordinates)
-Actions:
-Sample the terrain elevations for the provided positions.
-Map the elevations to a new array.
-Invoke drawElevationProfile() with the elevation data.

4-Draw Elevation Profile
-Function: drawElevationProfile(elevations)
-Inputs: elevations (array of elevation values)
-Actions:
-Get the drawing context of the elevation chart canvas.
-Create a line chart using Chart.js with the elevations and configure axes labels.

5-Add Line with Labels
-Function: addLine(positions)
-Inputs: positions (array of Cartesian coordinates)
-Actions:
-Remove any existing lines from the viewer.
-Create a new polyline entity for the active line, clamped to the ground, and set the material color.
-Add height labels at each point along the line.
-Create a separate unclamped line for comparison.

6-Download Elevation Profile
-Function: downloadElevation()
-Inputs: None
-Actions:
-Create a new PDF document using jsPDF.
-Capture the current map and chart as images.
-Add the captured images and elevation data to the PDF.
-Save the generated PDF with a timestamped filename.

7-Add Elevation Points to PDF
-Function: addElevationPoints(pdf, elevations, startX, startY, logoHeight)
-Inputs: pdf (jsPDF instance), elevations (array of elevation values), startX, startY, logoHeight (for positioning)
-Actions:
-Loop through the elevation values and add them to the PDF at specified positions, adjusting for line breaks as needed.

8-Reset Elevation Profile
-Function: resetProfile()
-Inputs: None
-Actions:
-Clear stored elevation data and reset the elevation chart display.
-Remove all entities from the viewer.
-Clear the canvas used for the elevation chart.
 * 
 */


 
/******** Algorithm for FlightSimulation******************
 
1-Class Initialization
Function: constructor()
Inputs: None
Actions:
Initialize properties for model entity, position, speed, camera settings, and movement flags.

2-Add Drone
Function: addDrone()
Inputs: None
Actions:
Change cursor style to crosshair.
Create a ScreenSpaceEventHandler to handle mouse clicks.
Handle Left Click Event:
Get Cartesian position from mouse click.
Convert to Cartographic coordinates (longitude, latitude, height).
Create a model entity at the clicked position with specified model URI.
Fly the camera to the drone's location.
Reset cursor style to default and destroy the handler.
Set up keyboard controls.
Start the animation loop.

3-Setup Keyboard Controls
Function: setupKeyboardControls()
Inputs: None
Actions:
Add event listeners for keydown and keyup events.
Update movement flags (isMovingForward, isMovingBackward, etc.) based on key presses.
Adjust speed, camera tilt, rotation, and zoom based on specific keys.

3-Start Animation Loop
Function: startAnimationLoop()
Inputs: None
Actions:
Define updatePosition() to update drone position and orientation based on movement flags.
Call requestAnimationFrame to create a loop for continuous updates.

4-Move Drone Forward
Function: moveDroneForward()
Inputs: None
Actions:
Calculate speed vector in the forward direction.
Update drone position using updateDronePosition().

5-Move Drone Backward
Function: moveDroneBackward()
Inputs: None
Actions:
Calculate speed vector in the backward direction.
Update drone position using updateDronePosition().

6-Turn Drone Left
Function: turnDroneLeft()
Inputs: None
Actions:
Decrease heading by deltaRadians.
Ensure heading wraps around to stay within [0, 2π].

7-Turn Drone Right
Function: turnDroneRight()
Inputs: None
Actions:
Increase heading by deltaRadians.
Ensure heading wraps around to stay within [0, 2π].

8-Adjust Drone Height
Function: adjustDroneHeight(heightIncrement)
Inputs: heightIncrement (number)
Actions:
Get current position of the drone.
Update height of the position based on the height increment.
Set the new position of the model entity.

9-Update Drone Position
Function: updateDronePosition()
Inputs: None
Actions:
Get the current position of the drone.
Calculate the new position using heading, pitch, and speed.
Update the position of the model entity.

10-Update Drone Orientation
Function: updateDroneOrientation()
Inputs: None
Actions:
Set the orientation of the drone model based on the current position and hpRoll.

11-Follow Drone
Function: followDrone()
Inputs: None
Actions:
Get the current position of the drone.
Adjust the camera to follow the drone with the specified heading, pitch, and range.

12-Stop Animation Loop
Function: stopAnimationLoop()
Inputs: None
Actions:
Cancel the ongoing animation frame request.

13-Reset Simulation
Function: resetSimulation()
Inputs: None
Actions:
Show loading indicator.
Remove the drone model from the viewer if it exists.
Enable tilt for the camera controller.
Stop the animation loop and reset movement flags, speed, and camera settings.
 * 
 *  */


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




/****Algorithm for FlyAround
1-Class Initialization:
Create an instance of the FlyAround class, taking a viewer parameter.
Initialize properties:
heading: Set to 0 (represents the camera's heading direction).
rotationDirection: Set to 1 (indicates clockwise rotation).
isRotating: Set to false (tracks whether rotation is active).
intervalId: Set to null (to hold the interval reference for rotation).

2-Start or Change Rotation:
Define the rotateView method:
Check Rotation State:
If isRotating is true, reverse the rotationDirection (multiply by -1) and return.
Start Rotation:
Set isRotating to true.
Set an interval to update the camera heading every 100 milliseconds:
Increment heading by rotationDirection.
Normalize heading:
If heading is greater than or equal to 360, subtract 360.
If heading is less than 0, add 360.
Update the camera's view using viewer.camera.setView():
Set the orientation with the current heading, and retain the current pitch and roll.
Update Rotation Class:
Call updateRotationClass() to update the visual state of the flyaround tool.

3-Stop Rotation:
Define the stopRotation method:
Prevent Event Propagation:
Call event.stopImmediatePropagation() to prevent further event handling.
Update Tool State:
Remove the active class from the flyaround tool.
Clear Interval:
Clear the rotation interval using clearInterval(this.intervalId).
Reset Rotation State:
Set isRotating to false.

4-Update Rotation Class:
Define the updateRotationClass method:
Get Tool Element:
Retrieve the flyaround tool element by its ID (flyaroundTool).
Update Classes Based on Direction:
If rotationDirection is 1 (clockwise):
Remove the anticlockwise class.
Add the clockwise class.
If rotationDirection is not 1 (anticlockwise):
Log the rotationDirection for debugging.
Remove the clockwise class.
Add the anticlockwise class.
 * 
 */


 
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



 
/****Algorithm Line of Sight
1-Initialization:
The constructor sets up the viewer, depth testing against terrain, and initializes various properties such as active shape points, 
entity collections, and a screen space event handler.

2-Destroy Method:
The destroy method cleans up by removing entities and resetting states, effectively allowing the Line of Sight functionality to be restarted.

3-Disable Camera Motion:
The disableCameraMotion method enables or disables the camera controls (like rotation, zoom, etc.) based on a boolean state.

4-Start Method:
The start method initializes event handlers for mouse actions:
Left Click: Captures the starting point or target point, creates points, and draws the line of sight.
Mouse Move: Changes the cursor to indicate a crosshair during drawing.
Right Click: Enables moving existing points and updating the line of sight.
Left Down: Begins the selection of an existing point to move.
Mouse Move (Moving Point): Updates the position of the selected point.
Left Up: Finalizes the movement of the point and redraws the line of sight.

5-Point Creation:
The createPoint method creates a visual representation of points in the scene, distinguishing between starting and target points based on color.

6-Drawing the Line of Sight:
The drawSightViewLine method calculates the direction of the line between two points and determines 
if the line intersects with any objects in the scene. It then creates a visual representation of the line,
either connecting the points directly or stopping at the intersection.


**************************** Pseudocode Representation *******************************************
class LineOfSight {
    initialize(viewer) {
        setup viewer properties
        initialize entity collections
        create event handler for viewer canvas
    }

    destroy() {
        remove all entities from data source
        reset state variables
        remove all input actions
    }

    disableCameraMotion(state) {
        enable or disable camera controls based on state
    }

    start() {
        add data source to viewer
        set event handlers for mouse actions:
            on LEFT_CLICK:
                if startPoint is undefined:
                    set startPoint and create startPoint visual
                else:
                    create targetPoint and draw line of sight
            on MOUSE_MOVE:
                change cursor to crosshair
            on RIGHT_CLICK:
                enable point moving functionality
    }

    createPoint(dataSource, worldPosition, id, isStartPoint) {
        create visual point representation in the scene
    }

    drawSightViewLine(dataSource, positionData, id) {
        calculate direction from startPoint to targetPoint
        if intersects with objects:
            create line representation from startPoint to intersection
        else:
            create direct line representation from startPoint to targetPoint
    }
}

 * 
 */



 
/****Algorithm for Measure 
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


 /**Algorithm for RoutingNavigation
1-Initialization:
Define the RoutingNavigation class.
Create a constructor to initialize any properties if necessary (currently empty).

2-Start Route (startRoute method):
Get the start and end coordinates from input fields.
Validate the coordinates:
Check if there are exactly two coordinates (longitude and latitude) for both start and end.
If valid:
Show a loading indicator.
Create a route request body with parsed float values for coordinates.
Prepare to send a POST request to the routing API:
Set request headers (Content-Type and Referrer-Policy).
On response:
If successful (HTTP status 200):
Parse the response as JSON.
Check if coordinates are returned.
If valid coordinates are present:
Map the coordinates to Cesium Cartesian3 format.
Add a polyline entity to the viewer with specified styling (orange color, width).
Hide the loading indicator.
Zoom the viewer to show the newly added entities.
If the response is unsuccessful:
Log an error message with the status.
If invalid coordinates, show a message indicating the correct format.

3-Decode Polyline (decodePolyline method):
Initialize variables for coordinate decoding.
Loop through the encoded string:
Decode latitude and longitude from the encoded format.
Push decoded coordinates into an array.
Return the decoded coordinates.

4-Add Location (addLocation method):
If a valid Cartesian position is provided:
Add a model entity (map pointer) to the viewer at the specified position.

5-Live Traffic Data (liveTrafficData method):
Get the start and end coordinates from input fields.
If valid:
Create a bounding box based on the coordinates.
Fetch traffic flow data from the HERE API.
If the response is successful, log the traffic data.
Handle errors during the fetch operation.
If invalid coordinates, log an error message.

6-Clear Route (clearRoute method):
Clear any displayed route information:
Reset label text.
Clear input fields for coordinates.
Remove all entities from the Cesium viewer.
 * 
 */




 
/**********Algorithm for the SplitTool **************************************
1-Class Initialization
Constructor: Initializes an instance of the SplitTool class.
Method: addSplit()

2-Check for Existing Splitter Line:
If an element with ID splitterLine exists, remove it to avoid duplicates.

3-Show Loading Indicator:
Display a loading spinner for a brief period to indicate a process is occurring.

4-Create Splitter Line:
Create a div element representing the splitter line.
Set its properties (position, size, color, cursor style).
Append the splitter line to the document body.

5-Add Imagery Layer:
Create an instance of OpenStreetMapImageryProvider.
Add this layer to the viewer.imageryLayers.
Set the split direction and initial split position.

6-Handle Dragging:
Set a flag (isDragging) to track if the user is dragging the splitter.
Mouse Down Event:
When the mouse is pressed down on the splitter line, set isDragging to true.
Change the cursor style to indicate dragging mode.
Mouse Move Event:
If isDragging is true, calculate the new split position based on the mouse's X-coordinate.
Update the splitPosition of the viewer's scene and the position of the splitter line.
Request a render of the scene to reflect changes.
Mouse Up Event:
When the mouse button is released, reset the isDragging flag.
Reset the cursor style.
Method: resetSplit()

7-Show Loading Indicator:
Display a loading spinner briefly before resetting.

8-Remove Splitter Line:
Find the splitter line by ID and remove it from the DOM if it exists.

9-Clear Viewer Data:
Remove all data sources and entities from the viewer.

10-Reset Imagery Layers:
While there is more than one imagery layer, remove the topmost layer until only one remains.

11-Reset Scene Primitives:
While there are primitives in the scene, remove them one by one until none remain.

12-Clear Tracked Entity:
Set viewer.trackedEntity to undefined to stop tracking any specific entity.
 * 
 */

