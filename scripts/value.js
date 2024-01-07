/*Template engine
sample obj
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


*/



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


// functions to fetch and retrieve the object.
    // Grabs all of the statements into one big obj
function fetch(symbol){

    function grab(statement){
        if(statement == "price"){
            var apiURL = `https://financialmodelingprep.com/api/v3/stock/real-time-price/${symbol}?${apiKey}`;
        }else{
            var apiURL = `https://financialmodelingprep.com/api/v3/${statement}/${symbol}?period=annual&${apiKey}`;
        }

        
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
                }else if(statement == "price") {
                    statementsObj.price = resp;
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
        "ratios",
        "price"
    ];
    statements.forEach(grab);
    return statementsObj;
}
//take the statements that are fetched and transform them into a flat simple obj
function prepCurrent(obj){
    let statementsObj = obj;
    let incomeObj = statementsObj.income[0];
    let cashflowObj = statementsObj.cashflow[0];
    let balanceObj = statementsObj.balancesheet[0];
    let keyMetricsObj = statementsObj.keymetrics[0];
    let ratios = statementsObj.ratios[0];  
    let price = statementsObj.price.companiesPriceList[0].price;

    // example of object
    var keyStatsCurrent = {
        "ROE(cf)": keyMetricsObj.freeCashFlowPerShare/keyMetricsObj.bookValuePerShare,
        "ROE(deps)": incomeObj.epsdiluted/keyMetricsObj.bookValuePerShare,
        "Price/FCF": keyMetricsObj.pfcfRatio,
        "Price/Diluted EPS": keyMetricsObj.peRatio /*using basic-- edit to include "price" value*/ ,
        "ROC(cf)": cashflowObj.freeCashFlow/(balanceObj.longTermDebt + balanceObj.totalEquity ) ,
        "ROC(deps)": (incomeObj.epsdiluted*incomeObj.weightedAverageShsOutDil)/(balanceObj.longTermDebt + balanceObj.totalEquity ),
        "EV/Ebitda": keyMetricsObj.enterpriseValueOverEBITDA,
        "FreeCashFlow": ratios.freeCashFlowPerShare,
        "Price": price
    }

    console.log("current stats", keyStatsCurrent);

    return keyStatsCurrent;
}
/*
    script to use the data provided and make a valuations

    how to value a company
        - determine future valuation metric: op cash flow/total capital or ROE
        - derive future multiple
        - derive future price
        - get the present value based on current price based on desired return (buy price)
        - get the fair value based on the current expectations when return is equal to wacc

*/
function value(metric, years, erp, beta,  currentPrice, growthRate, rfr, terminalGrowthRate, growthCaseScenarios, desiredReturn, probabilities){


    let calcFutureValue = function(metric, growthRate, years){
        //console.log(metric * Math.pow((1+growthRate),years));
        return (metric * Math.pow((1+growthRate),years));
    }

    let calcTerminalMultiple = function(beta, erp, rfr ){
        //returns capm ... also think about including cost of debt and wacc as well
        //rfr = .05;
        return 1/( (rfr + (beta*erp)) - terminalGrowthRate );
    }

    let calcFuturePrice = function(futureMetric, multiple){
        return (futureMetric * multiple);
    }

    let calcPresentValue = function(futurePrice, rate, years){
        //reuse for fairvalue as well
        return (futurePrice/Math.pow((1+rate),years));
    }

    let calcCompoundRate = function(futurePrice, currentPrice, years){
        return (Math.pow((futurePrice/currentPrice), (1/years)) - 1);
    }

    var probabalisticValuations = {
        best:{},
        normal:{},
        worst:{}
    };

    for (var i = 0; i<growthCaseScenarios.length; i++ ){
        // return 3 valuation objects in one object.
        let valuationObj = {};

        let terminalModifier = 1;
        
        if(i < 1){
            terminalModifier = 1.2
        }else if(i > 1){
            terminalModifier = .6
        }

        let futureMetric = calcFutureValue(metric,growthRate * growthCaseScenarios[i], years);
        let terminalMultiple = calcTerminalMultiple(beta, erp, rfr) * terminalModifier;
        let futurePrice = calcFuturePrice(futureMetric, terminalMultiple);
        let fairValueRate = 1/(calcTerminalMultiple(beta,erp, rfr));
        
        valuationObj.futurePrice = futurePrice;
        valuationObj.futureMetric = futureMetric;
        valuationObj.terminalMultiple = terminalMultiple ;
        valuationObj.compoundedReturnCurrent = calcCompoundRate(futurePrice, currentPrice, years );
        valuationObj.buyPrice = calcPresentValue(futurePrice, desiredReturn, years); // add in factor to get desired return
        valuationObj.fairValue = calcPresentValue(futurePrice, fairValueRate, years);
        valuationObj.growthRateOfMetric = growthRate * growthCaseScenarios[i];
        

        console.log(`${Object.keys(probabalisticValuations)[i]} scenario = `, valuationObj);
        probabalisticValuations[Object.keys(probabalisticValuations)[i]] = valuationObj;
    }

    return probabalisticValuations


    // let valuationObj = {};

    // let futureMetric = calcFutureValue(metric,growthRate, years);
    // let terminalMultiple = calcTerminalMultiple(beta, erp, rfr);
    // let futurePrice = calcFuturePrice(futureMetric, terminalMultiple);
    // let fairValueRate = 1/(calcTerminalMultiple(beta,erp, rfr));
    
    // valuationObj.futurePrice = futurePrice;
    // valuationObj.futureMetric = futureMetric;
    // valuationObj.terminalMultiple = terminalMultiple;
    // valuationObj.compoundedReturnCurrent = calcCompoundRate(futurePrice, currentPrice, years );
    // valuationObj.buyPrice = calcPresentValue(futurePrice, .15, years);
    // valuationObj.fairValue = calcPresentValue(futurePrice, fairValueRate, years);
    

    // console.log("valuation obj = ", valuationObj);
    // return valuationObj;

}

//========== Where the actual work happens ====================
/*var fetched = fetch("now");
var keyStats= prepCurrent(fetched);
template(keyStats);

template(value(keyStats["FreeCashFlow"], 10, .04, 1.35, 689.06, keyStats["ROC(cf)"]*.7, .05, .05 ));
*/

function analyze(){
    let form = document.querySelector("form");
    let processingObj = {};

    for(let i = 0; i< form.length-1; i++){
        let inputValue = form[i].value;
        let inputLabel = form[i].id;
       
        processingObj[inputLabel] = inputValue;
    }
    
    console.log(processingObj);

    var ticker = processingObj.ticker;

    var fetched = fetch(ticker);
    var keyStats= prepCurrent(fetched);

    var valuationLabel = processingObj.valuationMetric; // add entry into key stats object to include Diluted eps start value ... like freecashflow.
    var years = Number(processingObj.years);
    var valuationMetric = Number(keyStats[valuationLabel]);
    var erp = Number(processingObj.erp);
    var beta = Number(processingObj.beta);
    var price = keyStats.Price;
    var growthRate = valuationLabel == "FreeCashFlow"? keyStats["ROC(cf)"]: keyStats["ROC(deps)"] ;
    var rfr = Number(processingObj.rfr);
    var terminalGrowthRate = Number(processingObj.tgr);
    var bestGrowth = Number(processingObj.bestGrowth);
    var normalGrowth = Number(processingObj.normalGrowth);
    var worstGrowth = Number(processingObj.worstGrowth);

    var growthCaseScenarios = [bestGrowth, normalGrowth, worstGrowth];

    var desiredReturn = Number(processingObj.desiredReturn);

    var probabilities = [processingObj.bestProb, processingObj.normalProb, processingObj.worstProb]



    
    template(keyStats);
    template(value(valuationMetric, years, erp, beta, price, growthRate, rfr, terminalGrowthRate, growthCaseScenarios, desiredReturn, probabilities ));
    

}



/*
Next  long term steps;
    - build the option to use the specific metric values (cashflow or eps)
    - build in option to set own expected grwoth rate
    - build in option to specify dilution and buybacks.
    - build the option to output multiple scenarios (good normal bad) with specific probs
    - add in error handling
    - build in handling of negative values.
    - build in functionality to show average return ratios for last 5 yrs
    - eleminate all the fucntion declarations in value object... set vals as params
    - make pretty
    - build to use cash from operations, and to set the expected capex percentage.
    - add functionality to remove the elements on page if any when running another valuation


    Immediate Next steps:
        - add capability to use diluted eps.  see notes on line 249
        - add functionailty to consolidate scenarios into one buy price and display .
        - add to template function a check to see if the key contains an object and display that 
            - to fix the [object object] showing for scenarios.

*/