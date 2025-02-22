export const init = function(){
    console.log("initiliazing...");
    document.getElementById("ticker").addEventListener("change", AVclass.Utils.getStatements);
    document.getElementById("submit").addEventListener("click", AVclass.Utils.process)
}