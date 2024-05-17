export const Utils = {
    template: function newTemplate (divId, object){
    
        function makeWords(varName){
            const text = varName;
            const result = text.replace(/([A-Z])/g, "$1");
            const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            return finalResult;
        }
        
        let location = document.getElementById(divId);
        
        if (location.childNodes){
            location.innerHTML= null;
        }
    
        function createElement(key){
            let newElement = document.createElement("p");
            var value = object[key];
            
            if(/*object[key] < 1 &&*/ key.includes("RO") || key.includes("return")|| key.includes("rate")){
                value = value * 100
                value = value.toFixed(2) + "%";
            } else {
                value = value.toFixed(2);
            }
    
            newElement.innerText = `${makeWords(key)}: ${value}`;
            location.append(newElement);
        }
    
        for (key in object){
            createElement(key);
        }
    },
    validate: function (){
        let fields = document.querySelectorAll("form input");
       
        for(let i = 0; i<fields.length ; i++){
            if(fields[i].value == false){
                return false;
            } else {
                return true;
            }
        }
    },
    getStatments: async function(){
        if(!AVclass) return false;

        let symbol = this.value.toUpperCase();
        AVclass.financials = {};
        AVclass.financials.statements = {};
        
        var financials = AVclass.financials;
        var statements = AVclass.financials.statements;

        statements.price = await new AVclass.Classes.Request(symbol, "price");
        statements.incomeStatements = await new AVclass.Classes.Request(symbol, "income-statement");
        statements.balanceSheets = await new AVclass.Classes.Request(symbol, "balance-sheet-statement");
        statements.cashflowStatements = await new AVclass.Classes.Request(symbol, "cash-flow-statement");
        statements.keyMetrics = await new AVclass.Classes.Request(symbol, "key-metrics");
        statements.ratios = await new AVclass.Classes.Request(symbol, "ratios");
        statements.financialGrowth = await new AVclass.Classes.Request(symbol, "financial-growth");
        statements.dcf = await new AVclass.Classes.Request(symbol, "advanced_discounted_cash_flow");

        //FIXME: This should be put in the display object. Doesnt make sense to be here.
        var operatingCashFlow = statements.cashflowStatements[0].operatingCashFlow;
        var netIncome = statements.incomeStatements[0].netIncome;

        var totalEquity = statements.balanceSheets[0].totalStockholdersEquity;
        var totalDebt = statements.balanceSheets[0].longTermDebt + statements.balanceSheets[0].shortTermDebt;
        var treasuryStock = statements.balanceSheets[0].preferredStock;
        var capitalLeases = statements.balanceSheets[0].capitalLeaseObligations;
        var totalCapital = totalEquity + totalDebt + treasuryStock + capitalLeases;

        financials.expectedGrowthCF = operatingCashFlow / totalCapital ;
        financials.expectedGrowthNI = netIncome/ totalCapital ;
        financials.sharesOutstanding = statements.dcf[0].dilutedSharesOutstanding;

        Utils.buildDisplay();

    },
    buildDisplay: function(){
        console.log("this is the function we will use to display stuff");

        const dict = AVclass.Dictionary;

        const statements = AVclass.financials.statements
        var displayObj = {
            current_price : statements.price,
            earnings_per_share: statements.keyMetrics[0].netIncomePerShare,
            free_cash_flow_per_share: statements.keyMetrics[0].freeCashFlowPerShare,
            earnings_growth_five_years: dict.getRoR(statements.keyMetrics[0].netIncomePerShare, statements.keyMetrics[5].netIncomePerShare, 5),
            fcf_growth_five_years: dict.getRoR(statements.keyMetrics[0].freeCashFlowPerShare, statements.keyMetrics[5].freeCashFlowPerShare, 5),
            current_dividend_yield: statements.keyMetrics[0].dividendYield,
            fcf_return_on_capital_adjusted: dict.getAdjRoC(statements.balanceSheets[0], "fcf", statements.keyMetrics[0]),
            fcf_return_on_equity_adjusted : dict.getAdjRoE(statements.balanceSheets[0], "fcf", statements.keyMetrics[0]),
            return_on_capital_listed: statements.keyMetrics[0].roic,
            return_on_equity_listed: statements.keyMetrics[0].roe,
        };
        
        AVclass.displayData = displayObj;
        

    }, 
    process: function(){
        if (Utils.validate() == false){
            console.log("Values are missing from the form");
            return alert("Please ensure all value are filled in");
        }

        console.log("process is starting");
        console.log(this);
    
        let form = document.querySelector("form");
        let processingObj = {};
    
        for(let i = 0; i< form.length-1; i++){
            let inputValue = form[i].value;
            let inputLabel = form[i].id;
           
            processingObj[inputLabel] = inputValue;
        }
        
        console.log(processingObj);

        var obj = {};

        // Sets up the values to pass to value the company;
        obj.valuationBasis = processingObj.valuationMetric; // add entry into key stats object to include Diluted eps start value ... like freecashflow.
        obj.years = Number(processingObj.years);
        obj.equityRiskPremium = Number(processingObj.erp);
        obj.beta = Number(processingObj.beta);
        obj.riskFreeRate = Number(processingObj.rfr);
        obj.terminalGrowthRate = Number(processingObj.tgr);
        obj.growthCaseScenarios = [ Number(processingObj.bestGrowth), Number(processingObj.normalGrowth), Number(processingObj.worstGrowth)];
        obj.desiredReturn = Number(processingObj.desiredReturn);
        obj.probabilities = [Number(processingObj.bestProb), Number(processingObj.normalProb), Number(processingObj.worstProb)]

        console.log(obj)
        AVclass.valuation = new AVclass.Classes.Valuation(obj)
    
    }
};

