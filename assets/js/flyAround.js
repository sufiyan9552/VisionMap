export class FlyAround {

    constructor(viewer) {
        this.heading = 0;
        this.rotationDirection = 1;
        this.isRotating = false;
        this.intervalId = null;
    }

    rotateView() {
        if (this.isRotating) {
            this.rotationDirection *= -1;
            return;
        }

        this.isRotating = true;
        this.intervalId = setInterval(() => {
            this.heading += this.rotationDirection;
            if (this.heading >= 360) this.heading -= 360;
            if (this.heading < 0) this.heading += 360;
            viewer.camera.setView({
                orientation: {
                    heading: Cesium.Math.toRadians(this.heading),
                    pitch: viewer.camera.pitch,
                    roll: viewer.camera.roll,
                },
            });
        }, 100);

        this.updateRotationClass();
    }

    stopRotation(event) {
        event.stopImmediatePropagation(); 
        $('#flyaroundTool').removeClass('active');
        clearInterval(this.intervalId);
        this.isRotating = false;
    }
    
    updateRotationClass() {
        const flyaroundToolElement = document.getElementById('flyaroundTool');
        if (this.rotationDirection == 1) {
            flyaroundToolElement.classList.remove('anticlockwise');
            flyaroundToolElement.classList.add('clockwise');
        } else {
            console.log("rotationDirection anto", this.rotationDirection);
            flyaroundToolElement.classList.remove('clockwise');
            flyaroundToolElement.classList.add('anticlockwise');
        }
    }

}


/****Algorithm for FlyAround
1-Class Initialization:
Create an instance of the FlyAround class, taking a viewer parameter.
Initialize properties:
heading: Set to 0 (represents the camera's heading direction).
rotationDirection: Set to 1 (indicates clockwise rotation).
isRotating: Set to false (tracks whether rotation is active).
intervalId: Set to null (to hold the interval reference for rotation).

2-Start or Change Rotation:
Define the rotateView method:
Check Rotation State:
If isRotating is true, reverse the rotationDirection (multiply by -1) and return.
Start Rotation:
Set isRotating to true.
Set an interval to update the camera heading every 100 milliseconds:
Increment heading by rotationDirection.
Normalize heading:
If heading is greater than or equal to 360, subtract 360.
If heading is less than 0, add 360.
Update the camera's view using viewer.camera.setView():
Set the orientation with the current heading, and retain the current pitch and roll.
Update Rotation Class:
Call updateRotationClass() to update the visual state of the flyaround tool.

3-Stop Rotation:
Define the stopRotation method:
Prevent Event Propagation:
Call event.stopImmediatePropagation() to prevent further event handling.
Update Tool State:
Remove the active class from the flyaround tool.
Clear Interval:
Clear the rotation interval using clearInterval(this.intervalId).
Reset Rotation State:
Set isRotating to false.

4-Update Rotation Class:
Define the updateRotationClass method:
Get Tool Element:
Retrieve the flyaround tool element by its ID (flyaroundTool).
Update Classes Based on Direction:
If rotationDirection is 1 (clockwise):
Remove the anticlockwise class.
Add the clockwise class.
If rotationDirection is not 1 (anticlockwise):
Log the rotationDirection for debugging.
Remove the clockwise class.
Add the anticlockwise class.
 * 
 */