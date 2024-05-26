export const init = function(){
    console.log("initiliazed");
    document.getElementById("ticker").addEventListener("change", AVclass.Utils.getStatments);
    document.getElementById("submit").addEventListener("click", AVclass.Utils.process)
    //console.log("attached submit handler");

}