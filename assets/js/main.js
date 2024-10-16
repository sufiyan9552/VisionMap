

function showMessage(msg) {
    document.getElementById("errorInfo").style.display = "block";
    $("#messageInfoVal").html(msg);
    setTimeout(() => {
        document.getElementById("errorInfo").style.display = "none";
        $("#messageInfoVal").html('');
    }, 5000);
}


// -------------------Home Extent Start------------------------
function zoomToExtant() {
    viewer.camera.flyHome(0);
}
document.getElementById("homeTool").addEventListener("click", zoomToExtant);



//*****************************Loader******************************** */
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

showLoading();
setTimeout(function () {
    hideLoading();
}, 3000);



$('.close-icon').click(function () {
    $('.modal-box').hide();
    $('.modal-backdrop').hide();
});

//**************************Map Controllers**************************************** */
document.getElementById("zoominIcon").addEventListener("click", smoothZoomIn, false);
document.getElementById("zoomOutIcon").addEventListener("click", smoothZoomOut, false);

function smoothZoomOut() {
    var cameraHeight = viewer.camera.positionCartographic.height;
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(viewer.camera.positionCartographic.longitude, viewer.camera.positionCartographic.latitude, cameraHeight + 2000), // Zoom out by increasing height
        duration: 1.5
    });
}

function smoothZoomIn() {
    var cameraHeight = viewer.camera.positionCartographic.height;
    if (cameraHeight > 100) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromRadians(viewer.camera.positionCartographic.longitude, viewer.camera.positionCartographic.latitude, cameraHeight - 2000), // Zoom in by decreasing height
            duration: 1.5
        });
    }
}


document.getElementById("leftRotate").addEventListener("click", smoothRotateLeft, false);
document.getElementById("rightRotate").addEventListener("click", smoothRotateRight, false);

function smoothRotateLeft() {
    var heading = viewer.camera.heading;
    viewer.camera.flyTo({
        destination: viewer.camera.position,
        orientation: {
            heading: heading - Cesium.Math.toRadians(5),
            pitch: viewer.camera.pitch,
            roll: viewer.camera.roll
        },
        duration: 1.5
    });
}

function smoothRotateRight() {
    var heading = viewer.camera.heading;
    viewer.camera.flyTo({
        destination: viewer.camera.position,
        orientation: {
            heading: heading + Cesium.Math.toRadians(5),
            pitch: viewer.camera.pitch,
            roll: viewer.camera.roll
        },
        duration: 1.5
    });
}


document.getElementById("panLeftIcon").addEventListener("click", smoothPanLeft, false);
document.getElementById("panRightIcon").addEventListener("click", smoothPanRight, false);

function smoothPanLeft() {
    var camera = viewer.camera;
    var currentPosition = camera.positionCartographic;
    var delta = 0.0001;
    var newLongitude = currentPosition.longitude - delta;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(newLongitude, currentPosition.latitude, currentPosition.height),
        orientation: {
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll
        },
        duration: 1.5
    });
}

function smoothPanRight() {
    var camera = viewer.camera;
    var currentPosition = camera.positionCartographic;

    var delta = 0.0001;
    var newLongitude = currentPosition.longitude + delta;
    camera.flyTo({
        destination: Cesium.Cartesian3.fromRadians(newLongitude, currentPosition.latitude, currentPosition.height),
        orientation: {
            heading: camera.heading,
            pitch: camera.pitch,
            roll: camera.roll
        },
        duration: 1.5
    });
}


