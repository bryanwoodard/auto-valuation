//I dont think this script is being used.  see if it can be deleted.

export const process = function(){
    console.log("process is starting bw");
    console.log(this);

    let form = document.querySelector("form");
    let processingObj = {};

    for(let i = 0; i< form.length-1; i++){
        let inputValue = form[i].value;
        let inputLabel = form[i].id;
       
        processingObj[inputLabel] = inputValue;
    }
    
    console.log(processingObj);

}