import Base from "./modules/base.js"

//const Base = require("./modules/base.js");

//document.onreadystatechange = alert("state changed")


window.AVclass = {
    Basic: Base,
}


    //your code here
    console.log("starting")
    window.thing = new Base("test");
    thing.append("Bryan");
    console.log(document.readyState);
    console.log(thing.toString());

