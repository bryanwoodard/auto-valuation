import Base from "./BaseClass.js"

export class Request extends Base{
    constructor(symbol, item ){
        super();
        this.symbol = symbol;
        this.item = item;
        this.urlStem = `/api/fetch?symbol=${symbol}`;
        this.getData =  getData;

        return getData.call(this, symbol, item);
    }
}


async function getData (symbol, item, place){
    try{
        console.log("trying the requests for statements");
        
        let response = await fetch(this.urlStem);
        let data =  await response.json();
        console.log(data);
                       
        if(item == "price"){
            // data = data.companiesPriceList[0].price;
            data = data[0].price;
        }

        return data;
        
    }catch(e){
        alert(`${symbol} does not look to be a valid symbol.  Please try again`)
        console.error(`Something went wrong with the request. See: ${e}`);
    }
    
}
