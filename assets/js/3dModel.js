export class AssetsModel {
    constructor() {
        this.glbEntity;
        this.polygonEntity;
    }
    add3DModel(model) {
        viewer.canvas.style.cursor = 'crosshair';
        if (model === 'select_asset') {
            showMessage("Please Select 3D Model or Asset!");
        } else {
            let dynamicScale = 1.0;
            if(model === 'tower'){
                dynamicScale = 20;
            }
            const clickHandler = (clickEvent) => {
                if (model === 'select_asset') {
                    showMessage("Please Select 3D Model or Asset!");
                }
                Modelcartesian = viewer.scene.pickPosition(clickEvent.position);
                if (Cesium.defined(Modelcartesian)) {
                    let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(Modelcartesian);
                    Modelheight = cartographic.height;
                    let hpr = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(0), Cesium.Math.toRadians(0), Cesium.Math.toRadians(0));
                    let orientation = Cesium.Transforms.headingPitchRollQuaternion(Modelcartesian, hpr);
                    this.glbEntity = viewer.entities.add({
                        position: Modelcartesian,
                        orientation: orientation,
                        model: {
                            uri: 'assets/glb/' + model + '.glb',
                            scale: dynamicScale
                        }
                    });
                    viewer.canvas.style.cursor = 'default';
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }
                // viewer.screenSpaceEventHandler.setInputAction(function (movement) {
                //     const pickedEntity = viewer.scene.pick(movement.endPosition);
                
                //     if (Cesium.defined(pickedEntity) && pickedEntity == this.glbEntity) {
                //         viewer.canvas.style.cursor = 'pointer';
                //     } else {
                //         viewer.canvas.style.cursor = 'default';
                //     }
                // }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            };
            viewer.screenSpaceEventHandler.setInputAction(clickHandler, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    }


    updateModelOrientation() {
        if (!Modelcartesian) {
            console.error('Modelcartesian is not defined');
            return; 
        }
        viewer.scene.requestRender();

        let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(Modelcartesian);
        if (!cartographic || isNaN(cartographic.longitude) || isNaN(cartographic.latitude)) {
            console.error('Invalid Modelcartesian coordinates:', Modelcartesian);
            return;
        }

        if (isNaN(Modelheight)) {
            console.error('Invalid Modelheight:', Modelheight);
            return; 
        }
        let hpr = new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(Model_heading),
            Cesium.Math.toRadians(Modelpitch),
            Cesium.Math.toRadians(Modelroll)
        );
        let updatedOrientation = Cesium.Transforms.headingPitchRollQuaternion(
            Cesium.Cartesian3.fromDegrees(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude),
                Modelheight
            ),
            hpr
        );
        if (this.glbEntity) {
            this.glbEntity.orientation = updatedOrientation;
            this.glbEntity.model.scale = newModelScale;
            this.glbEntity.position = Cesium.Cartesian3.fromDegrees(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude),
                Modelheight
            );
        } else {
            console.error('GLB Entity not initialized');
        }
    }

    create3DModel(callback) {
        showMessage("To complete PolyLine using Right Click!");
        viewer.canvas.style.cursor = 'crosshair';
        let positions = [];
        let clickStatus = false;
        let polygonEntity = null;

        viewer.scene.globe.depthTestAgainstTerrain = true;

        viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
            clickStatus = true;
            let cartesian = viewer.scene.pickPosition(clickEvent.position);

            if (positions.length === 0) {
                positions.push(cartesian.clone());
                dynamicCompenet.addPoint(cartesian);

                viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
                    let movePosition = viewer.scene.pickPosition(moveEvent.endPosition);
                    if (!movePosition) {
                        return false;
                    }
                    if (positions.length === 1) {
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
                    clickStatus = false;
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

            } else if (positions.length === 2) {
                if (!cartesian) return;

                positions.pop();
                positions.push(cartesian.clone());
                dynamicCompenet.addPoint(cartesian);

                viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
                    let clickPosition = viewer.scene.pickPosition(clickEvent.position);
                    if (!clickPosition) return;
                    positions.pop();
                    positions.push(clickPosition);
                    positions.push(positions[0]); 
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
                    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
                    this.addPolyGon(positions);

                    if (callback) {
                        callback();
                    }

                    viewer.canvas.style.cursor = 'default';
                }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

            } else if (positions.length >= 3) {
                if (!cartesian) return;

                positions.pop();
                positions.push(cartesian.clone());
                dynamicCompenet.addPoint(cartesian);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    }
    addPolyGon(positions) {
        const fillpolyPosition = positions.map(({ x, y, z }) => new Cesium.Cartesian3(x, y, z));
        const material = this.materialCallback();
        entityCollection.push(viewer.entities.add(new Cesium.Entity({
            polygon: {
                hierarchy: fillpolyPosition,
                material: material.color.withAlpha(material.alpha),
                extrudedHeight: 0
            }
        })));
    }

    materialCallback() {
        const color = Cesium.Color.BLUE;
        const alpha = 0.7;
        return { color: color, alpha: alpha };
    }

    heightCallback(newHeight) {
        entityCollection.forEach(entity => {
            if (entity.polygon) {
                entity.polygon.extrudedHeight = newHeight; 
                viewer.scene.requestRender();
            }
        });
        console.log(`All extruded heights updated to: ${newHeight}`);
    }

    updateMaterial(newMaterial) {
        const normalizedColor = newMaterial.toUpperCase();
        if (normalizedColor === 'BUILDING') {
            const buildingColor = Cesium.Color.fromCssColorString('lightgray').withAlpha(1.0);
            const textureUrl = 'icon/concrete_texture.png';
            const buildingMaterial = new Cesium.ImageMaterialProperty({
                image: textureUrl,
                repeat: new Cesium.Cartesian2(1.0, 1.0),
                color: buildingColor
            });
            entityCollection.forEach(entity => {
                if (entity.polygon) {
                    entity.polygon.material = buildingMaterial;
                    viewer.scene.requestRender();
                }
            });
        } else {
            entityCollection.forEach(entity => {
                if (entity.polygon) {
                    entity.polygon.material = Cesium.Color[normalizedColor].withAlpha(1.0); 
                    viewer.scene.requestRender();
                }
            });
            console.log('All polygon materials updated to:', newMaterial);
        }
    }


    resetAssets() {
        showLoading();
        setTimeout(function () {
            hideLoading();
        }, 3000);
        viewer.entities.remove(this.glbEntity);
        viewer.entities.removeAll();
        loadDynamicTool("3D Assets Tool", false, false, false, false, true, true, true, false);
    }
}

/*****************************Algorithem*****************************
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