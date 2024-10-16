export class DynamicComponent {
  constructor() {


  }


  PolyLine(callback, addLabel) {
    let positions = [];
    viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
      let cartesian = viewer.scene.pickPosition(clickEvent.position); // Coordinate
      if (!cartesian) {
        return false;
      }
      if (positions.length == 0) {
        positions.push(cartesian.clone());
        this.addPoint(cartesian);
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let height = cartographic.height;
        console.log(`Height at first point: ${height} meters`);
        viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
          let movePosition = viewer.scene.pickPosition(moveEvent.endPosition); // mouse movement point
          if (!movePosition) {
            return false;
          }
          if (positions.length == 2) {
            positions.pop();
            positions.push(movePosition);

            LineFirstPosition = positions[0];
            LineSecondPosition = positions[1];
            let centerPoint = Cesium.Cartesian3.midpoint(LineFirstPosition, LineSecondPosition, new Cesium.Cartesian3());
            lineCenter = centerPoint;

            if (addLabel) {
              // this.destroy();
              // label
              if (labelEntity) {
                viewer.entities.remove(labelEntity);
                entityCollection.splice(entityCollection.indexOf(labelEntity), 1);
              }
              var lengthText = MeasureTools.getLengthText(positions[0], positions[1]);
              labelEntity = this.addLabel(lineCenter, lengthText);
              labelEntity._result =lengthText;
              entityCollection.push(labelEntity);
              line_result = [];
              line_result.push(labelEntity)
            }

          }

          else {
            positions.push(movePosition);
            let cartographic = Cesium.Cartographic.fromCartesian(movePosition);
            let height = cartographic.height;
            console.log(`Height at moving point: ${height} meters`);
            this.addLineOfLine(positions, false);
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      } else {
        // keep the second point
        positions.pop();
        positions.push(cartesian);
        this.addPoint(cartesian);
        this.addLineOfLine(positions, false);

        // Show height for the second point
        let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        let height = cartographic.height;
        console.log(`Height at second point: ${height} meters`);
        viewer.canvas.style.cursor = 'default';
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        if (callback) {
          callback();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  /** 
    * Add Point
    * @param position
    */
  addPoint(position) {
    if(startDraw){
      startPosition =position; 
      startDraw=false;
    }
    else{
      endPosition =position; 
      startDraw=true;
    }
    const blackAndWhiteStripeMaterial = new Cesium.StripeMaterialProperty({
      evenColor: Cesium.Color.BLACK,
      oddColor: Cesium.Color.WHITE,
      repeat: 5.0,
      orientation: Cesium.StripeOrientation.HORIZONTAL
    });

    entityCollection.push(viewer.entities.add(new Cesium.Entity({
      position: position,
      point: {
        color: Cesium.Color.WHITE,
        pixelSize: 10,
        heightReference: Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        material: blackAndWhiteStripeMaterial
      }
    })));
  }



  addLineOfLine(positions, height) {
    let dynamicPositions = new Cesium.CallbackProperty(() => {
      return positions;
    }, false);

    const stripeMaterial = new Cesium.StripeMaterialProperty({
      evenColor: Cesium.Color.YELLOW,
      oddColor: Cesium.Color.BLACK,
      repeat: 10.0,
      orientation: Cesium.StripeOrientation.HORIZONTAL,
    });

    entityCollection.push(viewer.entities.add(new Cesium.Entity({
      polyline: {
        positions: dynamicPositions,
        width: 3,
        clampToGround: height,
        material: stripeMaterial,
        heightReference: Cesium.HeightReference.NONE,
      }
    })));
  };

  addLabel(centerPoint, text, line) {
    const cartesian = new Cesium.Cartesian3(centerPoint.x, centerPoint.y, centerPoint.z);
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    const longitude = Cesium.Math.toDegrees(cartographic.longitude);
    const latitude = Cesium.Math.toDegrees(cartographic.latitude);
    let altitude = cartographic.height;


    let offset = new Cesium.Cartesian2(30, -25)


    if (line === 'up') {
      offset = new Cesium.Cartesian2(30, -25)
    } else if (line === 'right') {
      offset = new Cesium.Cartesian2(40, 0)
    } else if (line === 'bottom') {
      offset = new Cesium.Cartesian2(0, -20)
    }
    altitude += 0.8;
    labelEntity = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude),
      label: {
        text: String(text),
        font: 'bold 18px sans-serif',
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: Cesium.Color.CYAN,
        showBackground: true,
        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),
        pixelOffset: offset,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    });

    return labelEntity;

  }

  destroy(callback) {
    for (var i = 0; i < entityCollection.length; i++) {
      viewer.entities.remove(entityCollection[i]);
    }
    // for (var i = 0; i < polygonEntity.length; i++) {
    //     viewer.entities.remove(this.polygonEntity[i]);
    // }
    for (var i = 0; i < line_result.length; i++) {
      viewer.entities.remove(line_result[i]);
    }
    // // if (addCeneterLabel) {
    // //     viewer.entities.remove(addCeneterLabel);
    // // }
    // viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    // viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    // viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    // entityCollection = [];
    // polygonEntity = []

    if (callback) {
      callback()
    }
  };


  /**
 * Add line for polygon with zebra crossing pattern
 * @param positions
 */
add3DLineForPolygon(positions) {
  let dynamicPositions = new Cesium.CallbackProperty(() => {
      return positions;
  }, false);

  if (positions.length < 2) {
      console.error('Not enough positions to draw a polyline.');
      return;
  }

  entityCollection.push(viewer.entities.add({
      polyline: {
          positions: dynamicPositions,
          width: 5,
          material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.ORANGE, 
              gapColor: Cesium.Color.BLACK, 
              dashLength: 16.0, 
              dashPattern: parseInt('1111000011110000', 2) 
          }),
          clampToGround: false,
          depthFailMaterial: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.ORANGE, 
              gapColor: Cesium.Color.WHITE, 
              dashLength: 16.0, 
              dashPattern: parseInt('1111000011110000', 2) 
          })
      }
  }));
};


addPointLabel(position,Label) {
      
  const blackAndWhiteStripeMaterial = new Cesium.StripeMaterialProperty({
    evenColor: Cesium.Color.BLACK,
    oddColor: Cesium.Color.WHITE,
    repeat: 5.0,
    orientation: Cesium.StripeOrientation.HORIZONTAL
  });

  // Add point with a label
  entityCollection.push(viewer.entities.add(new Cesium.Entity({
    position: position,
    point: {
      color: Cesium.Color.WHITE,
      pixelSize: 10,
      heightReference: Cesium.HeightReference.NONE,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      material: blackAndWhiteStripeMaterial
    },
    label: {
      text: String(Label),  // Replace with the desired label text
      font: '14pt sans-serif',
      fillColor: Cesium.Color.YELLOW,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -15) // Adjust the label's position above the point
    }
  })));
}

  
}