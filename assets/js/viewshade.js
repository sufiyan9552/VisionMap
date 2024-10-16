export class ViewShed {
    constructor(viewer) {
        this.viewer = viewer; // Store the Cesium viewer instance
        this.observerPosition = null; // To store the observer position
        this.fieldOfViewPolygon = null; // To store the field of view polygon
        // this.initEventHandler(); // Initialize event handler
    }

    addViewshedAnalysis() {
        if (!this.fieldOfViewPolygon) {
            this.fieldOfViewPolygon = this.viewer.entities.add({
                id: 'fieldOfViewPolygon',
                polygon: {
                    hierarchy: new Cesium.PolygonHierarchy([]),
                    material: Cesium.Color.GREEN.withAlpha(0.5),
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW
                }
            });

            this.viewer.entities.add({
                id: 'observerMarker',
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.YELLOW,
                },
                description: "Observer position for viewshed analysis"
            });
        }
    }

    initEventHandler() {
        const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

        handler.setInputAction((click) => {
            const cartesian = this.viewer.scene.pickPosition(click.position);

            if (cartesian) {
                this.observerPosition = cartesian;

                this.viewer.entities.removeById('observerMarker');
                this.viewer.entities.add({
                    id: 'observerMarker',
                    position: this.observerPosition,
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.YELLOW,
                    },
                    description: "Observer position for viewshed analysis"
                });

                if (this.fieldOfViewPolygon) {
                    const positions = [
                        Cesium.Cartesian3.fromDegrees(-105.0, 40.0),
                        Cesium.Cartesian3.fromDegrees(-104.0, 40.0),
                        Cesium.Cartesian3.fromDegrees(-104.0, 41.0),
                        Cesium.Cartesian3.fromDegrees(-105.0, 41.0),
                        this.observerPosition
                    ];

                    this.fieldOfViewPolygon.polygon.hierarchy = new Cesium.PolygonHierarchy(positions);
                }

                this.viewer.scene.requestRender();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
}
