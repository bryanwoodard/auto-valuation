import Base from "./BaseClass.js"


export class FinancialInfo extends Base{
    constructor(symbol){
        super();
        this.symbol = symbol;
        
        return {msg:"this is from the finfo class"} ;
    }
}