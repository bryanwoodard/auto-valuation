import Base from "./BaseClass.js"

export class Statement extends Base{
    constructor(statementName){
        super();
        this.statementName = statementName;

        return {msg:"this is from the statement class"} ;


    }
}

