export class SplitTool {
    constructor() {

    }


    addSplit() {

        var existingSplitterLine = document.getElementById('splitterLine');
        if (existingSplitterLine) {
            existingSplitterLine.remove();
        }
        showLoading();
        setTimeout(function () {
            hideLoading(); 
        }, 5000);
        var splitterLine = document.createElement('div');
        splitterLine.id = 'splitterLine';
        splitterLine.style = 'position: absolute; left: 50%; top: 0; width: 5px; height: 100%; background-color: black; cursor: ew-resize; z-index: 1;';
        document.body.appendChild(splitterLine);
        openStreetMap = new Cesium.OpenStreetMapImageryProvider({
            url: 'https://a.tile.openstreetmap.org/'
        });

        var rightLayer = viewer.imageryLayers.addImageryProvider(openStreetMap);
        rightLayer.splitDirection = Cesium.SplitDirection.RIGHT;
        viewer.scene.splitPosition = 0.5;
        let isDragging = false;
        splitterLine.addEventListener('mousedown', function (e) {
            isDragging = true;
            document.body.style.cursor = 'ew-resize';  
        });
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;  
            var splitPosition = e.clientX / window.innerWidth;
            viewer.scene.splitPosition = splitPosition;
            splitterLine.style.left = (splitPosition * 100) + '%';
            viewer.scene.requestRender();

        });
        document.addEventListener('mouseup', function () {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';  
            }
        });
    }

    resetSplit() {
        showLoading();
        setTimeout(function () {
            hideLoading(); 
        }, 500);
        var splitterLine = document.getElementById('splitterLine');
        if (splitterLine) {
            splitterLine.parentNode.removeChild(splitterLine);
        }
        viewer.dataSources.removeAll();
        viewer.entities.removeAll();
        while (viewer.imageryLayers.length > 1) {
            viewer.imageryLayers.remove(viewer.imageryLayers.get(viewer.imageryLayers.length - 1));
        }
        while (viewer.scene.primitives.length > 0) {
            viewer.scene.primitives.remove(viewer.scene.primitives.get(viewer.scene.primitives.length - 1));
        }
        viewer.trackedEntity = undefined;
    }
}


/**********Algorithm for the SplitTool **************************************
1-Class Initialization
Constructor: Initializes an instance of the SplitTool class.
Method: addSplit()

2-Check for Existing Splitter Line:
If an element with ID splitterLine exists, remove it to avoid duplicates.

3-Show Loading Indicator:
Display a loading spinner for a brief period to indicate a process is occurring.

4-Create Splitter Line:
Create a div element representing the splitter line.
Set its properties (position, size, color, cursor style).
Append the splitter line to the document body.

5-Add Imagery Layer:
Create an instance of OpenStreetMapImageryProvider.
Add this layer to the viewer.imageryLayers.
Set the split direction and initial split position.

6-Handle Dragging:
Set a flag (isDragging) to track if the user is dragging the splitter.
Mouse Down Event:
When the mouse is pressed down on the splitter line, set isDragging to true.
Change the cursor style to indicate dragging mode.
Mouse Move Event:
If isDragging is true, calculate the new split position based on the mouse's X-coordinate.
Update the splitPosition of the viewer's scene and the position of the splitter line.
Request a render of the scene to reflect changes.
Mouse Up Event:
When the mouse button is released, reset the isDragging flag.
Reset the cursor style.
Method: resetSplit()

7-Show Loading Indicator:
Display a loading spinner briefly before resetting.

8-Remove Splitter Line:
Find the splitter line by ID and remove it from the DOM if it exists.

9-Clear Viewer Data:
Remove all data sources and entities from the viewer.

10-Reset Imagery Layers:
While there is more than one imagery layer, remove the topmost layer until only one remains.

11-Reset Scene Primitives:
While there are primitives in the scene, remove them one by one until none remain.

12-Clear Tracked Entity:
Set viewer.trackedEntity to undefined to stop tracking any specific entity.
 * 
 */

