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