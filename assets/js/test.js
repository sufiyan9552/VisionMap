export class Test {
    constructor(viewer) {
        this.viewer = viewer;
        this.scene = viewer.scene;

        // Rain particle system parameters
        this.rainParticleSize = 15.0;
        this.rainRadius = 100000.0;
        this.rainImageSize = new Cesium.Cartesian2(
            this.rainParticleSize,
            this.rainParticleSize * 2.0
        );
        this.rainGravityScratch = new Cesium.Cartesian3();
    }

    // Rain update callback function
    rainUpdate(particle, dt) {
        this.rainGravityScratch = Cesium.Cartesian3.normalize(
            particle.position,
            this.rainGravityScratch
        );
        this.rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(
            this.rainGravityScratch,
            -1050.0,
            this.rainGravityScratch
        );

        particle.position = Cesium.Cartesian3.add(
            particle.position,
            this.rainGravityScratch,
            particle.position
        );

        const distance = Cesium.Cartesian3.distance(
            this.scene.camera.position,
            particle.position
        );
        if (distance > this.rainRadius) {
            particle.endColor.alpha = 0.0;
        } else {
            particle.endColor.alpha =
                Cesium.Color.BLUE.alpha / (distance / this.rainRadius + 0.1);
        }
    }

    // Function to start the rain particle system
    startRain() {
        this.scene.primitives.removeAll();
        this.scene.primitives.add(
            new Cesium.ParticleSystem({
                modelMatrix: new Cesium.Matrix4.fromTranslation(
                    this.scene.camera.position
                ),
                speed: -1.0,
                lifetime: 15.0,
                emitter: new Cesium.SphereEmitter(this.rainRadius),
                startScale: 1.0,
                endScale: 0.0,
                image: "icon/debris.png",
                emissionRate: 9000.0,
                startColor: new Cesium.Color(0.27, 0.5, 0.7, 0.0),
                endColor: new Cesium.Color(0.27, 0.5, 0.7, 0.98),
                imageSize: this.rainImageSize,
                updateCallback: (particle, dt) => this.rainUpdate(particle, dt), // Use arrow function to bind 'this'
            })
        );

        // Adjust sky atmosphere and fog settings
        this.scene.skyAtmosphere.hueShift = -0.97;
        this.scene.skyAtmosphere.saturationShift = 0.25;
        this.scene.skyAtmosphere.brightnessShift = -0.4;
        this.scene.fog.density = 0.00025;
        this.scene.fog.minimumBrightness = 0.01;
    }
}
