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