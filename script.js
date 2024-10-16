

document.body.style.overflowY = 'hidden';
let modelEntity;


// { id: 'zoominIcon', src: 'icon/zoomIn.svg', alt: 'Zoom In', title: 'Zoom In' },
// { id: 'zoominOut', src: 'icon/zoomOut.svg', alt: 'Zoom Out', title: 'Zoom Out' },

// { id: 'dragIcon', src: 'icon/drag.svg', alt: 'Drag Tool', title: 'Drag Tool' },

// { id: 'captureScreen', src: 'icon/camera.svg', alt: 'Capture Screen', title: 'Capture Screen' },
//***************************MAP TOOLS(1)******************************************** */

const menuItems = [
    { id: 'clearAll', src: 'icon/clearall.svg', alt: 'ClearAll Tool', title: 'ClearAll Tool' },
    { id: 'identifyTool', src: 'icon/identify.svg', alt: 'Identify Tool', title: 'Identify Tool' },
    { id: 'flyaroundTool', src: 'icon/Clockwise.svg', alt: 'Fly Around', title: 'Fly Around' },
    { id: 'homeTool', src: 'icon/home.svg', alt: 'Home', title: 'Home' },
    { id: 'layersTool', src: 'icon/toc-layer.svg', alt: 'Table of Contents', title: 'Layers' }
];

const horizontalTools = document.getElementById('horizontalTools');

menuItems.forEach(item => {
    const hmenuItem = document.createElement('div');
    hmenuItem.className = 'hmenu-item';
    const iconWrap = document.createElement('div');
    iconWrap.className = 'icon-wrap';
    iconWrap.setAttribute('data-toggle', 'tooltip');
    iconWrap.setAttribute('data-placement', 'top');
    iconWrap.setAttribute('title', item.title);

    const img = document.createElement('img');
    img.id = item.id;
    img.src = item.src;
    img.alt = item.alt;
    iconWrap.appendChild(img);
    hmenuItem.appendChild(iconWrap);
    horizontalTools.appendChild(hmenuItem);
});

// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });

//***************************MAP TOOLS(2)******************************************** */

document.getElementById('verticalTool').innerHTML = `
    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Measurement Tool">
        <div class="menu-item">
            <img id="measurement" src="icon/Measurementdeactive.svg" alt="Measurement Tool">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Split View">
        <div class="menu-item">
            <img id="add_split" src="icon/split.svg" alt="Split View">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Shadow Analysis">
        <div class="menu-item">
            <img id="shadowAnalysis" src="icon/shadow.svg" alt="Shadow Analysis">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="GPS Location">
        <div class="menu-item">
            <img id="gpsTrack" src="icon/gps.svg" alt="GPS Location">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Flood Analysis">
        <div class="menu-item">
            <img id="floodAnalysis" src="icon/flood.svg" alt="Flood Analysis">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Elevation Profile">
        <div class="menu-item">
            <img id="elevaionProfile" src="icon/elevation.svg" alt="Elevation Profile">
        </div>
    </div>

    <div class="icon-wrap hidden" data-toggle="tooltip" data-placement="right" title="Weather Data">
        <div class="menu-item">
            <img src="icon/weather.svg" alt="Weather Data">
        </div>
    </div>

    <div class="icon-wrap hidden" data-toggle="tooltip" data-placement="right" title="Clipping Tool">
        <div class="menu-item">
            <img id="clippingTool" src="icon/clipping.svg" alt="Clipping Tool">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Draw">
        <div class="menu-item">
            <img id="redlinedraw" src="icon/draw.svg" alt="Additional Tool">
        </div>
    </div>

    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Line Of Sight">
        <div class="menu-item">
            <img id="los" src="icon/los.svg" alt="Line Of Sight">
        </div>
    </div>

      <div class="icon-wrap hidden" data-toggle="tooltip" data-placement="right" title="View Shade">
        <div class="menu-item">
            <img id="add_viewshed" src="icon/view-shade.svg" alt="view shade">
        </div>
    </div>
      <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Flight Simulation">
        <div class="menu-item">
            <img id="add_flight" src="icon/drone.svg" alt="Flight Simulation">
        </div>
    </div>
    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="3D  Assets">
        <div class="menu-item">
            <img id="add_3dAsset" src="icon/3Dassets.svg" alt="Add 3D Asset">
        </div>
    </div>
    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Routing Navigation">
        <div class="menu-item">
            <img id="routing_navigation" src="icon/routing.svg" alt="Routing Navigation">
        </div>
    </div>
    <div class="icon-wrap" data-toggle="tooltip" data-placement="right" title="Smart Object Indetification">
        <div class="menu-item">
            <img id="buffer" src="icon/buffer.svg" alt="Smart Object Indetification">
        </div>
    </div>
`;

// // Initialize Bootstrap tooltips if needed
// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });

function toggleHorizontalMenu() {
    const menu = document.getElementById('verticalTool');
    const icon = document.getElementById('horizontal-icon');

    if (!menu || !icon) {
        console.error("Element not found: Check if 'vertical-menu' and 'horizontal-icon' IDs are correct.");
        return;
    }

    const isVisible = menu.style.display === 'block';
    menu.style.display = isVisible ? 'none' : 'block';
    menu.style.opacity = isVisible ? '0' : '1';
    menu.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
    icon.style.backgroundImage = isVisible ? "url('icon/plus.svg')" : "url('icon/close.svg')";
}

function toggleVerticalMenu() {
    const menu = document.getElementById('vertical-menu');
    const isVisible = menu.style.display === 'block';

    menu.style.display = isVisible ? 'none' : 'block';
    menu.style.opacity = isVisible ? '0' : '1';
    menu.style.transform = isVisible ? 'translateY(-10px)' : 'translateY(0)';
}


document.getElementById("layersTool").addEventListener('click', () => {
    $('.toolbox').css('display', 'block');
});

document.querySelectorAll('.fas.fa-times').forEach(button => {
    button.addEventListener('click', function () {
        $('.toolbox').css('display', 'none');
    });
});


//***********************************Tools Kit*************************************************************** */

function loadDynamicTool(toolTitle, textBox, Buttons, labels, checkBox, saveButton, dropDown, slider, sliderandplaybutton) {

    const loadToolsDiv = document.getElementById("loadTools");
    const newLoadToolsDiv = loadToolsDiv.cloneNode(false);
    loadToolsDiv.parentNode.replaceChild(newLoadToolsDiv, loadToolsDiv);
    if (loadToolsDiv.innerHTML.trim()) {
        loadToolsDiv.style.display = 'block';
    } else {
        loadToolsDiv.style.display = 'none';
    }
    const measurementTool = document.createElement("div");
    measurementTool.className = "measurement-tool";

    const header = document.createElement("div");
    header.className = "header";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = toolTitle;

    const actions = document.createElement("div");
    actions.className = "actions";

    const minimizeIcon = document.createElement("i");
    minimizeIcon.className = "fas fa-minus";
    minimizeIcon.id = "toggleIcon";
    actions.appendChild(minimizeIcon);

    const closeIcon = document.createElement("i");
    closeIcon.className = "fas fa-times";
    closeIcon.style.cursor = "pointer";
    actions.appendChild(closeIcon);

    header.appendChild(title);
    header.appendChild(actions);
    measurementTool.appendChild(header);

    const buttons = document.createElement("div");
    buttons.className = "buttons";
    buttons.id = "mainTool"
    if (textBox) {
        textBoxData.forEach(data => {
            const textBoxContainer = document.createElement("div");
            textBoxContainer.className = "text-box-container";

            const textBoxLabel = document.createElement("label");
            textBoxLabel.htmlFor = data.id;
            textBoxLabel.textContent = data.label;

            const textBox = document.createElement("input");
            textBox.type = "text";
            textBox.id = data.id;
            textBox.placeholder = data.placeholder;
            textBox.className = "form-control";

            textBoxContainer.appendChild(textBoxLabel);
            textBoxContainer.appendChild(textBox);

            buttons.appendChild(textBoxContainer);
        });
    }

    // Create individual buttons 
    //dynamic 
    if (Buttons) {
        buttonData.forEach(data => {
            const button = document.createElement("div");
            button.className = "button";
            button.title = data.label;

            if (data.inactive) {
                button.classList.add("inactive");
            }

            const iconWrap = document.createElement("div");
            iconWrap.className = "icon-wrap";
            iconWrap.setAttribute("data-toggle", "tooltip");
            iconWrap.setAttribute("data-placement", "right");
            iconWrap.setAttribute("title", data.tooltip);

            const img = document.createElement("img");
            img.id = data.label.toLowerCase();
            img.src = data.src;
            img.alt = data.alt;

            iconWrap.appendChild(img);

            const label = document.createTextNode(data.label);

            button.appendChild(iconWrap);
            button.appendChild(label);

            buttons.appendChild(button);
        });
    }

    if (checkBox) {
        checkboxData.forEach(data => {
            const checkboxContainer = document.createElement("div");
            checkboxContainer.className = "checkbox-container";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = data.id;

            const checkboxLabel = document.createElement("label");
            checkboxLabel.htmlFor = data.id;
            checkboxLabel.textContent = data.label;
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(checkboxLabel);
            buttons.appendChild(checkboxContainer);
        });

    }

    if (labels) {
        labelData.forEach(data => {
            const labelContainer = document.createElement("div");
            labelContainer.className = "label-container";
            const label = document.createElement("label");
            label.className = data.className;
            label.textContent = data.text;

            labelContainer.appendChild(label);
            buttons.appendChild(labelContainer);
        });
    }

    if (dropDown) {
        dropdownData.forEach(data => {
            const dropdownContainer = document.createElement("div");
            dropdownContainer.className = "form-group";

            const dropdownLabel = document.createElement("label");
            dropdownLabel.setAttribute("for", data.id);
            dropdownLabel.textContent = data.label;

            const dropdown = document.createElement("select");
            dropdown.id = data.id;
            dropdown.className = "form-control";
            data.options.forEach(option => {
                const optionElement = document.createElement("option");
                optionElement.value = option.toLowerCase().replace(/ /g, "_");
                optionElement.textContent = option;
                dropdown.appendChild(optionElement);
            });

            dropdownContainer.appendChild(dropdownLabel);
            dropdownContainer.appendChild(dropdown);

            buttons.appendChild(dropdownContainer);
        });

    }

    if (saveButton) {
        saveButtonData.forEach(data => {
            const button = document.createElement("div");
            button.className = data.className;
            button.id = data.id;

            const buttonLabel = document.createTextNode(data.text);
            button.appendChild(buttonLabel);
            buttons.appendChild(button);
        });
    }



    if (slider) {
        sliderData.forEach(data => {
            const sliderContainer = document.createElement("div");
            sliderContainer.className = "form-group";
            const sliderLabel = document.createElement("label");
            sliderLabel.setAttribute("for", data.id);
            sliderLabel.textContent = data.label;

            const valueDisplay = document.createElement("span");
            valueDisplay.id = `${data.id}`;
            valueDisplay.textContent = `   ${data.value}`;

            const slider = document.createElement("input");
            slider.type = "range";
            slider.id = data.id;
            slider.className = "form-control-range";
            slider.min = data.min;
            slider.max = data.max;
            slider.value = data.value;
            slider.style = "cursor: pointer;"

            slider.addEventListener("input", function () {
                valueDisplay.textContent = `   ${this.value}`;
            });

            sliderContainer.appendChild(sliderLabel);
            sliderContainer.appendChild(valueDisplay);
            sliderContainer.appendChild(slider);

            buttons.appendChild(sliderContainer);
        });
    }

    if (sliderandplaybutton) {
        const sliderContainer = document.createElement("div");
        sliderContainer.className = "slider-play-container";

        const sliderLabel = document.createElement("label");
        sliderLabel.className = "slider-label";
        sliderLabel.setAttribute("for", sliderDataAndPlayButton.id);
        sliderLabel.textContent = sliderDataAndPlayButton.label;

        timeslider = document.createElement("input");
        timeslider.type = "range";
        timeslider.id = sliderDataAndPlayButton.id;
        timeslider.className = "slider";
        timeslider.min = sliderDataAndPlayButton.min;
        timeslider.max = sliderDataAndPlayButton.max;
        timeslider.value = sliderDataAndPlayButton.value || sliderDataAndPlayButton.min;
        timeslider.step = sliderDataAndPlayButton.step;
        timeslider.style = "cursor: pointer";

        playButton = document.createElement("button");
        playButton.className = "play-button";
        playButton.innerHTML = "&#9658;"; // Play icon
        playButton.id = "playTime"

        datePicker = document.createElement("input");
        datePicker.type = "date";
        datePicker.className = "date-picker";
        datePicker.id = "date-picker";

        const today = new Date().toISOString().split('T')[0];
        datePicker.value = today;

        sliderContainer.appendChild(sliderLabel);
        sliderContainer.appendChild(timeslider);
        sliderContainer.appendChild(playButton);
        sliderContainer.appendChild(datePicker);

        // Append the sliderContainer to the main container (assumed to be `buttons`)
        buttons.appendChild(sliderContainer);

        timeslider.addEventListener('input', function () {
            const value = timeslider.value;  // Slider value representing the hour (1 to 24)

            const hours = value == 0 ? 12 : value <= 12 ? value : value - 12;
            const isPM = value > 12;  // Check if PM

            let time = hours < 10 ? '0' + hours : hours;
            time += ":00:00" + (isPM ? " PM" : " AM");
            sliderLabel.textContent = time;
            const selectedDate = datePicker.value;
            let hoursIn24Format = value < 12 ? (isPM ? value + 12 : value) : value;
            if (hoursIn24Format === 24) hoursIn24Format = 0;

            const combinedDateTime = selectedDate + "T" + (hoursIn24Format < 10 ? '0' : '') + hoursIn24Format + ":00:00Z";
            shadowAnalysis.onDateChange(selectedDate, value);

            showMessage("Combined Date-Time:", combinedDateTime);
        });
        datePicker.addEventListener('change', function () {
            const selectedDate = datePicker.value;
            showMessage('Selected Date:', selectedDate);
        });
    }

    if (toolTitle === "Flood Analysis Tool") {
        const canvas = document.createElement('canvas');
        canvas.id = 'floodChart';
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.display = 'none';
        buttons.appendChild(canvas);
    }
    if (toolTitle === "Elevation Profile") {
        const canvas = document.createElement('canvas');
        canvas.id = 'elevationChart';
        canvas.width = 300;
        canvas.height = 200;
        canvas.style.display = 'none';
        buttons.appendChild(canvas);

    }


    measurementTool.appendChild(header);
    measurementTool.appendChild(buttons);
    document.getElementById("loadTools").appendChild(measurementTool);

    // $('[data-toggle="tooltip"]').tooltip();

    closeIcon.addEventListener("click", function () {
        $('#loadTools').css('display', 'none');
        ClearAllActivity();
    });

    document.getElementById("toggleIcon").addEventListener("click", function () {
        const icon = this;
        if (icon.classList.contains("fa-minus")) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
            $('#mainTool').css('display', 'none');
        } else {
            $('#mainTool').css('display', 'block');
            icon.classList.remove("fa-plus");
            icon.classList.add("fa-minus");
        }
    });


}

//**************************************Tools Events********************************************************************* */

//**************************Measurement tool Start***************************************** */
$("#measurement").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    buttonData = [
        { src: "icon/area.svg", alt: "Distance Icon", label: "Distance", tooltip: "Distance" },
        { src: "icon/distance.svg", alt: "Area Icon", label: "Area", inactive: true, tooltip: "Area" }
    ];
    checkboxData = [
        { id: "exampleCheckbox", label: "Clamp To Ground", tooltip: "Clamp To Ground" }
    ];
    dropdownData = [
        {
            id: "exampleDropdown",
            label: "Select Option:",
            options: ["Option 1", "Option 2", "Option 3"]
        }
    ];
    sliderData = [
        {
            id: "exampleSlider",
            label: "Adjust Value:",
            min: 0,
            max: 100,
            value: 50
        }
    ];

    labelData = [
        { text: "", className: "label-class" }
    ];

    textBoxData = [
        { id: "textBox1", placeholder: "Enter text here...", label: "Text Box 1" },
        { id: "textBox2", placeholder: "Enter more text...", label: "Text Box 2" }
    ];
    saveButtonData = [
        { text: "Distance", className: "button clear-button", id: "distance" },
        { text: "Area", className: "button clear-button", id: "area" },
        { text: "Reset", className: "button clear-button", id: "resetMeasurement" }
    ];
    dropdownData = [
        {
            id: "distanceUnit",
            options: ["Meter", "Kilometer", "Feet"]
        }
    ];
    //arguments Example
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Measurement Tool", false, false, true, false, true, true, false, false);
    // setupEventHandlers();
});


$(document).on('change', '#distanceUnit', function () {
    const selectedValue = $(this).val();
    MeasureTools.ChangeUnit(selectedValue);
});

$(document).on('click', '#distance', function () {
    $(this).addClass('active');
    $('#distanceUnit').show();
    if (typeof MeasureTools !== 'undefined' && MeasureTools.drawLine) {
        MeasureTools.drawLine();
    }
});

$(document).on('click', '#area', function () {
    // $(this).addClass('active');
    $('#distanceUnit').hide();
    MeasureTools.measurePolygon();

});

$(document).on('click', '#resetMeasurement', function () {
    // $(this).addClass('active');
    MeasureTools.resetMeasurement(); // Ensure MeasureTools is defined and method exists

});
//**************************Measurement tool End***************************************** */

//****************************Identify Tool Start ********************************************/
$(document).on('click', '#identifyTool', function () {
    EmptyObjects();
    $('#identifyTool').addClass('active');
    identifyflg = true;

});
//****************************Identify Tool End********************************************/



//**************************Flood Analysis Start***************************************** */
$("#los").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "New Los", className: "button clear-button", id: "newLos" },
        { text: "Clear", className: "button clear-button", id: "clearLos" }
    ];
    labelData = [
        { text: "Tip: Start by left-clicking on the map for the center point, then add position points, and to finish, right-click!", className: "label-class" }
    ];

    loadDynamicTool("Line Of Sight", false, false, true, false, true, false, false, false);
});

$("#floodAnalysis").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');

    showMessage("Under Contruction...!");
    saveButtonData = [
        { text: "Start", className: "button clear-button", id: "StartFlood" },
        { text: "Reset", className: "button clear-button", id: "resetFlood" }
    ];
    labelData = [
        { text: "", className: "label-class" }
    ];
    sliderData = [
        {
            id: "floodSlider",
            label: "Height",
            min: 0,
            max: 100,
            value: 0
        }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Flood Analysis Tool", false, false, false, false, true, false, true, false);


});

$(document).on('change', '#floodSlider', function (event) {
    waterHeight = parseFloat(event.target.value);
    increaseFloodLevel(waterHeight);
    floodAnalysis.dynamicWaterHeight(waterHeight);

})


$(document).on('click', '#StartFlood', function () {
    $("#floodChart").css("display", "block");
    floodAnalysis.loadFlood();
    floodAnalysis.starFloodChart();

});
$(document).on('click', '#resetFlood', function () {
    floodAnalysis.destroy();

})
//**************************Flood Analysis End***************************************** */

//**************************Elevation Profile Start***************************************** */
$("#elevaionProfile").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Add Line", className: "button clear-button", id: "addProfile" },
        { text: "Reset", className: "button clear-button", id: "resetProfile" },
        { text: "", className: "button fa fa-download hidden", id: "downloadElevation" }

    ];
    labelData = [
        { text: "", className: "label-class" }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Elevation Profile", false, false, false, false, true, false, false, false);

});
$(document).on('click', '#addProfile', function () {
    elevation.addProfile();

});
$(document).on('click', '#resetProfile', function () {
    elevation.resetProfile();
});

$(document).on('click', '#downloadElevation', function () {
    elevation.downloadElevation();
});





//**************************Elevation Profile End***************************************** */


//**************************Split Tool Start******************************************** */

$("#add_split").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Split", className: "button clear-button", id: "addSplit" },
        { text: "Reset", className: "button clear-button", id: "resetSplit" }
    ];
    labelData = [
        { text: "0", className: "label-class" }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Split Tool", false, false, false, false, true, false, false, false);
});

$(document).on('click', '#addSplit', function () {

    splitTool.addSplit();

});

$(document).on('click', '#resetSplit', function () {
    splitTool.resetSplit();

});
//**************************Split Tool End******************************************** */

//****************Flight Simulation Start***************************************** */
$(document).on('click', '#add_flight', function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Add", className: "button clear-button", id: "addDrone" },
        { text: "Reset & Clear", className: "button clear-button", id: "resetSimulation" },
    ];
    labelData = [
        {
            text: `
                Controls Instruction:
                - Move Forward: Arrow Up
                - Move Backward: Arrow Down
                - Turn Left: Arrow Left
                - Turn Right: Arrow Right
                - Speed Up: Shift Left
                - Slow Down: Shift Right
                - Tilt Camera Up: W
                - Tilt Camera Down: S
                - Rotate Camera Left: A
                - Rotate Camera Right: D
                - Zoom In: Q
                - Zoom Out: E
            `,
            className: "label-class controls-instructions"
        }
    ];

    sliderData = [
        {
            id: "flightHeight",
            label: "Height",
            min: 0,
            max: 100,
            value: 0
        }
    ];

    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Flight Simulation Tool", false, false, true, false, true, false, true, false);
})

$(document).on('click', '#addDrone', function () {
    EmptyObjects();
    flightSimulation.addDrone();
})



$(document).on('change', '#flightHeight', function (event) {
    var flightHeight = parseFloat(event.target.value);
    flightSimulation.adjustDroneHeight(flightHeight);
});
$(document).on('click', '#resetSimulation', function () {
    flightSimulation.resetSimulation();
})


//************************** Flight Simulation End ***************************************** */

//************Shadow Analysis Start******************* ****************************************/
$("#shadowAnalysis").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    sliderDataAndPlayButton = {
        id: "time-slider",
        min: 0,
        max: 24,
        value: 0,
        step: 1,
        label: "12 AM",
    };

    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider ,shadowslider)
    checkboxData = [
        { id: "shadow-check", label: "Shadow Analysis", tooltip: "Shadow Analysis" }
    ];
    loadDynamicTool("Shadow Analysis Tool", false, false, false, true, false, false, false, true);


})
$(document).on('click', '#playTime', function () {
    togglePlayPause();
    const value = timeslider.value;
    const hours = value == 0 ? 12 : value <= 12 ? value : value - 12;
    const isPM = value > 12;
    let time = hours < 10 ? '0' + hours : hours;
    time += ":00:00" + (isPM ? " PM" : " AM");
    const selectedDate = datePicker.value;
    let hoursIn24Format = value < 12 ? (isPM ? value + 12 : value) : value;
    if (hoursIn24Format === 24) hoursIn24Format = 0;
    shadowAnalysis.playTimeWise(selectedDate, value)
})




//************Shadow Analysis Start******************* ****************************************/


// -------------------LOS Start------------------------
$(document).on('click', '#newLos', function () {
    // $('#mnulNew').addClass('active')
    losTool.destroy();
    setTimeout(() => {
        losTool.start();
    }, "500");

});


$(document).on('click', '#clearLos', function () {
    losTool.destroy();
    // $('#mnulNew').removeClass('active')
});




// -------------------LOS End------------------------

//**********************3D Assets Start******************************************* */
$("#add_3dAsset").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Add 3D Model", className: "button clear-button", id: "3dModel" },
        { text: "Create 3D Model", className: "button clear-button", id: "create3DModel" },
        { text: "Reset", className: "button clear-button", id: "resetAsset" }
    ];
    sliderData = [
        {
            id: "assetHeight",
            label: "Height",
            min: 0,
            max: 100,
            value: 0
        },
        {
            id: "assetRoll",
            label: "Roll",
            min: 0,
            max: 360,  // Adjusted to represent degrees
            value: 0
        },
        {
            id: "assetPitch",
            label: "Pitch",
            min: -90,
            max: 90,
            value: 0
        },
        {
            id: "assetHeading",
            label: "Heading",
            min: 0,
            max: 360,
            value: 0
        },
        {
            id: "assetScale",
            label: "Scale",
            min: 1.0,
            max: 10.0,
            value: 1.0
        }
    ];

    dropdownData = [
        {
            id: "assetsBuilding",
            options: ["Select Asset", "3D Building", "Light Poll", "3D Building", "tower"]
        }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("3D Assets Tool", false, false, false, false, true, true, true, false);
});

$(document).on('click', '#3dModel', function () {
    var selectedValue = document.getElementById("assetsBuilding").value;
    assetModel.add3DModel(selectedValue)

});

$(document).on('click', '#create3DModel', function () {
    sliderData = [];
    dropdownData = [];
    sliderData = [
        {
            id: "modelHeight",
            label: "Height",
            min: 10,
            max: 1000,
            value: 0
        }
    ];

    dropdownData = [
        {
            id: "modelBuilding",
            options: ["Select Color", "RED", "GREEN", "BLUE", "WHITE", "BLACK", "YELLOW", "ORANGE", "CYAN", "BUILDING"]

        }
    ];

    loadDynamicTool("3D Assets Tool", false, false, false, false, true, true, true, false);
    assetModel.create3DModel();

});
$(document).on('change', '#modelHeight', function (event) {
    var height = parseFloat(event.target.value);
    assetModel.heightCallback(height);
});

$(document).on('change', '#modelBuilding', function () {
    var selectedValue = document.getElementById("modelBuilding").value;
    assetModel.updateMaterial(selectedValue);

});


$(document).on('click', '#resetAsset', function () {
    assetModel.resetAssets();

});

$(document).on('change', '#assetHeight', function (event) {
    Modelheight = parseFloat(event.target.value);
    assetModel.updateModelOrientation();
});

$(document).on('change', '#assetHeading', function (event) {
    Model_heading = parseFloat(event.target.value);
    assetModel.updateModelOrientation();
});

$(document).on('change', '#assetPitch', function (event) {
    Modelpitch = parseFloat(event.target.value);
    assetModel.updateModelOrientation();
});

$(document).on('change', '#assetRoll', function (event) {
    Modelroll = parseFloat(event.target.value);
    assetModel.updateModelOrientation();
});

$(document).on('change', '#assetScale', function (event) {
    newModelScale = parseFloat(event.target.value);
    assetModel.updateModelOrientation();
});

//***************************Draw Tool Start************ */
$("#redlinedraw").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    showMessage("Under Contruction...!");
    saveButtonData = [
        { text: "Add Label", className: "button clear-button", id: "addLabel" },
        { text: "Draw Point", className: "button clear-button", id: "drawPoint" },
        { text: "Draw PolyLine", className: "button clear-button", id: "drawPolyLine" },
        { text: "Draw Polygon", className: "button clear-button", id: "drawPolygon" },
        { text: "Reset", className: "button clear-button", id: "resetDrawing" },
    ];
    checkboxData = [
        { id: "drawClamp", label: "Clamp to Ground", tooltip: "clamptoground" }
    ];

    textBoxData = [
        { id: "locationLabel", placeholder: "Enter About Location", label: "Discribe Location" }
    ];

    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Drawing Tool", true, false, false, false, true, false, false, false);
});

$(document).on('click', '#drawPoint', function () {
    draw.drawPoint();
});
$(document).on('click', '#drawPolyLine', function () {
    draw.drawLine();
});
$(document).on('click', '#drawPolygon', function () {
    draw.drawPolygon();
});

$(document).on('click', '#addLabel', function () {
    var labelValue = document.getElementById('locationLabel').value;
    draw.updateLabel(labelValue);
});
$(document).on('click', '#resetDrawing', function () {
    draw.resetDrawing();
});



//***************************Draw Tool End************ */

$("#clippingTool").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    showMessage("Under Contruction...!");
    saveButtonData = [
        { text: "Add Polygon", className: "button clear-button", id: "addPolygon" },
        { text: "Reset", className: "button clear-button", id: "resetClipping" },
    ];


    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)

    loadDynamicTool("Clipping Tool", false, false, false, false, true, false, false, false);
});

$(document).on('click', '#addPolygon', function () {
    clipping.addPolygon();
    // $('#mnulNew').removeClass('active')
});
$(document).on('click', '#resetClipping', function () {
    clipping.applyClipping();
    // $('#mnulNew').removeClass('active')
});


$(document).on('change', '#shadow-check', function () {
    if (this.checked) {
        const value = timeslider.value;
        const hours = value == 0 ? 12 : value <= 12 ? value : value - 12;
        const isPM = value > 12;
        let time = hours < 10 ? '0' + hours : hours;
        time += ":00:00" + (isPM ? " PM" : " AM");
        const selectedDate = datePicker.value;
        let hoursIn24Format = value < 12 ? (isPM ? value + 12 : value) : value;
        if (hoursIn24Format === 24) hoursIn24Format = 0;

        shadowAnalysis.start(selectedDate, value);
    } else {

    }
});





$(document).on('click', '#compassImage', function () {
    document.getElementById('compassImage').style.transform = 'rotate(' + 0 + 'deg)';
    viewer.camera.setView({
        orientation: {
            heading: Cesium.Math.toRadians(0),  // 0 degrees (north)
            pitch: Cesium.Math.toRadians(-90),  // Looking straight down
            roll: 0                             // No roll
        }
    });
});


//**************************Clear Tool***************************************** */
$(document).on('click', '#clear', function () {
    $('#distance').removeClass('active');
    viewer.entities.removeAll();
    // $('.label-class').text("");
    LineFirstPosition = 0;
    LineSecondPosition = 0;
    floodAnalysis.clearAll();
});

// Change event for the checkbox
$(document).on('change', '#exampleCheckbox', function () {
    if (this.checked) {
        if (typeof MeasureTools !== 'undefined' && MeasureTools.showLabel) {
            MeasureTools.showLabel();
        }
    } else {
        if (typeof MeasureTools !== 'undefined' && MeasureTools.clearLabel) {
            MeasureTools.clearLabel();
        }
    }
});



//**************************Routing Navigation Tool Start***************************************** */
$("#routing_navigation").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Route", className: "button clear-button", id: "startroute" },
        { text: "Reset", className: "button clear-button", id: "resetroute" },
        { text: "Live Traffic", className: "button clear-button", id: "liveData" }
    ];
    textBoxData = [
        { id: "firstPosition", placeholder: "Enter Start Position", label: "Start Position" },
        { id: "secondPosition", placeholder: "Enter End Position", label: "End Position" }
    ];
    labelData = [
        {
            text: '',
            className: "label-class"
        }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)
    loadDynamicTool("Routing Navigation Tool", true, false, true, false, true, false, false, false);

    document.getElementById('liveData').classList.add('disabled');

});


$(document).on('click', '#liveData', function () {
    route.liveTrafficData();
})

$(document).on('click', '#firstPosition', function () {
    viewer.canvas.style.cursor = 'crosshair';
    startflg = true;
})

$(document).on('click', '#secondPosition', function () {
    viewer.canvas.style.cursor = 'crosshair';
    endflg = true;
})

$(document).on('click', '#startroute', function () {
    route.startRoute();

});


$(document).on('click', '#resetroute', function () {
    route.clearRoute();
})
//**************************Routing Navigation Tool END***   ************************************* */

//**************************GPS Tool***************************************** */
$("#gpsTrack").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "Draw", className: "button clear-button", id: "Draw" },
        { text: "Start", className: "button clear-button", id: "Start" },
        { text: "Stop", className: "button clear-button", id: "Stop" },
        { text: "Restart", className: "button clear-button", id: "restart" },
        { text: "Reset&Clear", className: "button clear-button", id: "resetGps" }
    ];
    labelData = [
        { text: "0", className: "label-class" }
    ];

    loadDynamicTool("GPS Tool", false, false, true, false, true, false, false, false);
});

$(document).on('click', '#Draw', function () {
    if (startFlg) {
        startDraw = true;
        viewer.canvas.style.cursor = 'crosshair';
        dynamicCompenet.PolyLine(function (addLabel) {
        }, false);

    }
    startFlg = true;

});
$(document).on('click', '#Start', function () {
    if (startFlg) {
        viewer.canvas.style.cursor = 'default';
        gps.startGps();
    }
    startFlg = true;

});

$(document).on('click', '#restart', function () {
    gps.restartGps();
});

$(document).on('click', '#Stop', function () {
    gps.stopGps();
});
$(document).on('click', '#resetGps', function () {
    gps.resetGps();
});
//**************************GPS Tool End***************************************** */
//**************************Smart Object Identification start***************************************** */
$("#buffer").click(function () {
    EmptyObjects();
    $('#loadTools').css('display', 'block');
    saveButtonData = [
        { text: "", className: "button fa fa-search", id: "searchObject" },
        { text: "", className: "button fa fa-location-arrow", id: "currentLocation" },
        { text: "", className: "button fa fa-microphone", id: "openMic" },
        { text: "Reset", className: "button clear-button", id: "resetBuffer" }
    ];
    textBoxData = [
        { id: "mapLocation", placeholder: "Click Here then Click at Map", label: "Select Location" }
    ];
    // loadDynamicTool(toolTitle,TextBox,Buttons, labels, checkBox, saveButton, dropDown, slider,shadowslider)
    loadDynamicTool("Smart Object Identification ", true, false, false, false, true, false, false, false);
});

$(document).on('click', '#currentLocation', function () {
    buffer.flyToCurrentLocation();
});
$(document).on('click', '#openMic', function () {
    OpenMic();
});
$(document).on('click', '#mapLocation', function () {
    buffer.getMapLocation();
});

$(document).on('click', '#resetBuffer', function () {
    buffer.resetBuffer();
});






//**************************Smart Object Identification End ***************************************** */


$(document).on('click', '#addLayers', function () {
    dynamicLayer.LoadLayers()

});

$(document).on('click', '#clearData', function () {
    dynamicLayer.ClearSelectedData()

});




$(document).on('click', '#addLayerModel', function () {
    document.getElementById("dropdownMenu").value = "";
    document.getElementById("inputLabel").value = "";
    $('.modal-box').show();
    $('.modal-backdrop').show();
});


let isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        playTime.innerHTML = '&#9658;';
        playTime.classList.remove('pause');
        // shadowAnalysis.stop();
    } else {
        playTime.innerHTML = '&#10074;&#10074;';
        playTime.classList.add('pause');

    }
    isPlaying = !isPlaying;
}



function increaseFloodLevel(meter) {
    if (!floodChart) {
        console.error("Chart has not been initialized.");
        return;
    }
    let newFloodLevel = floodData[floodData.length - 1] + Math.random() * meter;
    let newLabel = `Time ${floodData.length}`;
    floodData.push(newFloodLevel);
    labels.push(newLabel);

    floodChart.update();
}

function EmptyObjects() {
    bttonData = [];
    ceckboxData = [];
    dopdownData = [];
    siderData = [];
    txtBoxData = [];
    sveButtonData = [];
    liderDataAndPlayButton = [];
}
$(document).on('click', '#clearAll', function () {
    ClearAllActivity();
    // viewer.camera.flyHome(0);
});
function ClearAllActivity() {
    EmptyObjects();
    viewer.canvas.style.cursor = 'default';
    // viewer.dataSources.removeAll();
    viewer.entities.removeAll();
    flightSimulation.resetSimulation();
    splitTool.resetSplit();
    viewer.scene.requestRender();
}

function OpenMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showMessage('Speech Recognition API is not supported in this browser.');
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    let audioStream;
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            audioStream = stream;
            showMessage('Microphone is active.');
            recognition.start();
            showMessage('Listening for speech...');
            recognition.onresult = function (event) {
                const transcript = event.results[event.resultIndex][0].transcript;
                document.getElementById("errorInfo").style.display = "none";
                showMessage('Recognized words:', transcript);
                analyzeTranscript(transcript);
            };

            recognition.onerror = function (event) {
                console.error('Error during recognition:', event.error);
            };

            setTimeout(() => {
                showMessage('Stopping microphone after 10 seconds...');
                recognition.stop();
                audioStream.getTracks().forEach(track => track.stop());
                showMessage('Microphone is now off.');
            }, 10000);
        })
        .catch(function (error) {
            console.error('Error accessing microphone:', error);
        });

    function analyzeTranscript(transcript) {
        let doc = nlp(transcript);
        places = doc.places().out('text');
        console.log('Extracted Places:', places);

        const distanceRegex = /(?:around|within|in)\s*(\d+)\s*km/i;
        const placeRegex = /in\s+([a-zA-Z\s]+)/i;

        if (transcript.includes('near me') || transcript.includes('around me')) {
            distance = '5 km'; // Handle "near me" and "around me"
            buffer.flyToCurrentLocation();
        } else if (match = transcript.match(distanceRegex)) {
            distance = `${match[1]} km`; // Handle "around X km", "within X km", and "in X km"
            buffer.flyToCurrentLocation();
        } else if (match = transcript.match(placeRegex)) {
            places = match[1].trim(); // Capture place after "in"
            buffer.flyToCurrentLocation();
        }
        let placeTypes = ['school', 'hospital', 'police station', 'pharmacy', 'clinic', 'restaurant', 'mall', 'grocery store'];
        let matchedTypes = placeTypes.filter(type => transcript.toLowerCase().includes(type));

        finalPlace = places && !placeTypes.includes(places.toLowerCase()) ? places : matchedTypes.join(', ');

        if (finalPlace) {
            showMessage('Places:', finalPlace);
            console.log('Places:', finalPlace);
        }
        if (distance) {
            console.log('Distance:', distance);
        }
        if (matchedTypes.length > 0) {
            console.log('Matched Types:', matchedTypes.join(', '));
        } else {
            console.log('No specific types matched.');
        }

        if (places) {
            async function getLatLong(place) {
                const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.length > 0) {
                        const { lat, lon } = data[0];
                        showMessage(`${place}`);

                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(lon, lat, 500),
                            orientation: {
                                heading: Cesium.Math.toRadians(0.0),
                                pitch: Cesium.Math.toRadians(-45.0),
                                roll: 0.0
                            }
                        });
                    } else {
                        showMessage(`No results found for ${place}`);
                    }
                } catch (error) {
                    console.error('Error fetching geocode:', error);
                }
            }
            const placeArray = places.split(',');
            placeArray.forEach(place => {
                getLatLong(place.trim());
            });
        } else {
            showMessage("Sorry for Inconvenience.... ");
        }



    }
}


//info Box Code
$(document).on('click', '#infoClosed', function () {
    $('.info-box').hide();

});


//Switch 2D To 3D

$(document).on('click', '#switch3d', function () {
    // if (this.checked) {
    //     viewer.scene.mode = Cesium.SceneMode.SCENE3D;  // Switch to 3D
    // } else {
    //     viewer.scene.mode = Cesium.SceneMode.SCENE2D;  // Switch to 2D
    // }

    const slider = document.getElementById('switch3d');

    slider.addEventListener('click', function () {
        slider.classList.toggle('active');

        if (slider.classList.contains('active')) {
            console.log('Switched to 3D view!');
        } else {
            console.log('Switched to 2D view!');
        }
    });
});




$(document).on('click', '#basicToolBar', function () {
    $('#basicControllTool').toggleClass('hidden');
    const icon = $(this).find('i');
    icon.toggleClass('fa-caret-down fa-caret-up');
});

