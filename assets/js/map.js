// import Config from './config.js';
import { Measure } from './measure.js'
import { FlyAround } from './flyAround.js';
import { DynamicComponent } from './dynamicComponent.js';
import { Gps } from './gps.js';
import { DynamicLayer } from './dynamicLayer.js';
import { ShadowAnalysis } from './shadow.js'
import { FloodAnalysis } from './flood.js'
import { ViewShed } from './viewshade.js'
import { LineOfSight } from './los.js'
import { FlightSimulation } from './flightsimulation.js'
import { ClippingTool } from './clipping.js'
import { RoutingNavigation } from './route.js'
import { AssetsModel } from './3dModel.js'
import { SplitTool } from './split.js'
import { Draw } from './draw.js'
import { ElevationProfile } from './elevation.js'
import { Buffer } from './buffer.js'
import { Test } from './test.js'
import Config from './Config.json' with {type: 'json'};






// *********************************Layer & Model************************************************
var accessToken = sessionStorage.getItem('cesiumIonId');
if (accessToken) {
  let verified = verifyAccessToken(accessToken);
  if (verified) {
    Cesium.Ion.defaultAccessToken = accessToken;
    viewer = new Cesium.Viewer("cesiumContainer", {
      terrain: Cesium.Terrain.fromWorldTerrain({
        requestVertexNormals: true, 
      }),
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      navigationHelpButton: false, 
      fullscreenButton: true,
      sceneModePicker: true, 
      homeButton: false, 
      geocoder: true, 
      infoBox: false, 
      selectionIndicator: false,
      shouldAnimate: true,
      scene3DOnly: false,
      sceneMode: Cesium.SceneMode.SCENE3D,
      vrButton: false,
      showRenderLoopErrors: false,
      shouldAnimate: true,
      contextOptions: {
        webgl: {
          preserveDrawingBuffer: true   
        }
      }
    });


  }
  else {
    showMessage("401 unautherized request ...")
  }
}
else {
  viewer = new Cesium.Viewer("cesiumContainer", {
    requestRenderMode: true,
    maximumRenderTimeChange: Infinity,
    navigationHelpButton: false, 
    fullscreenButton: false, 
    sceneModePicker: false, 
    homeButton: false, 
    geocoder: false, 
    infoBox: false, 
    selectionIndicator: false,
    shouldAnimate: false,
    scene3DOnly: false,
    vrButton: false
  });

  osmImageryProvider = viewer.imageryLayers.addImageryProvider(
    new Cesium.OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/'
    })
  );


}

viewer.scene.requestRender();

async function verifyAccessToken(accessToken) {
  const url = Config.accessTokenUrl + `${accessToken}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      const errorData = await response.json();
      sessionStorage.clear();  // Clears all session storage at once
      window.location.href = "login.html";
      console.error("Invalid access token:", errorData.message);
      showMessage("Access token is invalid. Please check your token and try again.");
    } else {
      throw new Error(`Unexpected error: ${response.status}`);
    }
  } catch (error) {
    console.error("Error verifying access token:", error);
    showMessage("Failed to verify the access token. Please try again.");
  }
}

scene = viewer.scene;
scene.debugShowFramesPerSecond = true;
viewer.scene.skyAtmosphere.brightnessShift = 10; 
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.requestRender();
//*******************Compass Code************************* */

var compassWidget = new Cesium.NavigationHelpButton({
  container: viewer.container
});

compassWidget.viewModel.command.afterExecute.addEventListener(function () {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-105.0, 40.0, 500000.0), // Example coordinates
    orientation: {
      heading: Cesium.Math.toRadians(90), // North
      pitch: Cesium.Math.toRadians(-90), // Top-down view
      roll: 0
    }
  });
});

let heading;
viewer.camera.changed.addEventListener(function () {
  heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2);
  // console.log('Current Heading: ' + heading);
  var compassImage = document.getElementById('compassImage');
  compassImage.style.transform = 'rotate(' + heading + 'deg)';

});

document.getElementById('compassImage').addEventListener('mouseenter', function () {
  var roundedHeading = Math.floor(heading);
  $('#compass').attr('title', roundedHeading + "°");
});


//***********************TileSet Load********************************** */
async function loadTileset(assetId, existingTileset, styleFunction) {
  try {
    showLoading();
    setTimeout(function () {
      hideLoading();
    }, 7000);
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);
    if (existingTileset) {
      viewer.scene.primitives.remove(existingTileset);
    }
    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);

    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${isVisible} === true', 'color("green")'],
          ['${isVisible} === false', 'color("red")']
        ]
      }
    });

    // Apply the default style if it exists
    const extras = tileset.asset.extras;
    if (
      Cesium.defined(extras) &&
      Cesium.defined(extras.ion) &&
      Cesium.defined(extras.ion.defaultStyle)
    ) {
      tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
    }
    if (styleFunction) styleFunction(tileset); 
    return tileset;
  } catch (error) {
    console.error("Error loading tileset:", error);
  }
}

$(document).ready(function () {
  let newYorkTileset, sydneyTileset, washingtonTileset;

  // Function to remove all tilesets
  function removeAllTilesets() {
    if (newYorkTileset) viewer.scene.primitives.remove(newYorkTileset);
    if (sydneyTileset) viewer.scene.primitives.remove(sydneyTileset);
    if (washingtonTileset) viewer.scene.primitives.remove(washingtonTileset);
    newYorkTileset = sydneyTileset = washingtonTileset = null;
  }

  $("#newYork").click(async function () {
    if (this.checked) {
      removeAllTilesets();
      newYorkTileset = await loadTileset(75343, newYorkTileset);
      $("#sydney").prop("checked", false);
      $("#washington").prop("checked", false);
    } else {
      if (newYorkTileset) {
        viewer.scene.primitives.remove(newYorkTileset);
        newYorkTileset = null;
      }
    }
  });

  $("#sydney").click(async function () {
    if (this.checked) {
      removeAllTilesets();
      sydneyTileset = await loadTileset(2644092, sydneyTileset);
      $("#newYork").prop("checked", false);
      $("#washington").prop("checked", false);
    } else {
      if (sydneyTileset) {
        viewer.scene.primitives.remove(sydneyTileset);
        sydneyTileset = null;
      }
    }
  });

  $("#washington").click(async function () {
    if (this.checked) {
      removeAllTilesets();
      washingtonTileset = await loadImageryProvider(3827);
      $("#newYork").prop("checked", false);
      $("#sydney").prop("checked", false);
    } else {
      // if (washingtonTileset) {
      //   viewer.scene.primitives.remove(washingtonTileset);
      //   washingtonTileset = null;
      // }
    }
  });
});
async function loadImageryProvider(assetId) {
  try {
    showLoading();
    setTimeout(function () {
      hideLoading(); // Hide loading spinner after 3 seconds
    }, 7000);
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
      await Cesium.IonImageryProvider.fromAssetId(3827),
    );
    await viewer.zoomTo(imageryLayer);
  } catch (error) {
    console.log(error);
  }
}




$("#OpenStreet").click(function () {
  if (this.checked) {
    showLoading();
    setTimeout(function () {
      hideLoading(); // Hide loading spinner after 3 seconds
    }, 7000);
    openStreetMap = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/'
    });

    viewer.imageryLayers.addImageryProvider(openStreetMap);
  } else {
    const layers = viewer.imageryLayers;
    const openStreetMapLayer = layers.get(layers.length - 1);
    layers.remove(openStreetMapLayer);
  }
});


let roadLayer;

$("#beingRoadMap").change(async function () {
  if (this.checked) {
    showLoading();
    setTimeout(function () {
      hideLoading(); // Hide loading spinner after 3 seconds
    }, 5000);
    try {
      const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(4);
      roadLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
    } catch (error) {
      console.error('Failed to load imagery provider:', error);
      hideLoading(); // Hide loading spinner if an error occurs
    }
  } else {
    if (roadLayer) {
      viewer.imageryLayers.remove(roadLayer);
      roadLayer = null;
    }
  }
});


$("#beingMap").change(async function () {
  if (this.checked) {
    showLoading();
    setTimeout(function () {
      hideLoading(); // Hide loading spinner after 3 seconds
    }, 5000);
    try {
      const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3);
      roadLayer = viewer.imageryLayers.addImageryProvider(imageryProvider);
    } catch (error) {
      console.error('Failed to load imagery provider:', error);
      hideLoading(); // Hide loading spinner if an error occurs
    }
  } else {
    if (roadLayer) {
      viewer.imageryLayers.remove(roadLayer);
      roadLayer = null;
    }
  }
});


// $("#OpenStreet").click();
//***************Tools Objects****************** */ 
MeasureTools = new Measure();
flyaround = new FlyAround();
dynamicCompenet = new DynamicComponent();
gps = new Gps();
dynamicLayer = new DynamicLayer(viewer);
shadowAnalysis = new ShadowAnalysis();
floodAnalysis = new FloodAnalysis();
viewShed = new ViewShed(viewer);
losTool = new LineOfSight(viewer);
flightSimulation = new FlightSimulation();
clipping = new ClippingTool();
route = new RoutingNavigation();
assetModel = new AssetsModel();
splitTool = new SplitTool();
draw = new Draw();
elevation = new ElevationProfile();
buffer = new Buffer();
test = new Test(viewer);



//*******************FlyAround Code */
document.getElementById('flyaroundTool').addEventListener('click', (event) => {
  var currentSrc = $('#flyaroundTool').attr('src');

  if (currentSrc === 'icon/Clockwise.svg') {
    $('#flyaroundTool').attr('src', 'icon/Anti-ClockwiseNew.svg');
  } else {
    $('#flyaroundTool').attr('src', 'icon/Clockwise.svg');
  }
  showMessage("Click on Map to Stop Rotation");
  event.stopImmediatePropagation();
  flyaround.rotateView();
});

viewer.canvas.addEventListener('click', function (event) {
  flyaround.stopRotation(event);
});

// -------------------Fly Around End--------------------------
// identifyflg
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

handler.setInputAction(function (movement) {
  const pickedObject = viewer.scene.pick(movement.endPosition);
  if (Cesium.defined(pickedObject) && pickedObject.id.type === "glb_amenity") {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//***********************Mouse Left Click Event********************************* */
// Initialize the left-click event handler
viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {

  const pickedObject = viewer.scene.pick(clickEvent.position);
  if (Cesium.defined(pickedObject) && pickedObject.id.type === "glb_amenity") {
    viewer.selectedEntity = pickedObject.id;
    console.log('Selected Entity:', viewer.selectedEntity);
    $('.info-box').show();
    document.getElementById('locationvalue').innerText = `${pickedObject.id.longitude}, ${pickedObject.id.latitude}`;
    document.getElementById('amenityvalue').innerText = pickedObject.id.amenity;
    document.getElementById('amenityName').innerText = pickedObject.id.name;

  }
  if (Cesium.defined(pickedObject)) {
    $('.info-box').show();
    document.getElementById('locationvalue').innerText = `${pickedObject.id.longitude}, ${pickedObject.id.latitude}`;
    document.getElementById('amenityvalue').innerText = pickedObject.id.amenity;
    document.getElementById('amenityName').innerText = pickedObject.id.name;
  }
  let cartesian = viewer.scene.pickPosition(clickEvent.position);
  if (cartesian) {


    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    globeCartographic = [];
    globeCartographic = cartographic;
    var selectedLongitude = Cesium.Math.toDegrees(cartographic.longitude);
    var selectedLatitude = Cesium.Math.toDegrees(cartographic.latitude);
    if (startflg) {
      document.getElementById('firstPosition').value = selectedLongitude + "," + selectedLatitude;
      route.addLocation(cartesian); 
      viewer.canvas.style.cursor = 'default';
      startflg = false;
    }

    if (endflg) {
      document.getElementById('secondPosition').value = selectedLongitude + "," + selectedLatitude;
      route.addLocation(cartesian); 
      viewer.canvas.style.cursor = 'default';
      endflg = false;
    }

  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);




document.getElementById("add_viewshed").addEventListener("click", function () {
  viewShed.addViewshedAnalysis();
});


$(document).on('change', '#WorldTerrain', function () {
  if (this.checked) {
    viewer.scene.setTerrain(
      new Cesium.Terrain(
        Cesium.CesiumTerrainProvider.fromIonAssetId(1),
      ),
    );
  } else {
    viewer.scene.terrainProvider = new Cesium.EllipsoidTerrainProvider();

  }
});

//***********************Load Moon Terrain********************************* */
let tilesetMoon;
$(document).on('change', '#moonTerrain', function () {
  if (this.checked) {
    viewer.scene.globe = new Cesium.Globe(Cesium.Ellipsoid.MOON);
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2000000;
    if (viewer.baseLayerPicker) {
      viewer.baseLayerPicker.viewModel.selectedImagery = undefined;
    }
    Cesium.Cesium3DTileset.fromIonAssetId(2684829)
      .then(tileset => {
        if (tileset) {
          tilesetMoon = viewer.scene.primitives.add(tileset);
          console.log('Tileset loaded:', tileset);
          tileset.readyPromise.then(() => {
            console.log('Tileset is ready.');
            viewer.camera.lookAt(
              tileset.boundingSphere.center, 
              new Cesium.Cartesian3(0.0, 0.0, 5000.0) 
            );
            console.log('Camera position:', viewer.camera.positionWC);
            viewer.zoomTo(tilesetMoon).then(() => {
              console.log('Zoomed to tileset successfully.');
            }).catch(error => {
              console.error('Error zooming to tileset:', error);
            });

          }).catch(error => {
            console.error('Error when loading tileset:', error);
          });
        } else {
          console.error('Tileset is undefined.');
        }
      })
      .catch(error => {
        console.error('Error creating tileset:', error);
      });
  } else {
    if (tilesetMoon) {
      viewer.scene.primitives.remove(tilesetMoon);
      tilesetMoon = null;  
    }
  }
});

//********************Map Controller Tilt*************************************** */

var camera = viewer.camera;
var deltaRadians = Cesium.Math.toRadians(3.0);
document.getElementById("tiltUpIcon").addEventListener("click", smoothTiltUp, false);
document.getElementById("tiltDownIcon").addEventListener("click", smoothTiltDown, false);

function smoothTiltUp() {
    var pitch = camera.pitch; 
    camera.setView({
        orientation: {
            pitch: Math.min(pitch + deltaRadians, Cesium.Math.toRadians(0))
        }
    });
}

function smoothTiltDown() {
    var pitch = camera.pitch; 
    camera.setView({
        orientation: {
            pitch: Math.max(pitch - deltaRadians, Cesium.Math.toRadians(-90))
        }
    });
}
