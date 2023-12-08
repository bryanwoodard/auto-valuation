// functions to fetch and retrieve the object.

function fetch(symbol){

    function grab(statement){
        let apiURL = `https://financialmodelingprep.com/api/v3/${statement}/${symbol}?period=annual&${apiKey}`;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", apiURL, false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                // The request was successful
                var resp = JSON.parse(xhr.responseText);
                if(statement == "income-statement" ){
                    statementsObj.income = resp;
                }else if(statement == "cash-flow-statement"){
                    statementsObj.cashflow = resp;
                }else if(statement == "balance-sheet-statement"){
                    statementsObj.balancesheet = resp;
                }else if(statement == "key-metrics") {
                    statementsObj.keymetrics = resp;
                }else{
                    statementsObj.ratios = resp;
                }
                //console.log(resp);
            } else {
                // The request failed
                console.log("bad request");
            }
        };
    
        xhr.send();
        
    } 
    
    var statementsObj = {};
    let apiKey = "apikey=Jv4pLAquV4LEKSBYbYaYZXUm6cnVb1rc";
    let statements = ["income-statement", 
        "balance-sheet-statement", 
        "cash-flow-statement", 
        "key-metrics",
        "ratios"
    ];
    statements.forEach(grab);
    /*for (let i = 0; statements.length <5; i++){
        grab(statements[i]);
    }*/

    return statementsObj;

}




//next steps transform the fetched obj 
//take the data that is fetched
function prepCurrent(obj){
    let statementsObj = obj;
    let incomeObj = statementsObj.income[0];
    let cashflowObj = statementsObj.cashflow[0];
    let balanceObj = statementsObj.balancesheet[0];
    let keyMetricsObj = statementsObj.keymetrics[0];
    
    /* Prob cut out below
    let finCalc = {}
    finCalc.returnOn = (cashflow,base)=>{
        // cashflow = fcf || deps|| operating cashflow etc...
        // Base = bookvalue || capital || assets || 
       return cashflow/base;
    }*/

    // example of object
    var keyStatsCurrent = {
        "ROE(cf)": keyMetricsObj.freeCashFlowPerShare/keyMetricsObj.bookValuePerShare,
        "ROE(deps)": incomeObj.epsdiluted/keyMetricsObj.bookValuePerShare,
        "Price/FCF": keyMetricsObj.pfcfRatio,
        "Price/Diluted EPS": keyMetricsObj.peRatio /*using basic-- edit to include "price" value*/ ,
        "ROC(cf)": cashflowObj.freeCashFlow/(balanceObj.longTermDebt + balanceObj.totalEquity ) ,
        "ROC(deps)": (incomeObj.epsdiluted*incomeObj.weightedAverageShsOutDil)/(balanceObj.longTermDebt + balanceObj.totalEquity ),
        "EV/Ebitda": keyMetricsObj.enterpriseValueOverEBITDA
    }

    console.log("current stats", keyStatsCurrent);

    return keyStatsCurrent;



}

/*var fetched = fetch("AAPL");
console.log("this is fetched",fetched);
prepCurrent(fetched);*/