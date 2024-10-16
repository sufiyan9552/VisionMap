export class FlightSimulation {
    constructor() {
        this.modelEntity = null;
        this.cartesian = null;
        this.speed = 10; 
        this.maxSpeed = 100; 
        this.minSpeed = 1; 
        this.deltaRadians = Cesium.Math.toRadians(3.0); 
        this.hpRoll = new Cesium.HeadingPitchRoll(); 
        this.speedVector = new Cesium.Cartesian3(); 
        this.fixedFrameTransform = Cesium.Transforms.localFrameToFixedFrameGenerator('north', 'west');
        this.isMovingForward = false;
        this.isMovingBackward = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.animationFrame = null;
        this.heightAdjustment = 0; 
        this.cameraHeading = 0; 
        this.cameraPitch = Cesium.Math.toRadians(-90); 
        this.cameraRange = 500; 
    }

    addDrone() {
        viewer.canvas.style.cursor = 'crosshair';
        const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

        handler.setInputAction((click) => {
            this.cartesian = viewer.scene.pickPosition(click.position);
            if (this.cartesian) {
                const cartographic = Cesium.Cartographic.fromCartesian(this.cartesian);
                const longitude = cartographic.longitude;
                const latitude = cartographic.latitude;
                const height = cartographic.height;

                this.cartesian = Cesium.Cartesian3.fromRadians(longitude, latitude, height);

                this.modelEntity = viewer.entities.add({
                    position: this.cartesian,
                    orientation: Cesium.Transforms.headingPitchRollQuaternion(
                        this.cartesian,
                        this.hpRoll
                    ),
                    model: {
                        uri: "icon/drone.glb",
                        scale: 1
                    }
                });

                viewer.flyTo(this.modelEntity, {
                    offset: new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90), 500) 
                });

                viewer.canvas.style.cursor = 'default';
                handler.destroy();

                this.setupKeyboardControls();
                this.startAnimationLoop(); 
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case "ArrowUp":
                    this.isMovingForward = true;
                    break;
                case "ArrowDown":
                    this.isMovingBackward = true;
                    break;
                case "ArrowLeft":
                    this.isTurningLeft = true;
                    break;
                case "ArrowRight":
                    this.isTurningRight = true;
                    break;
                case "ShiftLeft": // Speed up
                    this.speed = Math.min(this.speed + 1, this.maxSpeed);
                    break;
                case "ShiftRight": // Slow down
                    this.speed = Math.max(this.speed - 1, this.minSpeed);
                    break;
                case "KeyW": // Tilt up
                    this.cameraPitch = Math.min(this.cameraPitch + this.deltaRadians, Cesium.Math.toRadians(0)); 
                    break;
                case "KeyS": // Tilt down
                    this.cameraPitch = Math.max(this.cameraPitch - this.deltaRadians, Cesium.Math.toRadians(-90)); 
                    break;
                case "KeyA": // Rotate left
                    this.cameraHeading -= this.deltaRadians;
                    break;
                case "KeyD": // Rotate right
                    this.cameraHeading += this.deltaRadians;
                    break;
                case "KeyQ": // Zoom in
                    this.cameraRange = Math.max(this.cameraRange - 10, 50); 
                    break;
                case "KeyE": // Zoom out
                    this.cameraRange = Math.min(this.cameraRange + 10, 1000); 
                    break;
                default:
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case "ArrowUp":
                    this.isMovingForward = false;
                    break;
                case "ArrowDown":
                    this.isMovingBackward = false;
                    break;
                case "ArrowLeft":
                    this.isTurningLeft = false;
                    break;
                case "ArrowRight":
                    this.isTurningRight = false;
                    break;
                default:
                    break;
            }
        });
    }

    startAnimationLoop() {
        const updatePosition = () => {
            if (this.isMovingForward) this.moveDroneForward();
            if (this.isMovingBackward) this.moveDroneBackward();
            if (this.isTurningLeft) this.turnDroneLeft();
            if (this.isTurningRight) this.turnDroneRight();
            if (this.heightAdjustment !== 0) this.adjustDroneHeight(this.heightAdjustment);

            this.updateDroneOrientation();
            this.followDrone();

            this.animationFrame = requestAnimationFrame(updatePosition);
        };

        updatePosition();
    }

    moveDroneForward() {
        this.speedVector = Cesium.Cartesian3.multiplyByScalar(
            Cesium.Cartesian3.UNIT_X,
            this.speed / 10,
            this.speedVector
        );
        this.updateDronePosition();
    }

    moveDroneBackward() {
        this.speedVector = Cesium.Cartesian3.multiplyByScalar(
            Cesium.Cartesian3.UNIT_X,
            -this.speed / 10,
            this.speedVector
        );
        this.updateDronePosition();
    }

    turnDroneLeft() {
        this.hpRoll.heading -= this.deltaRadians;
        if (this.hpRoll.heading < 0.0) this.hpRoll.heading += Cesium.Math.TWO_PI;
    }

    turnDroneRight() {
        this.hpRoll.heading += this.deltaRadians;
        if (this.hpRoll.heading > Cesium.Math.TWO_PI) this.hpRoll.heading -= Cesium.Math.TWO_PI;
    }

    adjustDroneHeight(heightIncrement) {
        const currentPosition = this.modelEntity.position.getValue(Cesium.JulianDate.now());
        const cartographic = Cesium.Cartographic.fromCartesian(currentPosition);
        cartographic.height += heightIncrement; // Adjust height

        const newPosition = Cesium.Cartesian3.fromRadians(
            cartographic.longitude,
            cartographic.latitude,
            cartographic.height
        );
        this.modelEntity.position = newPosition;
    }

    updateDronePosition() {
        const currentPosition = this.modelEntity.position.getValue(Cesium.JulianDate.now());
        const newPosition = Cesium.Matrix4.multiplyByPoint(
            Cesium.Transforms.headingPitchRollToFixedFrame(currentPosition, this.hpRoll, Cesium.Ellipsoid.WGS84, this.fixedFrameTransform),
            this.speedVector,
            new Cesium.Cartesian3()
        );
        this.modelEntity.position = newPosition;
    }

    updateDroneOrientation() {
        if (this.modelEntity) {
            this.modelEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                this.modelEntity.position.getValue(Cesium.JulianDate.now()),
                this.hpRoll
            );
        }
    }

    followDrone() {
        if (this.modelEntity) {
            const currentPosition = this.modelEntity.position.getValue(Cesium.JulianDate.now());

            viewer.camera.lookAt(
                currentPosition, 
                new Cesium.HeadingPitchRange(this.cameraHeading, this.cameraPitch, this.cameraRange)
            );
        }
    }

    stopAnimationLoop() {
        cancelAnimationFrame(this.animationFrame);
    }

      resetSimulation() {
        showLoading();
        setTimeout(function () {
            hideLoading(); 
        }, 3000);
        if (this.modelEntity) {
            viewer.entities.remove(this.modelEntity);
            this.modelEntity = null;
        }

        viewer.scene.screenSpaceCameraController.enableTilt = true;

        this.stopAnimationLoop();

        this.isMovingForward = false;
        this.isMovingBackward = false;
        this.isTurningLeft = false;
        this.isTurningRight = false;
        this.speed = 10;
        this.cameraHeading = 0;
        this.cameraPitch = Cesium.Math.toRadians(-90); // Top-down view
        this.cameraRange = 500;

    }
}


/******** Algorithm for FlightSimulation******************
 
1-Class Initialization
Function: constructor()
Inputs: None
Actions:
Initialize properties for model entity, position, speed, camera settings, and movement flags.

2-Add Drone
Function: addDrone()
Inputs: None
Actions:
Change cursor style to crosshair.
Create a ScreenSpaceEventHandler to handle mouse clicks.
Handle Left Click Event:
Get Cartesian position from mouse click.
Convert to Cartographic coordinates (longitude, latitude, height).
Create a model entity at the clicked position with specified model URI.
Fly the camera to the drone's location.
Reset cursor style to default and destroy the handler.
Set up keyboard controls.
Start the animation loop.

3-Setup Keyboard Controls
Function: setupKeyboardControls()
Inputs: None
Actions:
Add event listeners for keydown and keyup events.
Update movement flags (isMovingForward, isMovingBackward, etc.) based on key presses.
Adjust speed, camera tilt, rotation, and zoom based on specific keys.

3-Start Animation Loop
Function: startAnimationLoop()
Inputs: None
Actions:
Define updatePosition() to update drone position and orientation based on movement flags.
Call requestAnimationFrame to create a loop for continuous updates.

4-Move Drone Forward
Function: moveDroneForward()
Inputs: None
Actions:
Calculate speed vector in the forward direction.
Update drone position using updateDronePosition().

5-Move Drone Backward
Function: moveDroneBackward()
Inputs: None
Actions:
Calculate speed vector in the backward direction.
Update drone position using updateDronePosition().

6-Turn Drone Left
Function: turnDroneLeft()
Inputs: None
Actions:
Decrease heading by deltaRadians.
Ensure heading wraps around to stay within [0, 2π].

7-Turn Drone Right
Function: turnDroneRight()
Inputs: None
Actions:
Increase heading by deltaRadians.
Ensure heading wraps around to stay within [0, 2π].

8-Adjust Drone Height
Function: adjustDroneHeight(heightIncrement)
Inputs: heightIncrement (number)
Actions:
Get current position of the drone.
Update height of the position based on the height increment.
Set the new position of the model entity.

9-Update Drone Position
Function: updateDronePosition()
Inputs: None
Actions:
Get the current position of the drone.
Calculate the new position using heading, pitch, and speed.
Update the position of the model entity.

10-Update Drone Orientation
Function: updateDroneOrientation()
Inputs: None
Actions:
Set the orientation of the drone model based on the current position and hpRoll.

11-Follow Drone
Function: followDrone()
Inputs: None
Actions:
Get the current position of the drone.
Adjust the camera to follow the drone with the specified heading, pitch, and range.

12-Stop Animation Loop
Function: stopAnimationLoop()
Inputs: None
Actions:
Cancel the ongoing animation frame request.

13-Reset Simulation
Function: resetSimulation()
Inputs: None
Actions:
Show loading indicator.
Remove the drone model from the viewer if it exists.
Enable tilt for the camera controller.
Stop the animation loop and reset movement flags, speed, and camera settings.
 * 
 *  */
