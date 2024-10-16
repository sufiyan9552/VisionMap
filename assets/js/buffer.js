import Config from './Config.json' with {type: 'json'};
export class Buffer {
    constructor() {
        this.circlePolygon;
        this.centerPoint;
    }

    getMapLocation() {
        viewer.canvas.style.cursor = 'crosshair';
        showMessage("Click at Map For location")
        const handler = viewer.screenSpaceEventHandler.setInputAction(function (click) {
            const clickPosition = viewer.scene.pickPosition(click.position);
            if (Cesium.defined(clickPosition)) {
                const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(clickPosition);
                const latitude = Cesium.Math.toDegrees(cartographic.latitude);
                const longitude = Cesium.Math.toDegrees(cartographic.longitude);

                console.log('Latitude:', latitude);
                console.log('Longitude:', longitude);

                this.flyToCurrentLocation(latitude, longitude);

                this.createBuffer(latitude, longitude, distance);

                viewer.canvas.style.cursor = 'default';
                viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        }.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }

    flyToCurrentLocation(lat = null, long = null) {
        if (lat !== null && long !== null) {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(long, lat, 5000),
                orientation: {
                    heading: Cesium.Math.toRadians(0.0),
                    pitch: Cesium.Math.toRadians(-45.0),
                    roll: 0.0
                }
            });
            this.getLocationFromCoordinates(lat, long);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000),
                    orientation: {
                        heading: Cesium.Math.toRadians(0.0),
                        pitch: Cesium.Math.toRadians(-45.0),
                        roll: 0.0
                    }
                });
                this.getLocationFromCoordinates(latitude, longitude);
            }, (error) => {
                console.error('Error getting location:', error);
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }


    getLocationFromCoordinates(latitude, longitude) {
        this.createBuffer(latitude, longitude, distance);
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const address = data.display_name;
                console.log('Location:', address);
                document.getElementById("mapLocation").value = address;
                // showMessage('Location:', address);
            })
            .catch(error => {
                console.error('Error fetching location:', error);
            });
    }

    createBuffer(centerLatitude, centerLongitude, radius = null) {
        if (radius == null) { radius = 50 }

        if (typeof radius === 'string' && /[^0-9.-]/.test(radius)) {
            radius = Number(radius.replace(/[^0-9.-]+/g, '')); // Convert only if it contains characters
        }
        const circlePoints = [];
        const numberOfPoints = 100;
        const earthRadius = 6371.0;
        const radiusInRadians = radius / earthRadius;

        if (centerLatitude && centerLongitude) {

            if (this.centerPoint) {
                viewer.entities.removeAll();
                viewer.scene.render();
            }
            for (let i = 0; i < numberOfPoints; i++) {
                const angle = (i / numberOfPoints) * (2 * Math.PI);
                const pointLatitude = centerLatitude + (radiusInRadians * Math.sin(angle) * (180 / Math.PI));
                const pointLongitude = centerLongitude + (radiusInRadians * Math.cos(angle) * (180 / Math.PI) / Math.cos(centerLatitude * Math.PI / 180));
                circlePoints.push(Cesium.Cartesian3.fromDegrees(pointLongitude, pointLatitude));
            }


            this.centerPoint = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.BLUE,
                },
            });

            this.circlePolygon = viewer.entities.add({
                name: "Circle",
                polygon: {
                    hierarchy: circlePoints,
                    material: Cesium.Color.LIGHTGREY.withAlpha(0.2)
                },
            });

            
            
            if (this.centerPoint && this.circlePolygon) {
                this.getAmemities(centerLatitude, centerLongitude, radius);

            }

            // viewer.zoomTo(circlePolygon);
        } else {
            showMessage("Give correct Location or enter Manually..!");
        }

    }

    getAmemities(currentLatitude, currentLogitude, currentRadius) {
        if (currentLatitude && currentLogitude && currentRadius && finalPlace) {
            currentRadius = currentRadius * 1000;
            const data = JSON.stringify({
                "longitude": currentLogitude,
                "latitude": currentLatitude,
                "radius": currentRadius,
                "tablename": "amt_amenities",
                "amenityName": finalPlace
            });
            showLoading();
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    if(locationModelEntity){}{
                        viewer.entities.removeAll();
                    }
                    let listamenities = JSON.parse(this.responseText);
                    viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
                    listamenities.forEach((amenity) => {
                        locationModelEntity = viewer.entities.add({
                            position: Cesium.Cartesian3.fromDegrees(amenity.longitude, amenity.latitude),
                            model: {
                                uri: Config.amentiesGLB+`${finalPlace}`+'.glb',
                                scale: 1,
                                minimumPixelSize: 30
                            },
                            name: amenity.name,
                            longitude: amenity.longitude,
                            latitude: amenity.latitude,
                            amenity: amenity.amenity,
                            type:"glb_amenity"
                
                        });
                    });
                    hideLoading();
                }
            });
            xhr.open("POST",Config.amenitiesUrl , true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(data);
        } else {
            showMessage("Sorry for Inconvenience!");
        }

    }


    resetBuffer() {
        viewer.entities.removeAll();

    }
}