import Base from "./modules/base.js"


// ========= Make all these classes and object into modules ===================


class Valuation extends Base{
    constructor(financials, desiredReturn, expectedGrowth, terminalGrowth, years ){
        return {} ;
    }
    
}

/*includes things to be used in a Valuation like, symbol, price, valuation metric, expected growth rate, 
beta, terminal Growth Rate, equity risk premium

*/
class FinancialInfo extends Base{
    constructor(symbol){
        this.name = type;
        this
    }
}

//Contains raw financial statement data (per statement - multiple years)
class Statement extends Base{
    constructor(statementName){

    }
}


class Request{
    constructor(symbol, templateString ){

    }
}

//
const calculator = {
    presentValue,
    futureValue,
    rateOfReturn,
    wacc,
    costOfEquity,
    costOfCapital

}

const Utils = {}




