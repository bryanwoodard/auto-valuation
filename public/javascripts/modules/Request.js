import Base from "./BaseClass.js"

export class Request extends Base{
    constructor(symbol, item ){
        super();
        this.symbol = symbol;
        this.item = item;
        this.apiKey = "Jv4pLAquV4LEKSBYbYaYZXUm6cnVb1rc";
        this.urlStem = `https://financialmodelingprep.com/api/v3/`;
        this.priceURL = this.urlStem + `stock/real-time-price/${symbol}?apikey=${this.apiKey}`;
        this.statementUrl = this.urlStem +`${item}/${symbol}?period=annual&apikey=${this.apiKey}`;
        this.dcfUrl = `https://financialmodelingprep.com/api/v4/advanced_discounted_cash_flow?symbol=${symbol}&apikey=${this.apiKey}`
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
            data = data.companiesPriceList[0].price;
        }

        return data;
        
    }catch(e){
        alert(`${symbol} does not look to be a valid symbol.  Please try again`)
        console.error(`Something went wrong with the request. See: ${e}`);
    }
    
}
