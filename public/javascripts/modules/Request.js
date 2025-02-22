import Base from "./BaseClass.js"

export class Request extends Base{
    constructor(symbol, item ){
        super();
        this.symbol = symbol;
        this.item = item;
        this.urlStem = `/api/fetch?symbol=${symbol}`;
        this.getData =  getData;
        
        try {
            return getData.call(this, symbol, item);
        } catch (error) {
            console.log("Something went wrong with the request -- Request Method. See: ", error);
        }
        
    }
}


async function getData (symbol, item, place){
    console.log("trying the requests for statements data");
    
    let response = await fetch(this.urlStem);
    let data =  await response.json();
    console.log(data);
                    
    if(item == "price"){
        // data = data.companiesPriceList[0].price;
        data = data[0].price;
    }
    return data;
}
