export class Draw {
    constructor() {
    }

    drawPoint() {
        viewer.canvas.style.cursor = 'crosshair';
        const handler = viewer.screenSpaceEventHandler.setInputAction(function (click) {
            const clickPosition = viewer.scene.pickPosition(click.position);
            if (Cesium.defined(clickPosition)) {
                if (PointLabel) {
                    viewer.entities.remove(PointLabel);
                }
                PointLabel = viewer.entities.add({
                    position: clickPosition,
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.RED,
                        heightReference: Cesium.HeightReference.NONE,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                    },
                    label: {
                        text: "VisionMap",
                        font: 'bold 18px sans-serif',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        fillColor: Cesium.Color.CYAN,
                        showBackground: true,
                        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                });
                viewer.canvas.style.cursor = 'default';
                viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }
    updateLabel(newLabel) {
        if (PointLabel) {
            PointLabel.label.text = newLabel;
            viewer.scene.render();
        } else {
            labelEntity.label.text=newLabel;
            viewer.scene.render();
        }
    }
    resetDrawing() {
        document.getElementById('locationLabel').value = "";
        if (PointLabel) {
            viewer.entities.remove(PointLabel);
        }
        viewer.entities.removeAll();

    }

    drawPolygon(callback) {
        showMessage("To complete PolyLine using Right Click!")
        viewer.canvas.style.cursor = 'crosshair';
        let positions = [];
        let clickStatus = false;
        let labelEntity = null;
        let labelPositions = [];
        viewer.scene.globe.depthTestAgainstTerrain = true;
        viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
          clickStatus = true;
          let cartesian = viewer.scene.pickPosition(clickEvent.position);
          if (positions.length == 0) {
            positions.push(cartesian.clone());
            labelPositions.push(cartesian.clone());
    
            dynamicCompenet.addPoint(cartesian);
            viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
              console.log("moving");
              let movePosition = viewer.scene.pickPosition(moveEvent.endPosition);
              if (!movePosition) {
                return false;
              }
              if (positions.length == 1) {
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
              if (positions.length >= 3) {
                if (labelEntity) {
                  viewer.entities.remove(labelEntity);
                  entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
                }
    
              }
              clickStatus = false;
            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    
    
          } else if (positions.length == 2) {
            if (!cartesian) {
              return false
            }
            positions.pop();
            positions.push(cartesian.clone());
            dynamicCompenet.addPoint(cartesian);
            viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
    
              let clickPosition = viewer.scene.pickPosition(clickEvent.position);
              if (!clickPosition) {
                return false;
              }
              positions.pop();
              positions.push(clickPosition);
              positions.push(positions[0]);
              viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
              viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
              viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    
              if (callback) {
                callback()
              }
              let polygonCenter;
              if (positions.length > 2) {
                polygonCenter = this.calculatePolygonCenter(positions);
    
              }
    
    
              dynamicCompenet.addLabel(polygonCenter, "visionMap", "up");
              entityCollection.push(labelEntity);
    
              this.line_result = [];
              this.line_result.push(labelEntity)
    
    
              viewer.canvas.style.cursor = 'default';
            }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    
          } else if (positions.length >= 3) {
            if (!cartesian) {
              return false
            }
            positions.pop();
            positions.push(cartesian.clone());
    
            dynamicCompenet.addPoint(cartesian);
    
    
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      };


      calculatePolygonCenter(positions) {
        if (positions.length === 0) return new Cesium.Cartesian3();
    
        let xSum = 0;
        let ySum = 0;
        let zSum = 0;
    
        for (const pos of positions) {
          xSum += pos.x;
          ySum += pos.y;
          zSum += pos.z;
        }
    
        const count = positions.length;
        return new Cesium.Cartesian3(xSum / count, ySum / count, zSum / count);
      }
    

    drawLine() {
        viewer.canvas.style.cursor = 'crosshair';
        dynamicCompenet.PolyLine(function (addLabel) {
        }, true);


    }

}