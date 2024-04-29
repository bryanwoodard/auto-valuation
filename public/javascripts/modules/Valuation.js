//import Base from "./BaseClass.js"

export class Valuation {
    constructor( valuationData ){
        this.beta = valuationData.beta;
        this.desiredReturn = valuationData.desiredReturn;
        this.equityRiskPremium = valuationData.equityRiskPremium;
        this.growthCaseScenarios = valuationData.growthCaseScenarios;
        this.probabilities = valuationData.probabilities;
        this.terminalGrowthRate = valuationData.terminalGrowthRate;
        this.years = years;
        this.valuationBasis = valuationData.valuationBasis;
        this.riskFreeRate = valuationData.riskFreeRate;
        this.price = AVclass.price;
        this.fcfShare = AVclass.keyMetrics.freeCashFlowPerShare;
        this.niPerShare = AVclass.keyMetrics.netIncomePerShare;
        this.equityPercentage = AVclass.dcf[0].equityWeighting;
        this.debtPercentage = AVclass.dcf[0].debtWeighting;
        this.costofDebt = AVclass.dcf[0].afterTaxCostOfDebt;
        this.costofEquity = AVclass.Dictionary.getCostOfEquity(this.riskFreeRate, this.beta, this.riskFreeRate);
        this.wacc = (this.costofEquity * this.equityPercentage) + (this.costofDebt * this.debtPercentage)
        this.fvWacc = AVclass.dcf[0].wacc;
        this.fvTerminalGrowthRate = AVclass.dcf[0].longTermGrowthRate;
        this.metric = this.valuationBasis = "fcf" ? this.fcfShare : this.niPerShare
        
        //Functionality
        this.consolidate = consolidate;
        this.process = process;

        return this.process.call(this);
        
    }
    
}


const process = function(){
    var probabalisticValuations = [];

    const dict = AVclass.Dictionary; 

    for (var i = 0; i<this.growthCaseScenarios.length; i++ ){
        // return 3 valuation objects in one object.
        let valuationObj = {};

        let terminalModifier = 1;
        
        if(i < 1){
            terminalModifier = 1.2
        }else if(i > 1){
            terminalModifier = .6
        }

        //let costOfEquity = dict.getCostOfEquity(this.riskFreeRate, this.beta, this.riskFreeRate);
        
        //FIXME; DEFINE THE METRIC VALUE TO USE AS A START I.E THE FCF OR EPS NUMBER.
        let futureMetric = dict.getFutureValue(this.metric, growthCaseScenarios[i], years);
        let terminalMultiple = dict.getTerminalMultiple(this.beta, this.equityRiskPremium, this.riskFreeRate, this.terminalGrowthRate) * terminalModifier;
        let futurePrice = dict.getFuturePrice(futureMetric, terminalMultiple);
        let fvMultiple = 1/(this.fvWacc - this.fvTerminalGrowthRate);
    
        
        valuationObj.futurePrice = futurePrice;
        valuationObj.futureMetric = futureMetric;
        valuationObj.terminalMultiple = terminalMultiple ;
        valuationObj.compoundedReturnCurrent = dict.getRoR(futurePrice, this.price, this.years );

        valuationObj.buyPrice = dict.getPresentValue(futurePrice, this.desiredReturn, this.years); // add in factor to get desired return
        valuationObj.fairValue = dict.getPresentValue(futurePrice, 1/fvMultiple, years);
        //valuationObj.growthRateOfMetric = growthRate * growthCaseScenarios[i];
        

        console.log(`scenario ${i} = `, valuationObj);
        probabalisticValuations.push(valuationObj);
    }
    
    let singularScenario = consolidate.call( this, probabalisticValuations, probabilities);

    let combinedScenarios = {singularScenario, probabalisticValuations}

    console.log("Combined Scenario = ", combinedScenarios );

    
    return {combinedScenarios} ;
}


const consolidate = function(scenarios, probabilities){
    var combined = {};
    var keys = [];

    // get the keys and store then in an array
    for(key in scenarios[0]){
        keys.push(key);
    }
    for (let i=0; i < keys.length ; i++){
       
        let keysVal = [];
       
        for (let j=0; j < scenarios.length; j++){
            keysVal.push(scenarios[j][keys[i]]);
            
        }
        //values.push(keysVal);
        let keysValBestPart = keysVal[0] * probabilities[0];
        let keysValNormal = keysVal[1] * probabilities[1];
        let keysValWorst = keysVal[2] * probabilities[2];

        let keysValConsolidated = keysValBestPart + keysValNormal + keysValWorst; 
        combined[keys[i]] = keysValConsolidated;
    }
    return combined;
      
}