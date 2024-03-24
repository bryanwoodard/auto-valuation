import Base from "./BaseClass.js"

export class Request extends Base{
    constructor(symbol, templateString ){
        super();
        this.symbol = symbol;
        this.templateString = templateString;

        return {msg:"this is from the request class"} ;


    }
}