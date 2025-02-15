function newTemplate (divId, object){
    
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
}

//form validation
function validate (){
    let fields = document.querySelectorAll("form input");
   
    for(let i = 0; i<fields.length ; i++){
        if(fields[i].value == false){
            return false;
        } else {
            return true;
        }
    }
}

function pullKeyStats(){

    //****** comment out for test case********
    var fetched = fetch(this.value);
    //var fetched = sample;
    window.keyStats = prepCurrent(fetched);
    //template(keyStats);
    newTemplate("quick-stats", keyStats );
}
// Grabs all of the statements into one big obj
function fetch(symbol){
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
    
    
}
//take the statements that are fetched and transform them into a flat simple obj
function prepCurrent(obj){
    let statementsObj = obj;
<<<<<<< HEAD
=======
    
>>>>>>> b3210357ee62f5c632d1d4c567f7014f8ce7015e
    let incomeObj = statementsObj.income[0];
    let cashflowObj = statementsObj.cashflow[0];
    let balanceObj = statementsObj.balancesheet[0];
    let keyMetricsObj = statementsObj.keymetrics[0];
    let ratios = statementsObj.ratios[0];  
    let price = statementsObj.price.companiesPriceList[0].price;

    // Object passed to value function
    var keyStatsCurrent = {
        "ROE(cf)": keyMetricsObj.freeCashFlowPerShare/keyMetricsObj.bookValuePerShare,
        "ROE(deps)": incomeObj.epsdiluted/keyMetricsObj.bookValuePerShare,
        "Price/FCF": keyMetricsObj.pfcfRatio,
        "Price/Diluted EPS": keyMetricsObj.peRatio /*using basic-- edit to include "price" value*/ ,
        "ROC(cf)": cashflowObj.freeCashFlow/(balanceObj.longTermDebt + balanceObj.totalEquity ) ,
        "ROC(deps)": (incomeObj.epsdiluted*incomeObj.weightedAverageShsOutDil)/(balanceObj.longTermDebt + balanceObj.totalEquity ),
        "EV/Ebitda": keyMetricsObj.enterpriseValueOverEBITDA,
        "FreeCashFlow": ratios.freeCashFlowPerShare,
        "Price": price,
        "dilutedEPS": incomeObj.epsdiluted
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
function value(metric, years, erp, beta,  currentPrice, growthRate, rfr, 
    terminalGrowthRate, growthCaseScenarios, desiredReturn, probabilities){


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

    let consolidate = function(scenarios, probabilities){
        var combined = {};
        var keys = [];

        // get the keys and store then in an array
        for(key in scenarios[0]){
            keys.push(key);
        }
        for (let i=0; i < keys.length ; i++){
           
            let keysVal = [];
           
            for (let j=0; j < scenarios.length; j++){
                keysVal.push(scenarios[j][keys[i]]);
                
            }
            //values.push(keysVal);
            let keysValBestPart = keysVal[0] * probabilities[0];
            let keysValNormal = keysVal[1] * probabilities[1];
            let keysValWorst = keysVal[2] * probabilities[2];

            let keysValConsolidated = keysValBestPart + keysValNormal + keysValWorst; 
            combined[keys[i]] = keysValConsolidated;
        }
        return combined;
          
    }

    var probabalisticValuations = [];

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
        

        console.log(`scenario ${i} = `, valuationObj);
        probabalisticValuations.push(valuationObj);
    }
    let singularScenario = consolidate(probabalisticValuations, probabilities);

    let combinedScenarios = {singularScenario, probabalisticValuations}

    console.log("Combined Scenario = ", combinedScenarios );

    //return combinedScenarios;
    newTemplate("consolidated", singularScenario );
    newTemplate("best", probabalisticValuations[0] );
    newTemplate("neutral", probabalisticValuations[1] );
    newTemplate("worst", probabalisticValuations[2] );

}

function analyze(){

    if (validate() == false){
        return alert("Please ensure all value are filled in");
    }

    let form = document.querySelector("form");
    let processingObj = {};

    for(let i = 0; i< form.length-1; i++){
        let inputValue = form[i].value;
        let inputLabel = form[i].id;
       
        processingObj[inputLabel] = inputValue;
    }
    
    console.log(processingObj);


    // Sets up the values to pass to value the company;
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

    // Display the raw data on the page
    //template(value(valuationMetric, years, erp, beta, price, growthRate, rfr, terminalGrowthRate, growthCaseScenarios, desiredReturn, probabilities ));
    value(valuationMetric, years, erp, beta, price, growthRate, rfr, terminalGrowthRate, growthCaseScenarios, desiredReturn, probabilities );

}






/*
Next  long term steps;
    - build in option to specify dilution and buybacks.
    - add in error handling
    - build in handling of negative values.
    - build in functionality to show average return ratios for last 5 yrs
    - make pretty
    - build to use cash from operations, and to set the expected capex percentage.
    - add functionality to remove the elements on page if any when running another valuation
    - clean up keystats object names
    - add functionality to fetch rates to inform risk free rate value in form

    Immediate: 
    + edit template function to 
        - add to side of form to display 1)combined output and 2)scenarios (all 3)
        - remove previously output valuations, and keystats obj if the submit button is clicked again or ticker changes.
    + use wacc instead of just cost of equity
    + factor in dividends to the compound return obj (maybe yield+growth? see how done in valuation workbook )
    + add 5 yr avg's to key stats obj
    + add tool tips
    + add intro


*/
