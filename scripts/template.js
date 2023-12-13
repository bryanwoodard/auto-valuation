/*Template enginer
    
// pass in an object as a parm 
//take the object key and set the first value
//take the value of the object and display the value

*/

let data = [
	{
		"symbol": "AAPL",
		"revenuePerShare": 24.31727304755197,
		"netIncomePerShare": 6.154614437637777,
		"operatingCashFlowPerShare": 7.532762624088375,
		"freeCashFlowPerShare": 6.872425646259799,
		"cashPerShare": 2.9787931805221803
		
	}
]

let template = (obj)=>{
    
    let element = ``;
    let bodyElement = document.getElementsByTagName("body")[0];
    let parentDiv = document.createElement("div");
    bodyElement.appendChild(parentDiv);
    
    for (let key in obj){
        //debugger;
        let shortNum;
        if(typeof obj[key] == "number"){
            shortNum = obj[key].toString().substring(0,4); 
        } else{
            shortNum = obj[key];
        }
        element = element + `${key} : ${shortNum} \n`;

        let node = document.createElement("p");
        let content = document.createTextNode(`${key} : ${shortNum} \n`);
        parentDiv.appendChild(node).appendChild(content);

    };
}

