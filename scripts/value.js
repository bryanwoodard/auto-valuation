// script to use the data provided and make a valuations


/*
how to value a company

- determine future valuation metric: op cash flow/total capital or ROE
- derive future multiple
- derive future price
- get the present value based on current price based on desired return (buy price)
- get the fair value based on the current expectations when return is equal to wacc

*/
function value(metric, years, erp, beta,  currentPrice, growthRate, rfr){

    let calcFutureValue = function(metric, growthRate, years){
        //console.log(metric * Math.pow((1+growthRate),years));
        return (metric * Math.pow((1+growthRate),years));
    }

    let calcValuationMultiple = function(beta, erp, rfr ){
        //returns capm ... also think about including cost of debt and wacc as well
        //rfr = .05;
        return 1/(rfr + (beta*erp));
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

    let valuationObj = {}

    let futureMetric = calcFutureValue(metric,growthRate, years);
    let valuationMultiple = calcValuationMultiple(beta, erp, rfr);
    let futurePrice = calcFuturePrice(futureMetric, valuationMultiple);
    let fairValueRate = 1/(calcValuationMultiple(beta,erp, rfr));
    
    valuationObj.futurePrice = futurePrice;
    valuationObj.futureMetric = futureMetric;
    valuationObj.valuationMultiple = valuationMultiple;
    valuationObj.compoundedReturnCurrent = calcCompoundRate(futurePrice, currentPrice, years );
    valuationObj.buyPrice = calcPresentValue(futurePrice, .15, years);
    valuationObj.fairValue = calcPresentValue(futurePrice, fairValueRate, years);
    

    console.log(JSON.stringify(valuationObj));
    return valuationObj;

}
//not returning what id expect > come back to it
value(1, 10, .04, 1.2, 10, .10, .05);
