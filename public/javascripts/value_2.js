import { Classes } from "./modules/Consolidated.js"


window.AVclass = {
    Classes,
     
}

AVclass.priceData = await new AVclass.Classes.Request("now", "price");
console.log(AVclass.priceData)