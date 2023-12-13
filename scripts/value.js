// script to use the data provided and make a valuations
/*
how to value a company

- determine future valuation metric: op cash flow/total capital or ROE
- derive future multiple
- derive future price
- get the present value based on current price based on desired return (buy price)
- get the fair value based on the current expectations when return is equal to wacc

*/
function value(metric, years, erp, beta,  currentPrice, growthRate, rfr, terminalGrowthRate){

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

    let valuationObj = {};

    let futureMetric = calcFutureValue(metric,growthRate, years);
    let terminalMultiple = calcTerminalMultiple(beta, erp, rfr);
    let futurePrice = calcFuturePrice(futureMetric, terminalMultiple);
    let fairValueRate = 1/(calcTerminalMultiple(beta,erp, rfr));
    
    valuationObj.futurePrice = futurePrice;
    valuationObj.futureMetric = futureMetric;
    valuationObj.terminalMultiple = terminalMultiple;
    valuationObj.compoundedReturnCurrent = calcCompoundRate(futurePrice, currentPrice, years );
    valuationObj.buyPrice = calcPresentValue(futurePrice, .15, years);
    valuationObj.fairValue = calcPresentValue(futurePrice, fairValueRate, years);
    

    console.log("valuation obj = ", valuationObj);
    return valuationObj;

}

//========== Where the actual work happens ====================
var fetched = fetch("goog");
var keyStats= prepCurrent(fetched);
template(keyStats);

template(value(keyStats["FreeCashFlow"], 5, .045, 1.05, 134.06, keyStats["ROC(cf)"], .05, .05 ));

/*
Next steps;
    - build the html interface to accept values -- on index
    - build the option to use the specific metric values (cashflow or eps)
    - build the option to output multiple scenarios
    - eleminate all the fucntion declarations in value object... set vals as params
    - make pretty

*/