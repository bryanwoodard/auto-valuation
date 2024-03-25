export const Utils = {
    template: function newTemplate (divId, object){
    
        function makeWords(varName){
            const text = varName;
            const result = text.replace(/([A-Z])/g, "$1");
            const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            return finalResult;
        }
        
        let location = document.getElementById(divId);
        
        if (location.childNodes){
            location.innerHTML= null;
        }
    
        function createElement(key){
            let newElement = document.createElement("p");
            var value = object[key];
            
            if(/*object[key] < 1 &&*/ key.includes("RO") || key.includes("return")|| key.includes("rate")){
                value = value * 100
                value = value.toFixed(2) + "%";
            } else {
                value = value.toFixed(2);
            }
    
            newElement.innerText = `${makeWords(key)}: ${value}`;
            location.append(newElement);
        }
    
        for (key in object){
            createElement(key);
        }
    },
    validate: function (){
        let fields = document.querySelectorAll("form input");
       
        for(let i = 0; i<fields.length ; i++){
            if(fields[i].value == false){
                return false;
            } else {
                return true;
            }
        }
    },
    

};