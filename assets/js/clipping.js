export class ClippingTool {
    constructor() {
    }

    addPolygon(){
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        var positions = [];
        var polygon = null;
        
        handler.setInputAction(function (click) {
            var windowPosition = click.endPosition;
            var scene = viewer.scene;
            var pickRay = scene.camera.getPickRay(windowPosition);
            var intersection = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, pickRay.origin);
            positions.push(intersection);
            
            if (positions.length > 1) {
                if (polygon) {
                    viewer.entities.remove(polygon);
                }
                polygon = viewer.entities.add({
                    polygon: {
                        hierarchy: positions,
                        material: Cesium.Color.RED.withAlpha(0.5),
                        outline: true,
                        outlineColor: Cesium.Color.BLACK
                    }
                });
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                
    }

    applyClipping() {
        var clippingPlanes = new Cesium.ClippingPlaneCollection({
            planes: positions.map(position => new Cesium.ClippingPlane(position, 0.0)),
            edgeWidth: 1.0,
            enabled: true
        });
    
        viewer.scene.globe.clippingPlanes = clippingPlanes;
    }
}