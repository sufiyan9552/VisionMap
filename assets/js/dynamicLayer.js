
export class DynamicLayer {
    constructor() {

    }
    LoadLayers() {
        var dropdownValue = document.getElementById("dropdownMenu").value;
        var textboxValue = document.getElementById("inputLabel").value;
        this.loadData(textboxValue, dropdownValue);
        $('.modal-box').hide();
        $('.modal-backdrop').hide();
    }

    loadData(url, dataType) {
        const hasNumber = /^\d+$/.test(url); // Returns true if the url contains only numbers
        console.log(hasNumber);

        showLoading();
        setTimeout(function () {
            hideLoading();
            showMessage("To Remove layer and Clear Data Use Clear All Tool.");
        }, 5000);

        switch (dataType) {
            case 'vector-point':
                this.loadVectorData(url, 'point');
                break;
            case 'vector-line':
                this.loadVectorData(url, 'line');
                break;
            case 'vector-polygon':
                this.loadVectorData(url, 'polygon');
                break;
            case 'raster':
                this.loadRasterData(url);
                break;
            case 'tin':
                this.loadTINData(url);
                break;
            case 'point-cloud':
                this.loadPointCloudData(url);
                break;
            case 'network':
                this.loadNetworkData(url);
                break;
            case '3d-model':
                if (hasNumber) { this.load3DModelWithAssetsID(url); } else {
                    this.load3DModel(url);
                }
                break;
            case 'multispectral':
                this.loadMultispectralData(url);
                break;
            case 'GeoJson':
                this.loadGeoJson(url);
                break;
            case 'Terrain':
                if (hasNumber) {this.loadTerrain(url)}else{
                    this.loadLocalTerrain(url)
                }
                break;
                case 'Wms':
                    if (hasNumber) {showMessage("under Construction")}else{
                        this.loadWms(url)
                    }
                
                
                break;

            default:
                showMessage('Unsupported data type');


        }
    }

    //************************** Load Vector Data *************************************************** */
    async loadVectorData(url, type) {
        try {
            const dataSource = await Cesium.GeoJsonDataSource.load(url);
            viewer.dataSources.add(dataSource);

            const graphicsConfig = {
                'point': {
                    type: 'point',
                    graphics: { pixelSize: 10, color: Cesium.Color.RED }
                },
                'line': {
                    type: 'polyline',
                    graphics: { width: 2, material: Cesium.Color.BLUE }
                },
                'polygon': {
                    type: 'polygon',
                    graphics: { material: Cesium.Color.YELLOW.withAlpha(0.5) }
                }
            };

            if (graphicsConfig[type]) {
                dataSource.entities.values.forEach(entity => {
                    entity[graphicsConfig[type].type] = new Cesium[`${graphicsConfig[type].type.charAt(0).toUpperCase()}${graphicsConfig[type].type.slice(1)}Graphics`](graphicsConfig[type].graphics);
                });
            }
        } catch (error) {
            console.error("Error loading vector data:", error);
        }
    }

    //****************************** Load Raster Data ******************************************************* */
    loadRasterData(url) {
        const openStreetMap = new Cesium.OpenStreetMapImageryProvider({ url });
        viewer.imageryLayers.addImageryProvider(openStreetMap);
    }

    //***************************** Load Point Cloud Data ************************************************************************* */
    loadPointCloudData(url) {
        const pointCloud = new Cesium.Cesium3DTileset({ url });
        viewer.scene.primitives.add(pointCloud);
    }

    //********************************** Load 3D Model Data ******************************************************************************* */
    load3DModel(url) {
        try {
            const tileset = new Cesium.Cesium3DTileset({
                url: url
            });
            viewer.scene.primitives.add(tileset);
            if (tileset.readyPromise) {
                tileset.readyPromise.then(() => {
                    viewer.zoomTo(tileset);
                    console.log("3D model loaded successfully.");
                }).catch((error) => {
                    console.error("Failed to load 3D model:", error);
                });
            }
        } catch (error) {
            console.error("Unexpected error occurred:", error);
        }
    }


    loadGeoJson = async (code) => {
        try {

            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
            const resource = await Cesium.IonResource.fromAssetId(code);
            const dataSource = await Cesium.GeoJsonDataSource.load(resource);
            dataSource.customProperty = 'Geojson';  
            viewer.dataSources.add(dataSource);

            for (const entity of dataSource.entities.values) {

                if (entity.properties) {
                    const modelUri = entity.properties.modelUri && entity.properties.modelUri.getValue ? entity.properties.modelUri.getValue() : null;
                    if (modelUri) {
                        entity.model = {
                            uri: modelUri,
                            minimumPixelSize: 50,  
                            maximumScale: 0, 
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                        };
                    }

                    const name = entity.properties.name && entity.properties.name.getValue ? entity.properties.name.getValue() : null;
                    if (name) {
                        entity.label = {
                            text: name,
                            font: '14pt sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            showBackground: true,
                            backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -50),
                            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 1000000.0) 
                        };
                    }
                }
            }

            viewer.zoomTo(dataSource);

        } catch (error) {
            // Handle any errors in loading
            console.error('Error loading GeoJSON:', error);
            showMessage('Error loading GeoJSON: Please confirm Proper DataType');
        }
    };


    //****************************** Load 3D Model Using Assets ID ********************************************** */  
    async load3DModelWithAssetsID(assetId) {
        try {
            const numericAssetId = Number(assetId);
            const tileset = numericAssetId
                ? await Cesium.Cesium3DTileset.fromIonAssetId(numericAssetId)
                : new Cesium.Cesium3DTileset({ url: assetId });

            viewer.scene.primitives.add(tileset);
            viewer.zoomTo(tileset);
        } catch (error) {
            console.error(`Failed to load 3D model with asset ID: ${assetId}`, error);
            showMessage(`Failed to load 3D model with asset ID: ${assetId}`);
        }
    }

    ClearSelectedData() {
        document.getElementById("dropdownMenu").value = "";
        document.getElementById("inputLabel").value = "";
    }

    loadTerrain(id) {
        if(osmImageryProvider){
            viewer.imageryLayers.remove(osmImageryProvider);
        }
        viewer.scene.setTerrain(Cesium.CesiumTerrainProvider.fromIonAssetId(id));

        // viewer.terrain = Cesium.Terrain.fromWorldTerrain({
        //     requestVertexNormals: true, 
        // });
        }
        
    
    loadLocalTerrain(url) {
        if(osmImageryProvider){
            viewer.imageryLayers.remove(osmImageryProvider);
        }
            viewer.scene.terrainProvider = new Cesium.CesiumTerrainProvider({
                url : url
            });
        }


        loadWms(url){
            const wmsLayer = new Cesium.WebMapServiceImageryProvider({
                url : url,
                layers: url, 
                parameters : {
                    transparent: true,
                    format: 'image/png', 
                }
            });
            viewer.imageryLayers.addImageryProvider(wmsLayer);

        }

        

}


