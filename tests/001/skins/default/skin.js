

// HELPER FUNCTIONS
    // import stylesheet
        function importStylesheet(fileHref){
            var tag = document.createElement("link");
            var attribute = document.createAttribute("rel");        
            attribute.value = "stylesheet";
            tag.setAttributeNode(attribute);
            attribute = document.createAttribute("href");
            attribute.value = fileHref;       
            tag.setAttributeNode(attribute);
            attribute = document.createAttribute("type");
            attribute.value = "text/css";       
            tag.setAttributeNode(attribute);
            document.getElementsByTagName("head")[0].appendChild(tag);
        } 

// DOCUMENT READY
    $(document).ready(function(){
        //import base stylesheet
            importStylesheet ("skins/base.css");
        
        
    })
    
