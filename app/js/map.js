require(["esri/map",
         "esri/config",
        "esri/dijit/Geocoder",
        "esri/dijit/Scalebar",
        "esri/dijit/Legend",
        "esri/dijit/LocateButton",
         "esri/graphic",
        "esri/symbols/SimpleMarkerSymbol",
         "esri/symbols/SimpleLineSymbol", 
         "esri/symbols/SimpleFillSymbol",
         "esri/layers/FeatureLayer",
         "esri/tasks/query", 
         "esri/geometry/Circle",
         "esri/geometry/Polyline",
         "esri/geometry/Point",
         "esri/tasks/DistanceParameters",
         "esri/tasks/GeometryService",
         "esri/tasks/ProjectParameters",
         "esri/geometry/geodesicUtils",
         "esri/geometry/mathUtils",
        "esri/arcgis/utils",
         "esri/urlUtils",
         
        "dijit/registry",
         
        "dojo/dom",
        "dojo/dom-style",
        "dojo/on",
        "dojo/promise/all",
        "dojo/query",
        "dojo/_base/Color",
        "dojo/domReady!"],
    function (Map, esriConfig, Geocoder, Scalebar, Legend, LocateButton, Graphic, 
               SimpleMarkerSymbol,SimpleLineSymbol,SimpleFillSymbol,
               FeatureLayer,Query,Circle,Polyline,Point, DistanceParameters, GeometryService,ProjectParameters, GeodesicUtils,
               mathUtils, esriUtils,urlUtils, registry, dom,domStyle, on, all, query,Color) {
        
       //We need a proxy rule for the geometry service when doing a reprojection
       /*urlUtils.addProxyRule({
                    urlPrefix: "utility.arcgisonline.com",
                    proxyUrl: location.protocol + '//' + location.host + "/proxy/proxy.ashx"
        });*/
        esriConfig.defaults.io.proxyUrl = location.protocol + '//' + location.host + "/proxy/proxy.ashx"

        //Global Variables
        var geometryServiceURL =
            "http://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer";
        var map;
        var providerFS;
        var providerFeatureLayer;
        var scalebar;
        var legend;
        var geoLocate;
        var searchPnt;
        var searchFilters;
        var searchResults; 
        var providerList;
        var initialSearch = true;

        window.onbeforeprint = function() {
            console.log('This will be called before the user prints.');
        };
    
        var geocoder =  new Geocoder({
          arcgisGeocoder: {
            placeholder: "Address Search"
          }, 
          autoComplete: true,
          map: map
        }, dom.byId("search"));
    
        geocoder.on("select", showLocation);  //User performs a geocode
        geocoder.on("clear", clearGraphic);   //User clears the geocode
        
        // Load web map when page loads
        loadWebmap();

        /**********************************************************************************************
        * The base map for this applicaiton was built using ArcGIS Online Web Maps.  If the customer
        * wants to change the symbology or the popups or if they wish to add more layers, this can
        * can be done using the web map here: 
        * http://www.arcgis.com/home/webmap/viewer.html?webmap=ee3427d54a034ca284083121ad767503
        ***********************************************************************************************/
        function loadWebmap(e) {
            // Get new webmap and extract map and map parts
            var bootstrapmap = new BootstrapMap();
            var mapDeferred = bootstrapmap.createWebMap("7a6ead3957e8440dbdfcc78f9ba8f2ba", "mapDiv", {
                slider: true,
                nav: false,
                smartNavigation: false
            });

            mapDeferred.then(function (response) {
                map = response.map;

                // Add titles
                //dom.byId("mapTitle").innerHTML = response.itemInfo.item.title;
                //dom.byId("mapSubTitle").innerHTML = response.itemInfo.item.snippet;
                // Add scalebar and legend
                var layers = esri.arcgis.utils.getLegendLayers(response);
                if (map.loaded) {
                    initMapParts(layers);
                }
                else {
                    on(map, "load", function () {
                        initMapParts(layers);
                    });
                }

            }, function (error) {
                alert("Sorry, couldn't load webmap!");
                console.log("Error loading webmap: " & dojo.toJson(error));
            });
        }
    
        /********************************************************************************
        * Event handler for when the user uses the ArcGIS Geocoder Widget.
        *
        * We get the resulting geometry from the geocode and then search for proivders
        * within the given search parameters.
        *********************************************************************************/
        function showLocation(evt) {
            
          searchPnt = evt.result.feature.geometry;
          findProviders(providerFS,searchPnt);
        }
    
         /*******************************************************************************
         * This is an event handler for when a user clicks the clear button within the
         * ArcGIS Geocoder widget.
         *
         * We want to remove all the search point and radius graphics, because a new search
         * is about to begin, also we are going to clear the resulting providers and filters.
         * This is sort of a way to get a fresh start again.
         ********************************************************************************/
        function clearGraphic(evt) {
          map.infoWindow.hide();
          map.graphics.clear();
            
          providerList.clearProviders();
          //$("#filterLink").show();
          //$("#defaultfilter").hide();
        }

        /****************************************************************************************
        * This function just does the initialization of all the components within the application
        *****************************************************************************************/
        function initMapParts(layers) {            
                        
            //The Search Filter class handles the user defined filters
            searchFilters = new SearchFilters();
            searchFilters.basicSearchChanged = updateFilteredSearch; //One of the filter parameters has changed
            searchFilters.advanceSearchChanged = updateAdanvceSearch;
            

            //The Provider List class builds the provider list on the left of the map
            providerList = new ProviderList();
            providerList.listItemSelected = openFeaturePopup //An Event that fires off when a user selects a provider item
            
            //A helper for working with the provider feature layer
            providerFeatureLayer = new ProviderFeatureLayer();
            
            //The Provider Feature Layer in the map.
            providerFS = layers[0].layer;
            
            //The event that is fired off when a feature is selected
            //In this case we want to select the provider list item when a feature is selected on the map
            providerFS.on("selection-complete", featureServiceClicked); 
            
            //We need the FeatureLayer for performing Searches, such as a drop down that populates with
            //results from a query
            searchFilters.setFeatureLayer(providerFS);

            //Add Geolocate Button
            geoLocate = new LocateButton({
                map: map
            }, dom.byId("LocateButton"));
            geoLocate.startup();
            
            //Use Geolocation if available on the browser to find the current location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } 
        }
    
        /***********************************************************************************************
        * When Application loads, if Geolocation in the browser is enabled, we can get the users 
        * current location and zoom the map to that area and find the providers.  In this case
        * the end user doesn't even need to perform a search to see any of the providers
        ***********************************************************************************************/
        function showPosition(position) {
            
            searchPnt = new Point(position.coords.longitude, position.coords.latitude);
            
            findProviders(providerFS,searchPnt);
        }    
    
        /*********************************************************************************************
        * Find providers uses either the location point of the browser or the result of the ArcGIS
        * Geocoder widget to find all the providers within the SearchFilter parameters, such as search
        * radius, provider name and such.  THe providers a displayed on the map and a list is populated
        * with all the resulting providers
        **********************************************************************************************/
        function findProviders(featureLayer, searchPnt){

            if(initialSearch){
                findOptimalSearchRadius(featureLayer,searchPnt, "1=1");
                initialSearch = false;
            }
            else{
                var radius = searchFilters.getSearchRadius()
            
                queryProvidersService(radius,searchPnt,featureLayer);              
            }
        }
        function queryProvidersService(radius,mapPoint,featureLayer){
            
            var circle = new Circle({
                center: mapPoint,
                geodesic: true,
                radius: radius,
                radiusUnit: "esriMiles"
            });
            
            //Zooms to the Point location and adds a circle graphic to the map
            zoomToLocation(mapPoint, circle);
            
            var query = new Query();
            //query.geometry = circle.getExtent();
            //Only works with services in AGOL
            query.geometry = mapPoint;
            query.units = "miles";
            query.distance = radius;  //Distance only works with ArcGIS Online Feature Services
            
            
            //query.num = 5;
            where = searchFilters.buildWhereClause(); 
            query.where = where; 
            
            var providerType = searchFilters.getProviderType();
            //The definition expression handles the query too
            if( where != "1=1"){
                //Filter the Feature Layer to only show what is in the filter
                featureLayer.setDefinitionExpression(where);
            }
            else {
                featureLayer.setDefinitionExpression("");
            }
            
            //Make a REST call to query the feature Layer with parameters
            featureLayer.queryFeatures(query, queryFeatures);           
        }
    
        function findOptimalSearchRadius(featureLayer, mapPoint, whereClause){
            var differedFunctions = [];
            var searchRadiuses = [5,20];
                        
            for(index = 0; index < searchRadiuses.length; index++){
                                    
                //Can only query with search distance when using AGOL Services
                var query = new Query();
                query.geometry = mapPoint;
                query.units = "miles";
                query.distance = searchRadiuses[index]; //Distance only works with ArcGIS Online Feature Services
                query.where = "1=1";
                query.returnCount = true;

                
                differedFunctions.push(featureLayer.queryCount(query));
            }
            
            promises = all(differedFunctions);
            promises.then(function(evt){
                var gotOptimumSearchRadious = false;
                var optSearchRadious = 100
                //var searchRadiuses = [1,5,10,20,40,100];
                var searchRadiuses = [5,20];
                
                for(searchIndex = 0; searchIndex < 2; searchIndex++){
                    var count = evt[searchIndex];
                    if(count < 100 && count >= 10){
                        gotOptimumSearchRadious = true;
                        optSearchRadious = searchRadiuses[searchIndex];
                        break;
                    }
                }
                //Didn't find an optimum search radious, now let's just get one that is greater than 0
                if(!gotOptimumSearchRadious){
                    
                    //Can only query with search distance when using AGOL Services
                    var query = new Query();
                    query.geometry = mapPoint;
                    query.units = "miles";
                    query.distance = searchRadiuses[index]; //Distance only works with ArcGIS Online Feature Services
                    query.where = "1=1";
                    query.returnCount = true;
                    
                    var radious5miCount = evt[0]
                    var radious20miCount = evt[1]
                    if (radious5miCount > 100){
                        query.distance = 1
                        featureLayer.queryCount(query, function(radious1miCount) {

                            if (radious1miCount > 0)
                                optSearchRadious = 1
                            else
                                optSearchRadious = 5
                                
                            performSearch(optSearchRadious)
                        })

                    }
                    else if (radious20miCount > 100){
                        query.distance = 10
                        var radious10miCount = featureLayer.queryCount(query)
                        if(radious10miCount < 100 && radious10miCount >= 10){
                            optSearchRadious = 10;
                        }
                        else if(radious5miCount > 0 && radious10miCount > 100){
                            optSearchRadious = 5;
                        }
                        else if(radious10miCount > 0)
                            optSearchRadious = 10;
                        else
                            optSearchRadious = 20;
                        
                        performSearch(optSearchRadious)
                    }
                    else if (radious20miCount < 10){
                        query.distance = 40
                        var radious40miCount = featureLayer.queryCount(query)
                        if(radious40miCount < 100 && radious40miCount >= 10){
                            optSearchRadious = 40;
                        }
                        else if(radious40miCount < 10){
                            optSearchRadious = 100;
                        }
                        else if(radious40miCount > 100 && radious20miCount > 0)
                            optSearchRadious = 20;
                        else if(radious40miCount > 0)
                            optSearchRadious = 40;
                        else
                            optSearchRadious = 100;
                        
                        performSearch(optSearchRadious)
                    }
                    else
                        performSearch(100)
                }
                else
                    performSearch(optSearchRadious)
                

            });            
        }
                          
        function performSearch(optSearchRadious){
            searchFilters.setSearchRadius(optSearchRadious);
            queryProvidersService(optSearchRadious,searchPnt,providerFS);                   
        }
    
        /**********************************************************************************************
        * An event handler for when a search item has been updated/changed
        * We research the provider information
        ***********************************************************************************************/
        function updateFilteredSearch(){
            
            if(typeof searchPnt != "undefined")
                findProviders(providerFS, searchPnt)
        }
    
        /*************************************************************************************************
        * An event handler when the advance search has occured.
        **************************************************************************************************/
        function updateAdanvceSearch(){
            if(typeof searchPnt != "undefined"){
                whereClause = searchFilters.buildWhereClause();
                findOptimalSearchRadius(providerFS,searchPnt,whereClause)
            }
        }
    
        /************************************************************************************************
        * Takes the map point search location and adds the point to the map with a search circle graphic
        * And then zooms to the area.
        *************************************************************************************************/
        function zoomToLocation(mapPoint, circle){
              map.graphics.clear();
              map.infoWindow.hide();
            
              var point = mapPoint;
              var symbol = new SimpleMarkerSymbol().setStyle(
                SimpleMarkerSymbol.STYLE_SQUARE).setColor(
                new Color([255,0,0,0.5])
              );

              var graphic = new Graphic(point, symbol);
              map.graphics.add(graphic);

            var circleSymb = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_NULL,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                new Color([105, 105, 105]),
                2
              ), new Color([255, 255, 0, 0.25])
            );
            
            var graphic = new Graphic(circle, circleSymb);
            map.graphics.add(graphic);
            
            map.setExtent(circle.getExtent().expand(1.5));
            
            map.centerAt(point);
        }
    
        /********************************************************************************
        * The response from the REST call querying for providers using the search criteria
        * Once we have the features, we still need to calcualte the distances to show how
        * far away the provider is.
        *********************************************************************************/
        function queryFeatures(response)
        {
            var features = response.features;
            searchResults = features;
            
            //We only need to calculate the distances if there are search results,
            //otherwise we can just show an error message in the search result box
            if(features.length > 0) {
                calculateDistances(features);
            }
            else{
                //When no providers result from the search, we let the user know to change the filter parameters
                providerList.showNoProvidersResulted();
            }
        }
    
        /**********************************************************************************************************
        * Calcualtes the distance as the crow flies from the search point to the provider. 
        * The distance is used to sort the list results and display in each item.  
        * 
        * At some point we may want to look into using network services to find the drive time and drive distance.
        ***********************************************************************************************************/
        function calculateDistances(features){
            
            //We have to use a beta service, because of CORS.  Or we could set up a proxy
            var geometryService = new GeometryService(geometryServiceURL);
            
            var params = new ProjectParameters();
            params.geometries = [searchPnt];
            params.outSR = features[0].geometry.spatialReference;
            
            //Our Search Point is not in the right projection, so inorder to get accurate search results, we need
            //to project the point
            geometryService.project(params, function(projPoints){
                var projSearchPnt = projPoints[0];
                var differedFunctions = [];
                //Now we need to determine the distances of all the points using a differed we can do it all at once
                for (var i = 0; i < features.length; i++) {
                    feature = features[i];
                    
                    //Using the GetLength Function instead of the Geometry service, we are going for speed instead of
                    //accuracy.  It's slightly off.
                    var length = mathUtils.getLength(projSearchPnt, feature.geometry);
                    length = Math.round(length * 0.000621371 * 100)/100;
                    feature.attributes.distance = length;
                }
                
                features.sort(function(obj1, obj2) {
                    // Ascending: first distance less than the previous
                    return obj1.attributes.distance - obj2.attributes.distance;
                });
                
                providerList.setFeatures(features);
                providerList.buildProviderList();
                     
            });
        }
    
        /**********************************************************************************
        * Takes a feature and opens the popup on the map.  Is typically used when an item
        * in the list is selected.
        * Input:  The feature that we want to open the popup for
        ***********************************************************************************/
        function openFeaturePopup(feature){
            map.infoWindow.setFeatures([feature]);
            map.infoWindow.show(feature.geometry);
        }
        
        /******************************************************************************** 
         * An event handler for when the Provider location on the map is selected/clicked.
         * We first clear the selected List items on the left panel, and then select all
         * the list items that corespond with the selected features
         *Inputs: The features that we selected
        ********************************************************************************/
        function featureServiceClicked(evt){
            providerList.selectProviders(evt.features);
        }
    });