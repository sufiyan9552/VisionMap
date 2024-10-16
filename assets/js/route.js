export class RoutingNavigation {
    constructor() {

    }
    startRoute() {
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        const startCoords = document.getElementById('firstPosition').value.split(',');
        const endCoords = document.getElementById('secondPosition').value.split(',');

        if (startCoords.length === 2 && endCoords.length === 2) {
            showLoading();
            const [startLon, startLat] = startCoords.map(coord => coord.trim());
            const [endLon, endLat] = endCoords.map(coord => coord.trim());
            const routeRequestBody = {
                startLongitude: parseFloat(startLon),
                startLatitude: parseFloat(startLat),
                endLongitude: parseFloat(endLon),
                endLatitude: parseFloat(endLat)
            };
            const data = JSON.stringify(routeRequestBody);
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        try {
                            const response = JSON.parse(this.responseText);
                            const coordinates = response; 
                            if (coordinates.length > 0) {
                                const positions = coordinates.map(coord => Cesium.Cartesian3.fromDegrees(coord.lon, coord.lat));
                                viewer.entities.add({
                                    polyline: {
                                        positions: positions,
                                        width: 7, 
                                        material: Cesium.Color.fromCssColorString('orange')
                                    }
                                });
                                hideLoading();
                                viewer.zoomTo(viewer.entities);
                            }
                        } catch (error) {
                            console.error("Error parsing JSON response:", error);
                            console.error("Response text:", this.responseText);
                        }
                    } else {
                        console.error("Error: HTTP status", this.status);
                    }
                }
            });
            xhr.open("POST", "http://localhost:8080/api/route", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Referrer-Policy", "no-referrer");
            xhr.send(data);


            // const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full`;

            // fetch(osrmUrl)
            //     .then(response => {
            //         if (!response.ok) throw new Error('Network response was not ok');
            //         return response.json();
            //     })
            //     .then(data => {
            //         if (data.routes && data.routes.length > 0) {
            //             const routeGeometry = data.routes[0].geometry;
            //             let roundedDistance = Math.round(data.routes[0].distance / 1000);

            //             var distance = `Distance : ${roundedDistance} Km\nPredict Time : ${data.routes[0].duration} minutes`;
            //             document.querySelector('.label-class').innerText = distance;
            //             const routeCoordinates = this.decodePolyline(routeGeometry);
            //             const cesiumRoutePositions = routeCoordinates.map(coord =>
            //                 Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 0)
            //             );

            //             const stripeMaterial = new Cesium.StripeMaterialProperty({
            //                 evenColor: Cesium.Color.ORANGE,
            //                 oddColor: Cesium.Color.BLACK,
            //                 repeat: 10.0,
            //                 orientation: Cesium.StripeOrientation.HORIZONTAL
            //             });

            //             viewer.entities.add({
            //                 polyline: {
            //                     positions: cesiumRoutePositions,
            //                     width: 5,
            //                     material: stripeMaterial,
            //                     clampToGround: true
            //                 }
            //             });


            //             const midpoint = Cesium.Cartesian3.fromDegrees(
            //                 (parseFloat(startLon) + parseFloat(endLon)) / 2,
            //                 (parseFloat(startLat) + parseFloat(endLat)) / 2
            //             );
            //             hideLoading();
            //             // viewer.camera.flyTo({
            //             //     destination: midpoint,
            //             //     duration: 2,
            //             //     complete: function () {
            //             //         viewer.camera.lookAt(midpoint, new Cesium.Cartesian3(0.0, 0.0, 5000.0)); 
            //             //     }
            //             // });
            //         } else {
            //             console.error('No valid routes found');
            //         }
            //     })
            //     .catch(error => console.error('Error fetching route data:', error));
        } else {
            showMessage('Please enter valid coordinates in the format: Longitude,Latitude');
        }
    }
    decodePolyline(encoded) {
        let coordinates = [];
        let index = 0, len = encoded.length;
        let lat = 0, lng = 0;

        while (index < len) {
            let b, shift = 0, result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = (result >> 1) ^ -(result & 1);
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = (result >> 1) ^ -(result & 1);
            lng += dlng;

            coordinates.push([lng / 1e5, lat / 1e5]); 
        }

        return coordinates;
    }
    addLocation(cartesian) {
        if (cartesian) {
            viewer.entities.add({
                position: cartesian,
                model: {
                    uri: 'icon/map_pointer.glb', 
                    minimumPixelSize: 50,
                    maximumScale: 200,
                    scale: 1.0,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND 
                }
            });

        }

    }

    liveTrafficData() {
        const startCoords = document.getElementById('firstPosition').value.split(',');
        const endCoords = document.getElementById('secondPosition').value.split(',');

        if (startCoords.length === 2 && endCoords.length === 2) {
            const [startLon, startLat] = startCoords.map(coord => coord.trim());
            const [endLon, endLat] = endCoords.map(coord => coord.trim());
            const apiKey = 'kwC9_rqh7Ojc6QXQ0pybExSvdKBA8ZzkTxKqPkFs0rw'; 

            const fetchTrafficFlow = async () => {
                try {
                    const bbox = `${startLon - 0.1},${startLat - 0.1},${startLon + 0.1},${startLat + 0.1}`;
                    const response = await fetch(`https://traffic.api.here.com/traffic/6.3/flow.json?apiKey=${apiKey}&bbox=${bbox}`);

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    console.log(data); // Use the data as needed
                } catch (error) {
                    console.error('Error fetching traffic data:', error);
                }
            };

            fetchTrafficFlow();
        } else {
            console.error('Invalid coordinates. Please provide valid start and end positions.');
        }
    }


    clearRoute() {
        document.querySelector('.label-class').innerText = "";
        document.getElementById('firstPosition').value = "";
        document.getElementById('secondPosition').value = "";
        viewer.entities.removeAll();
    }



}


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