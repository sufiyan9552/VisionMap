

export class ElevationProfile {
    constructor() {

    }
    addProfile() {
        viewer.canvas.style.cursor = 'crosshair';
        var positions = [];
        var polylineEntity;

        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        const self = this;

        handler.setInputAction(function (click) {
            var cartesian = viewer.scene.pickPosition(click.position);

            if (!Cesium.defined(cartesian)) {
                console.error("Invalid position: ", click.position);
                return;
            }

            if (Cesium.defined(cartesian)) {
                Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [Cesium.Cartographic.fromCartesian(cartesian)])
                    .then(updatedPositions => {
                        const elevation = Math.round(updatedPositions[0].height * 100) / 100;
                        dynamicCompenet.addPointLabel(cartesian, elevation); 
                        storedElevations.push(elevation); 
                    });
            }

            var labelcartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
            // var elevation = labelcartographic.height;
            // var roundedElevation = Math.round(elevation);
            // var roundedElevation = Math.round(elevation * 100) / 100;
            // var roundedElevation = elevation.toFixed(2);
            // dynamicCompenet.addPointLabel(cartesian, roundedElevation);

            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            // this.addElevationLabel(cartesian);
            positions.push(cartographic);

            if (positions.length > 1) {
                var cartesianPositions = positions.map(function (cartographic) {
                    return Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
                });
                if (!polylineEntity) {
                    polylineEntity = viewer.entities.add({
                        polyline: {
                            positions: cartesianPositions,
                            width: 3,
                            material: Cesium.Color.YELLOW,
                            clampToGround: true
                        }
                    });
                } else {
                    polylineEntity.polyline.positions = cartesianPositions;
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        handler.setInputAction(() => {
            viewer.canvas.style.cursor = 'default';
            $('#downloadElevation').removeClass("hidden");
            if (positions.length > 1) {
                self.getElevationProfile(positions); 
            }
            $("#elevationChart").css("display", "block");
            handler.destroy();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    getElevationProfile(positions) {
        Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, positions)
            .then((updatedPositions) => {
                var elevations = updatedPositions.map((pos) => {
                    return pos.height;
                });
                console.log(elevations); 
                this.drawElevationProfile(elevations);
            })
            .catch((error) => {
                console.error("Error sampling terrain: ", error);
            });
    }

    drawElevationProfile(elevations) {
        var ctx = document.getElementById('elevationChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: elevations.length }, (_, i) => i + 1),
                datasets: [{
                    label: 'Elevation Profile',
                    data: elevations,
                    borderColor:  'rgba(0, 128, 128, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: { display: true, title: { display: true, text: 'Point' } },
                    y: { display: true, title: { display: true, text: 'Elevation (m)' } }
                }
            }
        });
    }



    addLine(positions) {
        if (Cesium.defined(activeLine)) {
            viewer.entities.remove(activeLine);
        }
        if (Cesium.defined(activeUnclampedLine)) {
            viewer.entities.remove(activeUnclampedLine);
        }
        activeLine = viewer.entities.add({
            polyline: {
                positions: positions,
                width: 3,
                clampToGround: true,
                material: Cesium.Color.YELLOW.withAlpha(0.7),
            },
        });

        entityCollection.push(activeLine);
        positions.forEach(position => {
            let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            let height = cartographic.height.toFixed(2);

            viewer.entities.add({
                position: position,
                label: {
                    text: `Height: ${height}m`,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.YELLOW,
                    showBackground: true,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                }
            });
        });
        activeUnclampedLine = viewer.entities.add({
            polyline: {
                positions: positions,
                width: 3,
                clampToGround: false,
                material: Cesium.Color.GREEN.withAlpha(0.7),
            },
        });

        entityCollection.push(activeUnclampedLine);
        startDraw = false;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.canvas.style.cursor = 'default';
    }

    async downloadElevation() {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const canvasMap = viewer.scene.canvas;
        const imgDataMap = canvasMap.toDataURL("image/png");
        const canvasChart = await html2canvas(document.getElementById("elevationChart"));
        const imgDataChart = canvasChart.toDataURL("image/png");
        pdf.addImage(imgDataMap, 'PNG', 10, 20, 190, 100); 

        pdf.setFontSize(10);

        pdf.text(`Longitude: ${globeCartographic.longitude}, Latitude: ${globeCartographic.latitude}`, 105, 130, { align: "center" });

        pdf.addImage(imgDataChart, 'PNG', 10, 140, 190, 60); 

        const logoImg = await (await fetch('icon/pdf-logo.png')).blob();
        const logoData = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(logoImg);
        });

        const logoWidth = 45;
        const logoHeight = 20;
        const xPosition = (pdf.internal.pageSize.getWidth() - logoWidth) / 2;
        const yPosition = 210;
        pdf.addImage(logoData, 'PNG', xPosition, yPosition, logoWidth, logoHeight);

        pdf.setFontSize(12);
        const startX = 10; 
        const startY = yPosition; 
        this.addElevationPoints(pdf, storedElevations, startX, startY, logoHeight);
        pdf.setFontSize(16);
        pdf.text("Elevation Profile with Polyline", 105, 10, { align: "center" });

        const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
        const fileName = `elevation- ${currentDate}.pdf`;
        pdf.save(fileName);
    }


    addElevationPoints(pdf, elevations, startX, startY, logoHeight) {
        const pointsPerLine = 5;
        let currentX = startX;
        let currentY = startY + logoHeight + 10;
        pdf.setFontSize(10);
        elevations.forEach((elevation, index) => {
            pdf.text(`Point-${index + 1} (${elevation}m)`, currentX, currentY);
            currentX += 35; 
            if ((index + 1) % pointsPerLine === 0) {
                currentX = startX; 
                currentY += 10; 
            }
        });
    }


    resetProfile() {
        storedElevations = [];
        $("#elevaionProfile").click();
        $('.label-class').text("");
        $('#downloadElevation').addClass("hidden");
        $("#elevationChart").css("display", "none");
        viewer.canvas.style.cursor = 'default';
        viewer.entities.remove(this.labelEntity);
        viewer.entities.removeAll();
        const canvas = document.getElementById('elevationChart');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            // Clear the entire canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

    }
}

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