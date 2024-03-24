import Base from "./BaseClass.js"

export class Valuation extends Base{
    constructor(financials, desiredReturn, expectedGrowth, terminalGrowth, years ){
        super();
        this.desiredReturn = desiredReturn;
        this.expectedGrowth = expectedGrowth;
        this.terminalGrowth = terminalGrowth
        this.years = years;


        
        return {msg:"this is from the valuation class"} ;
    }
    
}