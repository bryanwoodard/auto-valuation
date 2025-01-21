// copied from the public methods
require('dotenv').config();
const apiKey = process.env.FMP;
const apiHost = process.env.STEM;
// console.log("api key = "+ apiKey)
// console.log(process.env)


module.exports = class Request {
    constructor(symbol, item ){
        this.symbol = symbol;
        this.item = item;
        this.apiKey = apiKey;
        this.urlStem = `${apiHost}/v3/`;
        this.priceURL = this.urlStem + `quote/${symbol}?apikey=${this.apiKey}`;
        this.statementUrl = this.urlStem +`${item}/${symbol}?period=annual&apikey=${this.apiKey}`;
        this.dcfUrl = `${apiHost}/v4/advanced_discounted_cash_flow?symbol=${symbol}&apikey=${this.apiKey}`
        this.getData =  getData;

        return getData.call(this, symbol, item);
    }
}


async function getData (symbol, item, place){
    const statements = ["income-statement", 
    "balance-sheet-statement", 
    "cash-flow-statement", 
    "key-metrics",
    "ratios",
    "price",
    "financial-statement-full-as-reported",
    "financial-growth",
    "advanced_discounted_cash_flow"
    ];

    if(!item){
        console.warn("Request called but with nothing to fetch");
        return false;
    }

    if(!statements.includes(item)){
        console.warn("Request called but with bad item to fetch");
        return false;
    }

    let choiceURl = "";
    if(item == "price"){
        choiceURl = this.priceURL;
    } else if (item == "advanced_discounted_cash_flow" ){
        choiceURl = this.dcfUrl;
    } else {
        choiceURl = this.statementUrl;
    }

    try{
        console.log("trying the request for " + item);
        
        let response = await fetch(choiceURl);
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
