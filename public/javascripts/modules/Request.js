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
        this.getData =  getData;

        return getData.call(this, symbol,item);
    }
}


async function getData (symbol, item){
    const statements = ["income-statement", 
    "balance-sheet-statement", 
    "cash-flow-statement", 
    "key-metrics",
    "ratios",
    "price"
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
    } else {
        choiceURl = this.statementUrl;
    }

    try{
        console.log("trying the request");
        
        let response = await fetch(choiceURl);
        let data =  await response.json();
        console.log(data);
                       
        return data;
        
    }catch(e){
        console.error(`Something went wrong with the request. See ${e}`);
    }
    
}


/*
why the fuck does this work but not the above:

var reqs = async function (symbol, item){
 	apiKey = "Jv4pLAquV4LEKSBYbYaYZXUm6cnVb1rc";
    urlStem = `https://financialmodelingprep.com/api/v3/`;
    priceURL = urlStem + `stock/real-time-price/${symbol}?apikey=${apiKey}`;
    statementUrl = urlStem +`${item}/${symbol}?period=annual&apikey=${apiKey}`;

    let response = await fetch(priceURL);
    let data =  await response.json();

    return data

}

var t = await reqs("now", "price");

console.log(t)

*/