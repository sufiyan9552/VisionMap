var viewer;
var MeasureTools;
var entityCollection = [];
var flyaround;
var dynamicLayer;
var shadowAnalysis;
var floodAnalysis;
var losTool;
var flightSimulation;
var clipping;
var route;
var assetModel;
var splitTool;
var draw;
var elevation;
var buffer;
var test;
// var tileset;
// var sydneyTileset;
// var dcTileset;
var openStreetMap;



var dragFlg = true;

//dynamic compenent variables
var lineCenter;
var LineFirstPosition = 0;
var LineSecondPosition = 0;


//tools variables
var dynamicCompenet;
var gps;
var scene;




var labelEntity;
var line_result = [];


var selectedLongitude;
var selectedLatitude;


//Tools related variables
var buttonData = [];
var checkboxData = [];
var dropdownData = [];
var sliderData = [];
var labelData = [];
var textBoxData = [];
var saveButtonData = [];
var sliderDataAndPlayButton = [];


//GPS 
var startFlg = false;
var endFlg = false;
var startPosition = 0;
var endPosition = 0;
var startDraw = false;



// Viewshed
var viewShed;

let arrViewField = [];
let viewModel = { verticalAngle: 90, horizontalAngle: 120, distance: 10 };

//Shadow Analysis
var timeslider;
var playButton;
var datePicker;


//floodAnalysis tool

let positions = [];
let waterSurface;
let waterHeight = 0;  // Initial water level


// Initial data
let floodData = [0];  // Start with an initial flood level
let labels = ['Start'];  // Initial 
let floodChart;


var identifyflg = false;
var startflg = false;
var endflg = false;


//3d model control
let Model_heading = 0;
let Modelpitch = 0;
let Modelroll = 0;
let Modelheight = 0;
let Modelcartesian;
var newModelScale = 1.0;

//drawing variables
let PointLabel;

let activeLine = null;  // To store the current line entity
let activeUnclampedLine = null;  // To store the unclamped line entity

//smart object identification
let distance = null;
let places;
let match;
let locationModelEntity;
let finalPlace;

let osmImageryProvider;

//Test variables
var particleSystem;

// Elevation

let storedElevations = [];
let globeCartographic=[];