export class LineOfSight {
  constructor(viewer) {
    this.viewer = viewer;
    this.viewer.scene.globe.depthTestAgainstTerrain = true;
    this.earthPosition;
    this.activeShapePoints = [];
    this.activeEntity;
    this.startPoint;
    this.startPoints = [];
    this.floatingPoint;
    this.floatingPoints = [];
    this.id = 0;
    this.selectedPoint;
    this.dataSource = new Cesium.CustomDataSource("lineofSight");
    this.entityCollection = [];
    this.handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  }

  destroy() {

    showLoading();
    setTimeout(function () {
      hideLoading();
    }, 1000);
    let _this = this;
    this.viewer.canvas.style.cursor = "default";

    for (var i = 0; i < this.entityCollection.length; i++) {
      this.dataSource.entities.remove(this.entityCollection[i]);
    }
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.RIGHT_CLICK
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOWN,
      Cesium.KeyboardEventModifier.ALT
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_UP,
      Cesium.KeyboardEventModifier.ALT
    );
    this.viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      Cesium.KeyboardEventModifier.ALT
    );
    this.entityCollection = [];
    this.dataSource.entities.remove(this.floatingPoint, true);
    this.floatingPoints.forEach(function (point) {
      _this.dataSource.entities.remove(point, true);
    });
    this.startPoints.forEach(function (point) {
      _this.dataSource.entities.remove(point, true);
    });

    this.id = 0;
    this.activeShapePoints = [];
    this.startPoint = undefined;
    this.floatingPoint = undefined;
    this.floatingPoints = [];
    this.earthPosition = undefined;
  }

  disableCameraMotion(state, viewer) {
    viewer.scene.screenSpaceCameraController.enableRotate = state;
    viewer.scene.screenSpaceCameraController.enableZoom = state;
    viewer.scene.screenSpaceCameraController.enableLook = state;
    viewer.scene.screenSpaceCameraController.enableTilt = state;
    viewer.scene.screenSpaceCameraController.enableTranslate = state;
  }

  start() {
    this.viewer.dataSources.add(this.dataSource);
    let picked = false;

    this.viewer.screenSpaceEventHandler.setInputAction((event) => {
      let newPosition;
      if (!Cesium.defined(this.earthPosition)) {
        if (
          this.viewer.terrainProvider.constructor.name ===
          "EllipsoidTerrainProvider"
        ) {
          newPosition = this.viewer.camera.pickEllipsoid(event.position);
        } else {
          newPosition = this.viewer.scene.pickPosition(event.position);
        }
        this.earthPosition = Cesium.Cartesian3.clone(newPosition);
      }

      if (this.startPoint === undefined) {
        this.startPoint = Cesium.Cartesian3.clone(this.earthPosition);
        this.startPoints.push(
          this.createPoint(this.dataSource, this.startPoint, this.id, true)
        );
        this.id = this.id + 1;
      } else {
        let targetPoint = this.viewer.scene.pickPosition(event.position);
        this.floatingPoints.push(
          this.createPoint(this.dataSource, targetPoint, this.id)
        );
        this.activeShapePoints = [this.startPoint, targetPoint];
        this.drawSightViewLine(
          this.dataSource,
          this.activeShapePoints,
          this.id
        );
        this.id = this.id + 1;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.viewer.screenSpaceEventHandler.setInputAction((event) => {
      this.viewer.canvas.style.cursor = "crosshair";
      viewer.scene.render();
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.viewer.screenSpaceEventHandler.setInputAction((event) => {
      this.viewer.canvas.style.cursor = "crosshair";
      let _this = this;

      this.viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_CLICK
      );

      this.handler.setInputAction((click) => {
        let pickedObject = _this.viewer.scene.pick(click.position);
        if (Cesium.defined(pickedObject) && pickedObject.id?.type === "point") {
          picked = true;
          this.disableCameraMotion(false, this.viewer);
          _this.selectedPoint = pickedObject.id;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

      this.handler.setInputAction((movement) => {
        if (!picked) {
          return;
        }
        if (_this.selectedPoint && _this.selectedPoint.point) {
          let pickedObject = _this.viewer.scene.pickPosition(
            movement.endPosition
          );
          // _this.selectedPoint.point.pixelSize = 50;
          viewer.scene.render();
          _this.selectedPoint.position.setValue(pickedObject);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.handler.setInputAction((movement) => {
        picked = false;
        this.disableCameraMotion(true, this.viewer);
        if (!_this.selectedPoint) {
          return;
        }

        if (_this.selectedPoint.uid === 0) {
          _this.entityCollection.map((i) => {
            _this.dataSource.entities.remove(i);
          });

          let startPoint = _this.viewer.scene.pick(movement.position)?.primitive
            .position;
          _this.startPoint = startPoint;
          _this.floatingPoints.map((j) => {
            _this.activeShapePoints = [startPoint, j.position._value];
            _this.drawSightViewLine(
              _this.dataSource,
              _this.activeShapePoints,
              j.uid
            );
          });
        } else {
          let entity = _this.entityCollection.filter(
            (e) => e.uid === _this.selectedPoint.uid
          );
          entity.forEach((i) => {
            _this.dataSource.entities.remove(i);
          });

          let targetPoint = _this.viewer.scene.pick(movement.position)
            ?.primitive.position;
          _this.activeShapePoints = [_this.startPoint, targetPoint];
          _this.drawSightViewLine(
            _this.dataSource,
            _this.activeShapePoints,
            _this.selectedPoint.uid
          );
        }
        _this.selectedPoint = undefined;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  createPoint(dataSource, worldPosition, id, startPoint) {
    viewer.scene.render();
    return dataSource.entities.add({
      position: worldPosition,
      uid: id,
      type: "point",
      point: {
        color: startPoint ? Cesium.Color.DARKORANGE : Cesium.Color.RED,
        pixelSize: 20,
        heightReference: Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
  }

  drawSightViewLine(dataSource, positionData, id) {
    viewer.scene.render();
    let direction = Cesium.Cartesian3.normalize(
      Cesium.Cartesian3.subtract(
        positionData[1],
        positionData[0],
        new Cesium.Cartesian3()
      ),
      new Cesium.Cartesian3()
    );
    let ray = new Cesium.Ray(positionData[0], direction);
    let objectsToExclude = [];
    let result = this.viewer.scene.pickFromRay(ray, dataSource.entities.values);
    if (result !== undefined) {
      viewer.scene.render();
      this.entityCollection.push(
        dataSource.entities.add({
          uid: id,
          type: "line",
          polyline: {
            positions: [positionData[0], result.position],
            arcType: Cesium.ArcType.NONE,
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.LIMEGREEN,
              outlineWidth: 0,
            }),
            depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.LIMEGREEN,
              outlineWidth: 0,
            }),
          },
        })
      );
      this.entityCollection.push(
        dataSource.entities.add({
          uid: id,
          type: "line",
          polyline: {
            positions: [result.position, positionData[1]],
            arcType: Cesium.ArcType.NONE,
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.RED,
              outlineWidth: 0,
            }),
            depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.RED.withAlpha(0.5),
              outlineWidth: 0,
            }),
          },
        })
      );
    } else {
      viewer.scene.render();
      this.entityCollection.push(
        dataSource.entities.add({
          uid: id,
          type: "line",
          polyline: {
            positions: positionData,
            arcType: Cesium.ArcType.NONE,
            width: 10.0,
            material: new Cesium.PolylineGlowMaterialProperty({
              color: Cesium.Color.DARKORANGE,
              glowPower: 0.05,
            }),
            depthFailMaterial: new Cesium.PolylineGlowMaterialProperty({
              color: Cesium.Color.DARKORANGE,
              glowPower: 0.05,
            }),
          },
        })
      );
    }
  }
}

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