export const Utils = {
    template: function (divId, object){
        let location = document.getElementById(divId);
        
        if (location.childNodes){
            location.innerHTML= null;
        }
        createList(location, object)

        function createList(location, object){
            let listElement = document.createElement("ul");
            
            for(var key in object){
                var value = object[key];

                if(key.includes("RO") || key.includes("return")|| key.includes("rate") || key.includes("growth") || key.includes("yield")){
                    value = value * 100
                    value = value.toFixed(2) + "%";
                } else if(typeof value !== "string"){
                    value = value.toFixed(2);
                }
                let entry = document.createElement("li");
                entry.innerText = `${makeWords(key)}: ${value}`;
                listElement.appendChild(entry)

            }
            location.appendChild(listElement);
        }

        function makeWords(varName){
            const text = varName;
            const result = text.replace(/([A-Z])/g, "$1").replaceAll("_", " ");
            const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
            return finalResult;
        }
    },
    clear: function(){
        var arr = []

        var quickStats = document.getElementById("quick-stats-head").querySelectorAll("p");
        var valuations = document.getElementById("valuations").querySelectorAll("p");

        arr.push(quickStats);
        arr.push(valuations);

        for (var i=0; i<arr.length; i++){
            for(var j=0; j<arr[i].length; j++){
                arr[i][j].remove();
            }
        }
    },
    toggleDisplay: function(id, show){
        //var fields = ["quick-stats-head", "valuations"]
        var field = document.getElementById(id);
        var classValue = field.className;
        var displayClass = "d-none";

        if(show == true){
            field.className = classValue.replaceAll(displayClass, "");
        }
        if(show == false){
            field.className = classValue + " " + displayClass;
        }
        return true;
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

        //If symbol changes, clear and hide everything before re-showing
        if(AVclass.symbol !== undefined && symbol !== AVclass.symbol){
            Utils.clear();
            Utils.toggleDisplay("quick-stats-head", false);
            Utils.toggleDisplay("valuations", false);
            AVclass.valuation = null;
        }

        AVclass.symbol = symbol;
        AVclass.financials = {};

        try {
            AVclass.financials.statements = await new AVclass.Classes.Request(symbol);
            console.log("FETCHING ALL THE STATEMENTS...")
            
            Utils.buildDisplay();
        } catch (error) {
            console.log(error)
        }
        

    },
    buildDisplay: function(){
        console.log("this is the function we will use to display stuff");

        const dict = AVclass.Dictionary;
        const statements = AVclass.financials.statements

        var operatingCashFlow = statements.cashflowStatements[0].operatingCashFlow;
        var netIncome = statements.incomeStatements[0].netIncome;
        var totalEquity = statements.balanceSheets[0].totalStockholdersEquity;
        var totalDebt = statements.balanceSheets[0].longTermDebt + statements.balanceSheets[0].shortTermDebt;
        var preferredStock = statements.balanceSheets[0].preferredStock;
        // var treasuryStock = statements.allData[0].treasurystockcommonvalue ? statements.allData[0].treasurystockcommonvalue : statements.allData[0].treasurystockvalue;
        var capitalLeases = statements.balanceSheets[0].capitalLeaseObligations;
        var totalCapital = totalEquity + totalDebt + /*treasuryStock + */ capitalLeases + preferredStock;
        var stockBasedCompensation = statements.cashflowStatements[0].stockBasedCompensation;
        var operatingCashFlowLessSBC = operatingCashFlow - stockBasedCompensation;
        var sharesOutstanding =  statements.incomeStatements[0].weightedAverageShsOutDil;
        var capEx = statements.cashflowStatements[0].capitalExpenditure;
        var operatingCashFlowLessSBCPerShare = operatingCashFlowLessSBC / sharesOutstanding;
        var freeCashFlowLessSBC = operatingCashFlowLessSBC + capEx;
        var freeCashFlowLessSBCPerShare = freeCashFlowLessSBC/sharesOutstanding;
        var faustmanRatio = (statements.price * sharesOutstanding)/ totalEquity;
        var freeCashFlowPerShare = (operatingCashFlow - capEx)/sharesOutstanding;

        //TODO: Build these out.
        /**
         * lynch ratio
         * better "expected fcf growth"calc that take cfroic * reinv rate (reinv rate = capex + nwc)
         * i.e (op cashflow / invested capital_raw) x ( (capex + change in NWC)/ opcashflow)
         * simplified => (capex + change in NWC) / invested capital
         * see valuation workbook scratch page cells A201:B212
         */
        var lynchRatio ;
        
        var generalData = {
            company_name: statements.profile[0].companyName,
            description: statements.profile[0].description,
            industry: statements.profile[0].industry,
            current_price : statements.price,
            beta: statements.dcf[0].beta,
            earnings_per_share: statements.keyMetrics[0].netIncomePerShare,
            free_cash_flow_per_share: statements.keyMetrics[0].freeCashFlowPerShare,
            // free_cash_flow_per_share : freeCashFlowPerShare,
            adjusted_op_cashflow_per_share: operatingCashFlowLessSBCPerShare,
            current_dividend_yield: statements.keyMetrics[0].dividendYield,
            shares_outstanding:  sharesOutstanding,
            faustman_ratio: faustmanRatio,
        }
        var earningsData = {
            earnings_growth_five_years: dict.getRoR(statements.keyMetrics[0].netIncomePerShare, statements.keyMetrics[5].netIncomePerShare, 5),
            expected_growth_net_income: netIncome/ totalCapital,
            return_on_capital_listed: statements.keyMetrics[0].roic,
            return_on_equity_listed: statements.keyMetrics[0].roe,
        }
        var cashflowData = {
            fcf_growth_five_years: dict.getRoR(statements.keyMetrics[0].freeCashFlowPerShare, statements.keyMetrics[5].freeCashFlowPerShare, 5),
            cashflow_ROIC_raw: operatingCashFlow / totalCapital,
            // THIS ONE!
            share_based_compensation_adjusted_CFROIC: operatingCashFlowLessSBC / totalCapital,
            average_SBC_CFROIC: dict.getAdjAverages(statements.balanceSheets, "cfroic", null, statements.cashflowStatements),
            //TODO: Fix the two below to use SBC factored 
            fcf_return_on_capital: dict.getAdjRoC(statements.balanceSheets[0], "fcf", statements.keyMetrics[0]),
            fcf_return_on_equity : dict.getAdjRoE(statements.balanceSheets[0], "fcf", statements.keyMetrics[0]),
            // sbc_factored_fcf_return_on_capital : freeCashFlowLessSBC/ totalCapital,
            // average_adjusted_fcf_return_on_capital: dict.getAdjAverages(statements.balanceSheets, "fcf", statements.keyMetrics),
        }

        var displayObj = {...generalData, ...earningsData, ...cashflowData}
        
        AVclass.displayData = displayObj;

        // this.template("quick-stats", displayObj);
        this.template("general-data", generalData);
        this.template("earnings-data", earningsData);
        this.template("cashflow-data", cashflowData);

        Utils.toggleDisplay("quick-stats-head", true);

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
        AVclass.valuation = new AVclass.Classes.Valuation(obj);

        var combinedValuation = AVclass.valuation.combinedScenarios;

        var singularValuation = combinedValuation.singularScenario;
        var bestValuation = combinedValuation.probabalisticValuations[0];
        var neutralValuation = combinedValuation.probabalisticValuations[1];
        var worstValuation = combinedValuation.probabalisticValuations[2];

        Utils.template("consolidated-data", singularValuation);
        Utils.template("best-data", bestValuation);
        Utils.template("neutral-data", neutralValuation);
        Utils.template("worst-data", worstValuation);
        
        Utils.toggleDisplay("valuations", true);

    
    }
};

