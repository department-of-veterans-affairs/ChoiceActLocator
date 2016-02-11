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