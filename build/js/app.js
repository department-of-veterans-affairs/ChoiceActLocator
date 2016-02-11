/**
 *Class Name: ProvidersFeatureLayer
 *
 *  A helper class for dealing with the Provider List feature layer
 */		
require([
    "dojo/_base/declare",
            "dojo/dom",
        "dojo/_base/lang"
], function(declare,dom, lang){
    return declare("ProviderFeatureLayer",null, {
        
        constructor: function(){	
        
            this.providerFieldName = "Provider";
            this.providerFirstName = "ProviderFirstName";
            this.providerLastName = "ProviderSurName";
            this.providerSuffix = "ProviderSuffix";
            this.providerDegree = "Degree";
            this.providerSex = "Sex";
            this.prescribingProvider = "PrescribingProvider";
            this.addressFieldName = "AddressLine";
            this.address2FieldName = "AddressLine2";
            this.specialityFieldName = "SpecialtyVACategories";
            this.specialityTPAFieldName = "SpecialtyTPACategories";
            this.specialityGroup = "SpecGroup";
            this.groupname = "GroupName";
            this.cityFieldName = "City";
            this.stateFieldName = "State";
            this.zipFieldName = "Zip_1";
            this.VISNFieldName = "VISN";
            this.triWestOrHealthNet = "TWHN"
            this.choiceOrPC3 = "ChoicePC3"
            this.regionFieldName = "Region";
            this.networkFieldName = "Network"
            this.typeFieldName = "Type";
            this.categoryFieldName = "Category";
            this.uIDFieldName = "FID";
            this.uniqueProviderCode = 'UniqueProviderCode'
            
        },
        getUniqueProviderTypes: function(){
             return ['Acupuncture','Allergy, Asthma, and Immunology','Ambulance',
                     'Ambulatory Surgery Center','Anesthesiology','Audiology',
                     'Behavioral Medicine','Cardiology','Chiropractor','Dentistry',
                     'Dermatology','Dialysis','Diet and Nutrition',
                     'Emergency Medicine / Critical Care Medicine','Endocrinology',
                     'Ent (Ears/Nose/Throat) -Otorhinolaryngology','Gastroenterology',
                     'Genetics','Gerontology','Hematology','Home Health',
                     'Hospice and Pallative Care','Hospital/Facility','Infectious Diseases',
                     'Infusion Therapy','Laboratory','Medical Supply','Neonatal-Perinatal',
                     'Nephrology','Neurology','Ob/Gyn','Oncology','Ophthalmology',
                     'Optometry','Orthopedics','Other','Pain Management','Pathology',
                     'Pediatric Specialties','Pharmacy','Physical Med/Rehabilitation',
                     'Podiatry','Primary Care','Proctology','Pulmonary Disease',
                     'Radiology / Diagnostic Imaging','Rheumatology','Surgery','Urology'];
        }
    
    });
}); 
/**
 *Class Name: ProviderList
 *
 *  Generates the list results for the provider page
 */		
require([
    "dojo/_base/declare",
            "dojo/dom",
     "dojo/dom-construct",
        "dojo/_base/lang"
], function(declare,dom, domConstruct,lang){
    return declare("ProviderList",null, {
    	    	
	    constructor: function(){	
        
            this._features = [];
        },
        setFeatures: function(features){
           this._features = features;  
        },
        /****************************************************************************
        * Builds the provider list from all the features returned from the query.
        ****************************************************************************/
        buildProviderList: function (){
          //Clear Provider List
          this.clearProviders();
        
          var features = this._features;
          for (var i = 0; i < features.length; i++) {
            feature = features[i];

            var content = "" 
                        
            //We want to select the first item
            if(i == 0){
                this.listItemSelected(feature);
                content = this.buildListItemFromFeatures(feature, true)
            }
              else{
                content = this.buildListItemFromFeatures(feature, false)
            }
            
            var n = domConstruct.place(content, dom.byId("providerList"));
            n.value = feature;
              
            n.onclick = lang.hitch(this, this.listItemClicked); 
          }
        },
        /**********************************************************************
        * Builds the left pane Provider list item from a Feature within the
        * feature service.
        * 
        * If the item is selected, we want it to be highlighted on the left
        * Panel
        *
        * Inputs:  The Feature used to populate the attribute info, whether the 
        *          is selected
        ***********************************************************************/
        buildListItemFromFeatures: function (feature, isSelected){
            
            var providerFL = new ProviderFeatureLayer();
            
            var content = "<div class=\"list-group\">" 
                        
            //We want to select the first item
            if(isSelected){
                content += "<a href=\"#\" class=\"list-group-item active\">"
            }
              else{
                content += "<a href=\"#\" class=\"list-group-item\">"
            }
            
            var providerFirstName = feature.attributes[providerFL.providerFirstName]
            var providerLastName = feature.attributes[providerFL.providerLastName]
            var providerSuffix = feature.attributes[providerFL.providerSuffix]
            var providerDegree = feature.attributes[providerFL.providerDegree];
            if (!providerSuffix){
                providerSuffix = "";
            }
            
            content += "<h4 class=\"list-group-item-heading\">" + 
                providerFirstName + " " + providerLastName + " " +
                providerSuffix + " " + providerDegree +
            "</h4>"
            
            content += "<p class=\"list-group-item-text\" style=\"text-align: center\">" + 
                feature.attributes[providerFL.addressFieldName] + "<br>"
            
            content += feature.attributes[providerFL.cityFieldName] + ", " + feature.attributes[providerFL.stateFieldName] + "  " 
                    +  feature.attributes[providerFL.zipFieldName] + "</p><br>"
            
            content += "<p  class=\"list-group-item-text\" style=\"text-align: left\">" + 
                feature.attributes[providerFL.groupname] + "<br>";
            
            content += "Specialty: " + feature.attributes[providerFL.specialityFieldName] + "</p>" 

            content += "<h5 style=\"text-align:right\">" + feature.attributes["distance"] + " miles </h5>"
            //content += "<h5 style=\"text-align:right\">" + feature.attributes["newDistance"] + " miles </h5>"

            content += "</a></div>"; 
            
            return content;
        },
        /**********************************************************************************
        * An event handler for when a Provider List item is clicked/selected on the
        * left panel.
        *
        * When selected we have to determine which item within the the entire item is
        * selected so that we know how deep into the parent nest to change the selected item 
        * active
        ***********************************************************************************/
        listItemClicked: function (evt){

            this.clearSelectedItems();
            
            if( evt.target.parentNode.classList.contains("list-group-item") && 
                !evt.target.parentNode.classList.contains("active")){
                
                    evt.target.parentNode.classList.add("active");
            }
            else if(evt.target.classList.contains("list-group-item") && 
                !evt.target.classList.contains("active")){
                
                    evt.target.classList.add("active");
            }
            
            var feature = [];
            if(evt.target.parentNode.classList.contains("list-group-item"))
            {
                feature = evt.target.parentNode.parentNode.value;
            }
            else{
                feature = evt.target.parentNode.value;
            }
            
            if(feature != []){
                //Show's selected items popup on the map
                this.listItemSelected(feature);
            }
        },
        /******************************************************************************
        * When a search results in no providers being found, we inform the user
        * to update thier search.
        *******************************************************************************/
        showNoProvidersResulted: function(){
            //Clear Provider List
            this.clearProviders();
            
            //Adding an error alert saying no providers were found
            var content = "<div class=\"alert alert-danger\" role=\"alert\">" + 
                          "<strong>No Providers Found</strong> Your search resulted in no providers. " +
                           "Please expand your search radius or update your filter parameters using " +
                           "the Filter link below the searchbox </div>"
                        
            domConstruct.place(content, dom.byId("providerList"));
            
        },
        /*********************************************************************************
        * Loops through each Provider List item and changes the Class so that each item
        * is no longer selected
        **********************************************************************************/
        clearSelectedItems: function (){
            var children = dom.byId("providerList").children;
            for (childIndex = 0; childIndex < children.length; childIndex++)
            {
                var child = children[childIndex].children[0];
                child.classList.remove("active");
            }
        },
        /********************************************************************************
         *Purpose: 
         * An event handler for when the Provider location on the map is selected/clicked.
         * We first clear the selected List items on the left panel, and then select all
         * the list items that corespond with the selected features
         *Inputs: The features that we selected
        ********************************************************************************/
        selectProviders: function (selectedFeatures){
            this.clearSelectedItems();
            var providerFL = new ProviderFeatureLayer();
            
            var features = selectedFeatures;
            
            for (var featIndex = 0; featIndex < features.length; featIndex++){
                var feature = features[featIndex];
                var children = dom.byId("providerList").children;
                for (childIndex = 0; childIndex < children.length; childIndex++)
                {
                    //The feature that is saved to the list item.
                    var listFeature = children[childIndex].value;
                    var child = children[childIndex].children[0];
                    if(listFeature.attributes[providerFL.uniqueProviderCode] == feature.attributes[providerFL.uniqueProviderCode])
                        child.classList.add("active");
                }
            }
        },
        clearProviders: function(){
            domConstruct.empty("providerList");
        },
        /*****  EVENTS  *********************************/ 
        /**
         * We need to let the mapping client know when a point has been selected on the chart
        */
        listItemSelected : function (feature) {}    
    });
}); 
/*******************************************************************************************************
 * Class Name: SearchFilters 
 * Description: Handles the searching information that the user chooses when generating filters and such
 *******************************************************************************************************/		
require([
    "dojo/_base/declare",
    "dojo/dom-construct",
    
    "esri/layers/FeatureLayer",
    "esri/tasks/query", 
    "esri/tasks/QueryTask", 
    
    "dojo/_base/lang"
], function(declare,domConstruct,FeatureLayer,Query,QueryTask, lang){
    return declare("SearchFilters", null, {
    	    	
	    constructor: function(){	
            /*** Basic Search ******************************/
 	        this._radiusDropDown = dojo.byId("searchRadius");    
            this._providerDropDown = dojo.byId("providerType");  
            
            //Advance Search Elements
            this.advanceSearchOptionsSet = false;
            this._providerNameTexInput = dojo.byId("providerNameSearch");    
            this._providerGroupTexInput = dojo.byId("providerNetworkSearchgrp");    
            this._providerSexDropDown = dojo.byId("searchSex");    
            this._providerSpecGroupDropDown = dojo.byId("searchSpecGroup");    
            this._providerProgramDropDown = dojo.byId("searchProgram");    
            
            //Basic Search Initialization
            this.populateProviderTypesCombo();
            
            var radiusBtns = this._providerDropDown.getElementsByTagName("input");
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                
                //lang hitch, allows us to take the radio button onclick event
                //and send it to a function within the class.  It keeps the scope
                //within the class.
                radBtn.onclick = lang.hitch(this, this.gotButtonInfo);
            }
            
            var radiusBtns = this._radiusDropDown.getElementsByTagName("input");
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                radBtn.onclick = lang.hitch(this, this.gotButtonInfo);
            }
            
            dojo.byId("btnAdvanceSearch").onclick = lang.hitch(this, this.advanceSearchClicked);
            dojo.byId("btnClearSearch").onclick = lang.hitch(this, this.advanceClearClicked);
            
            /*** Advance Search ******************************/            
            //We use the feature layer to help filter query results.
            this._featureLayer = [];
            
            this.advanceClearClicked();
            //Removing Search List from Advance Search
            //dojo.byId("providerNameSearch").onkeyup = lang.hitch(this, this.searchProviderNames);  
            
            //Start by hiding the provider Search Results
            var e = $("#providerNameSearchresults");
            e.hide(); 
        },
        /******************************************************************************************
        * We need the feature layer for the advance searching because we populate a dropdown with
        * the resulting text information from the searches
        *******************************************************************************************/
        setFeatureLayer: function(featuerLayer){
            this._featureLayer = featuerLayer;
        },
        gotButtonInfo: function(){
           this.basicSearchChanged();  
        },
        advanceSearchClicked:function(){
           this.advanceSearchOptionsSet = true;            
           this.advanceSearchChanged();   
        },
        advanceClearClicked:function(){
            this.advanceSearchOptionsSet = false;  
            this.clearAdvanceSearchProps(); 
            //Since all the advance settings have been cleared, just run a basic search
            this.basicSearchChanged();
        },
        /*****************************************************************************************
        * Returns true if there are no changes to the default search setting settings
        *****************************************************************************************/
        isDefaultSettings: function(){
            var defaultSettings = false;
            if( dojo.byId("ddDist_1").checked && dojo.byId("ddType_1").checked )
                defaultSettings = true;
            
            return defaultSettings;
            
        },
        /*****************************************************************************************
        * Returns the selected Search Radius Value in the basic Search
        ******************************************************************************************/
        getSearchRadius : function(){
            var radiusBtns = this._radiusDropDown.getElementsByTagName("input");
            var searchRadius = '1';
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                if(radBtn.checked) {
                    searchRadius = parseInt(radBtn.value);
                    break;
                }
            }
            
            return searchRadius;
        },
        /********************************************************************************************
        * Switches the selected radious drop down to the value that is inputed 
        *********************************************************************************************/
        setSearchRadius : function(radius){
            var radiusBtns = this._radiusDropDown.getElementsByTagName("input");
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                if(radBtn.value == radius) {
                    radBtn.checked = true;
                    dojo.byId("searchRadiusBtn").getElementsByTagName("span")[0].textContent = radius + " Mile";
                }
                else {
                    radBtn.checked = false;
                }
            }
            
        },
        /*******************************************************************************************
        * Returns the Provider type value in the basic search
        ********************************************************************************************/
        getProviderType : function(){
            var radiusBtns = this._providerDropDown.getElementsByTagName("input");
            var providerType = 'All';
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                if(radBtn.checked) {
                    providerType = radBtn.value;
                    break;
                }
            }
            
            return providerType;
        },
        /*****************************************************************************************
        * Returns The User inputed Provider Name
        *****************************************************************************************/
        getProviderName : function(){
            return this._providerNameTexInput.value;
        },
        /*****************************************************************************************
        * Returns The User inputed Group Name
        *****************************************************************************************/
        getProviderGroupName : function(){
            return this._providerGroupTexInput.value;
        },
        getProviderSex: function(){
            var sexDropDown = this._providerSexDropDown;
            value = this.getDropDownValue(sexDropDown,'All');
            if(value == "Male")
                value = "M"
            else if(value == "Female")
                value = "F"
                
            return value;
        },
        getProviderSpecGroup: function(){
            var specGroupDropDown = this._providerSpecGroupDropDown;
            value = this.getDropDownValue(specGroupDropDown,'All');
            return value;
        },
        getProviderProgram: function(){
            value = this.getDropDownValue(this._providerProgramDropDown,'All');
            return value;  
        },
        /******************************************************************************************
        *Get's the selected Value within the Bootstrap DropDown
        *******************************************************************************************/
        getDropDownValue: function(dropDown, initialValue){
            var radiusBtns = dropDown.getElementsByTagName("input");
            value = initialValue;
            
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                if(radBtn.checked) {
                    value = radBtn.value;
                    break;
                }
            }
            
            return value;
        },
        /**************************************************************************************
        * Clears all the advance search properties back to their defaults
        ***************************************************************************************/
        clearAdvanceSearchProps:function(){
            this._providerNameTexInput.value = ''
            this._providerGroupTexInput.value = ''
            this.selectDropDownValue(this._providerProgramDropDown, 'All');
            this.selectDropDownValue(this._providerSpecGroupDropDown, 'All');
            this.selectDropDownValue(this._providerSexDropDown,'All');     
        },
        /*************************************************************************************
        * Selects the Dropdown value in the code
        *************************************************************************************/
        selectDropDownValue: function(dropDown, value){
            dropDown.getElementsByTagName("span")[0].textContent = value; 
            
            var radiusBtns = dropDown.getElementsByTagName("input");
            for(var index = 0; index < radiusBtns.length; index++)
            {
                var radBtn = radiusBtns[index];
                if(radBtn.value == value) {
                    radBtn.checked = true
                }
                else
                    radBtn.checked = false
            }
            
            
        },
        /*************************************************************************************
        *Populates the unique provider types
        *************************************************************************************/
        populateProviderTypesCombo: function(){
            var providerFL = new ProviderFeatureLayer();
            var uniqueCats = providerFL.getUniqueProviderTypes();

            //Was having isues with DOJO, so just decided to cheat and use JQuery
            var e = $("#providerTypesDropDownMenu");
            //Populate the dropdown list with each provider type we can find.
            for( var index =0; index < uniqueCats.length; index++){
                var providerType = uniqueCats[index];
                var listItem = "<li>" +
                               "<input type=\"radio\" id=\"ddProvType_" +index.toString() + 
                                "\" name=\"exType\" value=\"" + providerType + "\" >" +
                                "<label for=\"ddProvType_" +index.toString() + "\">" + providerType + "</label></li>"
                e.append(listItem);
            }
            
        },
        /************************************************************************
        * When a user starts typing in the Provider name advance search box,
        * we start populating it with results from a query searching for records 
        * that are like current text input.
        *
        * Found Example here: http://thornelabs.net/2014/05/12/instant-search-with-twitter-bootstrap-jekyll-json-and-jquery.html
        * Input: The KeyUp event for the textbox
        *************************************************************************/
        searchProviderNames: function(evt){
            
            var providerFL = new ProviderFeatureLayer();
            var provFieldName = providerFL.providerLastName
            if(evt.target.value.length >= 1)
            {
                var query = new Query();
                query.where = 'upper( ' + provFieldName + ") like upper('%" + evt.target.value.toString() + "%')";   
                query.outFields = [provFieldName];
                query.returnGeometry = false;
                query.num = 20; //Only want to display 10 results, but getting a few extra in case of duplicates

                this._featureLayer.queryFeatures(query, lang.hitch(this, this.showProviders));
            }
            else{
                var e = $("#providerNameSearchresults");
                e.hide(); 
            }
        },
        /**************************************************************************
        * The result from the query feature REST call with the Provider Name being like 
        * the text input.  We take the results and show them in a drop down box
        ****************************************************************************/
        showProviders:function(evt){
            var providerFL = new ProviderFeatureLayer();
            var provFieldName = providerFL.providerLastName
            //Was having isues with DOJO, so just decided to cheat and use JQuery
            var e = $("#providerNameSearchresults");
            e.show(); 
            e.html("");  //Clear the dropdown list
            
            var providers = this.getUniqueFeatureResults(evt.features,provFieldName);
            
            //TODO: Add Search Item for what ever is currently within the text box
            //e.append('<li style="padding-top: 3px; padding-bottom: 3px"><a style="color: #999; word-wrap: break-word; white-space: normal" href="#">' + providerName + '</a></li>');
            
            //Populate the dropdown list with each provider name we can find.
            var features = evt.features;
            for( var index =0; index < providers.length && index < 10; index++){
                var providerName = providers[index];
                e.append('<li style="padding-top: 3px; padding-bottom: 3px"><a style="color: #999; word-wrap: break-word; white-space: normal" href="#">' + providerName + '</a></li>');
            }
        },
        /**************************************************************************
        * Gets the unique values in the list
        ***************************************************************************/
        getUniqueFeatureResults:function(features,fieldName){
            var values = [];
            for( var index =0; index < features.length; index++){
                var value = features[index].attributes[fieldName];
                var containsValue = false;
                for(valuesIndex = 0; valuesIndex < values.length; valuesIndex++){
                    if(value.toLowerCase() == values[valuesIndex].toLowerCase()) {
                        containsValue = true;
                        break;
                    }
                }
                
                if(!containsValue)
                    values.push(value);
            }
            return values;
        },
        /*************************************************************************************
        * Builds the where clause based on the Search Parameters
        **************************************************************************************/
        buildWhereClause:function(){
            var providerFL = new ProviderFeatureLayer();
            var providerType = this.getProviderType();
            var typeFieldName = providerFL.specialityFieldName;
            
            var where = "1=1"
            
            //There where clause when provider type is set and advance options not set
            if( providerType != "All" && !this.advanceSearchOptionsSet){

                where = typeFieldName + " = '" + providerType + "'";
            }
            if(this.advanceSearchOptionsSet){
                if(providerType != "All")
                    where = typeFieldName + " = '" + providerType + "'";
                
                var providerNameSearch = this.getProviderName();
                
                providerNameWhereClause = this.buildProviderNameWhereQuery(providerNameSearch);
                console.log(providerNameWhereClause);
                
                var providerLastNameField = providerFL.providerLastName;
                if(providerNameSearch != "" && where != "1=1"){
                    providerNameWhereClause = this.buildProviderNameWhereQuery(providerNameSearch);
                    where += ' AND ' + providerNameWhereClause
                }
                else if(providerNameSearch != ""){
                    providerNameWhereClause = this.buildProviderNameWhereQuery(providerNameSearch);
                    where = providerNameWhereClause
                }
                
                var providerGroup = this.getProviderGroupName();
                var providerGroupField = providerFL.groupname;
                if(providerGroup != "" && where != "1=1")
                    where += ' AND upper( ' + providerGroupField + ") like upper('%" + providerGroup + "%')"
                else if(providerGroup != "")
                    where = 'upper( ' + providerGroupField + ") like upper('%" + providerGroup + "%')";
                
                var providerSex = this.getProviderSex();
                var providerSexField = providerFL.providerSex;
                if(providerSex != 'All' && where != "1=1")
                    where += ' AND ' + providerSexField + " = '" + providerSex + "'";
                else if(providerSex != 'All')
                    where = providerSexField + " = '" + providerSex + "'";
                
                var providerSpecGroup = this.getProviderSpecGroup();
                var providerSpecGroupField = providerFL.specialityGroup;
                if(providerSpecGroup != 'All' && where != "1=1")
                    where += ' AND ' + providerSpecGroupField + " = '" + providerSpecGroup + "'";
                else if(providerSpecGroup != 'All')
                    where = providerSpecGroupField + " = '" + providerSpecGroup + "'";
                
                var providerProgram = this.getProviderProgram();
                var providerProgramField = providerFL.choiceOrPC3;
                if(providerProgram != 'All' && where != "1=1")
                    where += ' AND ' + providerProgramField + " = '" + providerProgram + "'";
                else if(providerSpecGroup != 'All')
                    where = providerProgramField + " = '" + providerProgram + "'";
            }
            
            console.log(where)
            
            return where;
        },
        buildProviderNameWhereQuery:function(providerNameSearch){
            //Split name by whitespace so we can search the last name, first name columns
            var nameSplit = providerNameSearch.trim().split(" ")
            
            var providerFL = new ProviderFeatureLayer();
            var providerLastNameField = providerFL.providerLastName
            var providerFirstNameField = providerFL.providerFirstName

            var where = "( "
            for (index = 0; index < nameSplit.length; index++){
                name = nameSplit[index];
                if (where != "( ")
                    where += " AND "
                
                where += '(upper( ' + providerLastNameField + ") like upper('%" + 
                    name + "%') OR upper( " + providerFirstNameField + 
                    ") like upper('%" + name + "%'))" ;
            }
            
            where += " )"
            
            return where;
        },
        /*****  EVENTS  *********************************/ 
        /**
         * We need to let the mapping client know when a point has been selected on the chart
        */
        basicSearchChanged : function () {},    
        advanceSearchChanged : function () {}  
    });
}); 
require([
    "esri/map",
    "esri/arcgis/utils",
    "esri/geometry/Point",
    "dojo/_base/declare",
    "dojo/on",
    "dojo/touch",
    "dojo/dom",
    "dojo/_base/lang",
    "dojo/dom-style",
    "dojo/query",
    "dojo/NodeList-traverse",
    "dojo/dom-class",
    "dojo/domReady!"],
    function (Map, EsriUtils, Point, declare, on, touch, dom, lang, style, query, nodecols, domClass) {

        return declare("BootstrapMap", null,{
            constructor: function (divId, options){
            },
                        // BootstrapMap Class Public Functions
            create: function (divId, options) {
                var smartResizer,
                    mapOut;
                if (divId && options) {
                    smartResizer = new this._smartResizer(divId, options);
                    mapOut = smartResizer.createMap();
                    mapOut._smartResizer = smartResizer;
                    return mapOut;
                }
            },
            createWebMap: function (webMapId, divId, options) {
                var smartResizer,
                    deferredOut;
                if (divId && options) {
                    smartResizer = new this._smartResizer(divId, options);
                    deferredOut = smartResizer.createWebMap(webMapId);
                    return deferredOut;
                }
            },
            destroy: function (map) {
                function _disconnect(resizer) {
                    if (resizer._handles) {
                        var i = resizer._handles.length;
                        while (i--) {
                            resizer._handles[i].remove();
                            resizer._handles.splice(i, 1);
                        }
                    }
                }
                if (map && map._smartResizer) {
                    _disconnect(map._smartResizer);
                }
            },
                        // SmartResizer Class Functions
            _smartResizer: declare(null, {
                constructor: function (mapDivId, options) {
                    this._map = null;
                    this._autoRecenterDelay =  50;
                    this._popupRecenterDelayer = 150;
                    this._popupPosition = "top";
                    this._popupBlocked = false;
                    this._visible = true;
                    this._visibilityTimer = null;
                    this._mapDeferred = null;
                    // Default bootstrap map options
                    this._autoRecenter = options.autoRecenter || true;
                    this._responsiveResize = options.responsiveResize || true;
                    // Map properties
                    this._mapDivId = mapDivId;
                    this._mapDiv = dom.byId(mapDivId);
                    this._mapStyle = style.get(this._mapDiv);
                    // Map options
                    this._options = lang.mixin(options, {});
                    // Events
                    this._handles = [];
                },
                // Create a new map
                createMap: function () {
                    this._setMapDiv(false);
                    // Need to be false in responsive mode
                    if (this._responsiveResize) {
                        lang.mixin(this._options,
                            {
                                smartNavigation: false,
                                autoResize: false
                            });
                    }
                    this._map = new Map(this._mapDivId, this._options);
                    this._setPopup();
                    this._bindEvents();
                    this._mapDiv.__map = this._map;
                    return this._map;
                },
                // Create the webmap for client
                createWebMap: function (webMapId) {
                    var deferred,
                        myselfAsAResizer,
                        getDeferred;
                    // Get DIV
                    this._setMapDiv(false);
                    // Get options and pass them on
                    if (!this._options.hasOwnProperty("mapOptions")) {
                        this._options.mapOptions = {};
                    }
                    // Need to be false in responsive mode
                    if (this._responsiveResize) {
                        lang.mixin(this._options.mapOptions, {
                            smartNavigation: false,
                            autoResize: false
                        });
                    }
                    // Create the webmap
                    deferred = EsriUtils.createMap(webMapId, this._mapDivId, this._options);
                    this._mapDeferred = deferred;
                    myselfAsAResizer = this;
                    // Callback to get map
                    getDeferred = function (response) {
                        this._map = response.map;
                        this._setPopup();
                        this._bindEvents();
                        this._mapDiv.__map = this._map;
                        this._smartResizer = myselfAsAResizer;
                    };
                    this._mapDeferred.then(lang.hitch(this, getDeferred));
                    return deferred;
                },
                _setPopup: function () {
                    domClass.add(this._map.infoWindow.domNode, "light");
                },
                // Avoid undesirable behaviors on touch devices
                _setTouchBehavior: function () {
                    // Add desireable touch behaviors here
                    if (this._options.hasOwnProperty("scrollWheelZoom")) {
                        if (this._options.scrollWheelZoom) {
                            this._map.enableScrollWheelZoom();
                        } else {
                            this._map.disableScrollWheelZoom();  // Prevent slippy map on scroll
                        }
                    } else {
                        // Default
                        this._map.disableScrollWheelZoom();
                    }
                    // Remove 300ms delay to close infoWindow on touch devices
                    on(query(".esriPopup .titleButton.close"), touch.press, lang.hitch(this,
                        function () {
                            this._map.infoWindow.hide();
                        }));
                },
                // Set up listeners 
                _bindEvents: function () {
                    var setTouch,
                        setInfoWin,
                        debounce,
                        timeout,
                        visible,
                        resizeWin,
                        recenter,
                        timer;
                    if (!this._map) {
                        console.error("BootstrapMap: Invalid map object. Please check map reference.");
                        return;
                    }
                    // Touch behavior
                    setTouch = function () {
                        this._setTouchBehavior();
                    };
                    if (this._map.loaded) {
                        lang.hitch(this, setTouch).call();
                    } else {
                        this._handles.push(on(this._map, "load", lang.hitch(this, setTouch)));
                    }
                    // InfoWindow restyle and reposition
                    setInfoWin = function () {
                        this._map.infoWindow.anchor = this._popupPosition;
                        var updatePopup = function (obj) {
                            var pt = obj._map.infoWindow.location;
                            if (pt && !obj._popupBlocked) {
                                obj._popupBlocked = true;
                                // Delay the map re-center
                                window.setTimeout(function () {
                                    obj._repositionMapForInfoWin(pt);
                                    obj._popupBlocked = false;
                                }, obj._popupRecenterDelayer);
                            }
                        };
                        this.counter = 0;
                        // When map is clicked (no feature or graphic)
                        this._map.on("click", lang.hitch(this, function () {
                            if (this._map.infoWindow.isShowing) {
                                updatePopup(this);
                            }
                        }));
                        // When graphics are clicked
                        on(this._map.graphics, "click", lang.hitch(this, function () {
                            updatePopup(this);
                        }));
                        // When infowindow appears
                        on(this._map.infoWindow, "show", lang.hitch(this, function () {
                            updatePopup(this);
                        }));
                        // FeatureLayers selection changed - No longer needed at 3.9
                        // on(this._map.infoWindow, "selection-change", lang.hitch(this, function (g) {
                        //   updatePopup(this);
                        // }));
                    };
                    // If the map is already loaded, eg. webmap, just hitch up
                    if (this._map.loaded) {
                        lang.hitch(this, setInfoWin).call();
                    } else {
                        this._handles.push(on(this._map, "load", lang.hitch(this, setInfoWin)));
                    }
                    // Debounce window resize
                    debounce = function (func, threshold, execAsap) {
                        return function debounced() {
                            var obj = this,
                                args = arguments;
                            function delayed() {
                                if (!execAsap) {
                                    func.apply(obj, args);
                                }
                                timeout = null;
                            }
                            if (timeout) {
                                clearTimeout(timeout);
                            } else if (execAsap) {
                                func.apply(obj, args);
                            }
                            timeout = setTimeout(delayed, threshold || 100);
                        };
                    };
                    // Responsive resize
                    resizeWin = debounce(this._setMapDiv, 100, false);
                    this._handles.push(on(window, "resize", lang.hitch(this, resizeWin)));
                    // Auto-center map
                    if (this._autoRecenter) {
                        recenter = function () {
                            this._map.__resizeCenter = this._map.extent.getCenter();
                            timer = function () {
                                this._map.centerAt(this._map.__resizeCenter);
                            };
                            setTimeout(lang.hitch(this, timer), this._autoRecenterDelay);
                        };
                        // Listen for container resize
                        this._handles.push(on(this._map, "resize", lang.hitch(this, recenter)));
                    }
                },
                // Check if the map is really visible
                _getMapDivVisibility: function () {
                    return this._mapDiv.clientHeight > 0 || this._mapDiv.clientWidth > 0;
                },
                // Check map visiblity
                _checkVisibility: function () {
                    var visible = this._getMapDivVisibility();
                    if (this._visible !== visible) {
                        if (visible) {
                            this._setMapDiv(true);
                        }
                    }
                },
                // Ensure the map resizes if div is hidden
                _controlVisibilityTimer: function (runTimer) {
                    if (runTimer) {
                        // Start a visibility change timer
                        this._visibilityTimer = setInterval(lang.hitch(this, function () {
                            this._checkVisibility();
                        }), 200);
                    } else {
                        // Stop timer we have checking for visibility change
                        if (this._visibilityTimer) {
                            clearInterval(this._visibilityTimer);
                            this._visibilityTimer = null;
                        }
                    }
                },
                // Set new map height
                _setMapDiv: function (forceResize) {
                    if (!this._mapDivId || !this._responsiveResize) {
                        return;
                    }
                    var visible,
                        windowH,
                        bodyH,
                        room,
                        mapH,
                        colH,
                        mh1,
                        mh2,
                        inCol;
                    // Get map visibility
                    visible = this._getMapDivVisibility();
                    if (this._visible !== visible) {
                        this._visible = visible;
                        this._controlVisibilityTimer(!visible);
                    }
                    // Fill page with the map or match row height
                    if (this._visible) {
                        //windowH = window.innerHeight;
                        windowH = document.documentElement.clientHeight;
                        bodyH = document.body.clientHeight;
                        room = windowH - bodyH;
                        mapH = this._calcMapHeight();
                        colH = this._calcColumnHeight(mapH);
                        mh1 = mapH + room;
                        mh2 = 0;
                        inCol = false;
                        // Resize to neighboring column or fill page
                        if (mapH < colH) {
                            mh2 = (room > 0) ? colH + room : colH;
                            inCol = true;
                        } else {
                            mh2 = (mh1 < colH) ? colH : mh1;
                            inCol = false;
                        }
                        // Expand map height
                        style.set(this._mapDivId, {
                            "height": mh2 + "px",
                            "width": "auto"
                        });
                        // Force resize and reposition
                        if (this._map && forceResize && this._visible) {
                            this._map.resize();
                            this._map.reposition();
                        }
                        //console.log("Win:" + windowH + " Body:" + bodyH + " Room:" + room + " 
                        // OldMap:" + mapH + " Map+Room:" + mh1 + " NewMap:" + mh2 + " ColH:" + 
                        // colH + " inCol:" + inCol);
                    }
                },
                // Current height of map
                _calcMapHeight: function () {
                    //var s = style.get(e);
                    var s = this._mapStyle,
                        p = parseInt(s.paddingTop, 10) + parseInt(s.paddingBottom, 10) || 0,
                        g = parseInt(s.marginTop, 10) + parseInt(s.marginBottom, 10) || 0,
                        bodyH = parseInt(s.borderTopWidth, 10) + parseInt(s.borderBottomWidth, 10) || 0,
                        h = p + g + bodyH + this._mapDiv.clientHeight;
                  return h;
                },
                // Get the column height around the map 
                _calcColumnHeight: function (mapH) {
                    var i,
                        col,
                        colH = 0,
                        cols = query(this._mapDiv).closest(".row").children("[class*='col']"),
                        containsMap;
                    if (cols.length) {
                        for (i = 0; i < cols.length; i++) {
                            col = cols[i];
                            // Avoid the map in column calculations
                            containsMap = query("#" + this._mapDivId, col).length > 0;
                            if ((col.clientHeight > colH) && !containsMap) {
                                colH = col.clientHeight;
                            }
                        }
                    }
                    return colH;
                },
                // Reposition map to fix popup
                _repositionMapForInfoWin: function (graphicCenterPt) {
                    // Determine the upper right, and center, coordinates of the map
                    var maxPoint = new Point(this._map.extent.xmax, this._map.extent.ymax, this._map.spatialReference),
                        centerPoint = new Point(this._map.extent.getCenter()),
                        // Convert to screen coordinates
                        maxPointScreen = this._map.toScreen(maxPoint),
                        centerPointScreen = this._map.toScreen(centerPoint),
                        graphicPointScreen = this._map.toScreen(graphicCenterPt), // Points only
                        // Buffer
                        marginLR = 10,
                        marginTop = 3,
                        infoWin = this._map.infoWindow.domNode.childNodes[0],
                        infoWidth = infoWin.clientWidth,
                        infoHeight = infoWin.clientHeight + this._map.infoWindow.marginTop,
                        // X
                        lOff = graphicPointScreen.x - infoWidth / 2,
                        rOff = graphicPointScreen.x + infoWidth / 2,
                        l = lOff - marginLR < 0,
                        r = rOff > maxPointScreen.x - marginLR,
                        // Y
                        yOff = this._map.infoWindow.offsetY,
                        tOff = graphicPointScreen.y - infoHeight - yOff,
                        t = tOff - marginTop < 0;
                    // X
                    if (l) {
                        centerPointScreen.x -= (Math.abs(lOff) + marginLR) < marginLR ? marginLR : Math.abs(lOff) + marginLR;
                    } else if (r) {
                        centerPointScreen.x += (rOff - maxPointScreen.x) + marginLR;
                    }
                    // Y
                    if (t) {
                        centerPointScreen.y += tOff - marginTop;
                    }

                    //Pan the ap to the new centerpoint  
                    if (r || l || t) {
                        centerPoint = this._map.toMap(centerPointScreen);
                        this._map.centerAt(centerPoint);
                    }
                }
            }) // _smartResizer
            
        })
});
require([
        "dojo/dom",
        "dojo/dom-style",
        "dojo/on",
        "dojo/query",
        "dojo/_base/Color",
         "dojo/dom-construct",
        "dojo/domReady!"],
    function (dom,domStyle, on, query,Color,domConstruct) {
    
        //When the Filter Link is clicked, we show those extra parameters
        //User wanted the filters to show up by default.
        //dom.byId("filterLink").onclick = showFilterParameters;
        resizeContentAreas();
        //When the Advanse Search Link is clicked, we open a new window form to do the search.
        //dom.byId("advanceLink").onclick = showAdvanceParameters;
    
        function showFilterParameters(){
            //dom.byId("defaultfilter").set
            $("#defaultfilter").show();
            $("#filterLink").hide();
            //domStyle.set(dom.byId("defaultfilter"),"display","inline");
            //domStyle.set(dom.byId("filterLink"),"display","none");
        }
        function resizeContentAreas() {
            var height = $(window).height();
            
            $('#searchListContainer').height(height - 70);
            $('#mapContainer').height(height - 70);
        }
    
        window.onresize = resizeContentAreas; 
    
        function checkTextField(){
            // If the value of id search_input is not empty show id search_results otherwise hide it
            if ($('#search_input').val() != '')
            {
                $('#search_results').show();
            }
            else
            {
                $('#search_results').hide();
            }
        }    
});
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
