//import Base from "./BaseClass.js"

export const Dictionary = {

    getRoR: function(futureValue, presentValue, years){
        return Math.pow(futureValue/presentValue, 1/years) - 1;
    },
    getPresentValue : function (futureValue, rateOfReturn, years){
        return futureValue/(Math.pow((1+rateOfReturn), years));
    }, 
    getFutureValue: function(presentValue, rateOfReturn, years){
        return presentValue * Math.pow((1 + rateOfReturn), years)
    },
    getFuturePrice: function(futureMetric, multiple){
        return (futureMetric * multiple);
    },
    getTerminalMultiple: function(terminalGrowthRate, wacc){ 
        // return 1/( (riskFreeRate + (beta*erp)) - terminalGrowthRate );
        return ( (1+terminalGrowthRate) / (wacc - terminalGrowthRate) )
    },
    getCostOfEquity : function(riskFreeRate, beta, equityRiskPremium){
        return riskFreeRate + (beta * equityRiskPremium);
    },
    getAverages: function(fields /* array of fields*/, arr /* array of objects that contain the fields*/, formula/* specific dict calculation */){
        if (!Array.isArray(fields) && formula == undefined ) return false;
        if (!Array.isArray(arr) ) return false;


        var limit = 5 > arr.length? arr.length : 5;

        averages = fields.map(calculate, arr);

        //var obj = {};

        return averages;

        function calculate(param) {
            var newArr = [];
            
            for (var i = 0; i < limit ; i++ ){
                if (!this[i][param]) return false;
                newArr.push(this[i][param]);
            }
            
            var sum = newArr.reduce(reducer);

            var obj = {};
            obj[param] = (sum/limit) ;

            return obj;

            function reducer(total, num){
                return total + num;
            }            
        }    
    },
    getAdjRoC: function(balanceSheet, type, metrics){
        const debt = balanceSheet.longTermDebt + balanceSheet.shortTermDebt
        //check for accuracy.
        var treasuryStock = balanceSheet.preferredStock;
        const equity =  balanceSheet.totalEquity;
        const capitalLeases = balanceSheet.capitalLeaseObligations;
        const totalCapital = debt + equity + treasuryStock + capitalLeases;
        const sharesOut = AVclass.financials.statements.dcf[0].dilutedSharesOutstanding;


        let value;
        if(type == "fcf"){
            value = metrics.freeCashFlowPerShare
        }else{
            value = metrics.netIncomePerShare
        }
        return value/(totalCapital/sharesOut);

    },
    getAdjAverages: function(balanceSheetArr, type, metricsArr, cashflowArr){
        var holder = [];

        var count = balanceSheetArr.length < 5 ? balanceSheetArr.length : 5 ;

        for(var i = 0; i<count; i++){
            const debt = balanceSheetArr[i].longTermDebt + balanceSheetArr[i].shortTermDebt
            //TODO: check for accuracy.
            var preferredStock = balanceSheetArr[i].preferredStock;
            //var treasuryStock = AVclass.financials.statements.allData[i].treasurystockcommonvalue ? AVclass.financials.statements.allData[i].treasurystockcommonvalue : AVclass.financials.statements.allData[i].treasurystockvalue;
            const equity =  balanceSheetArr[i].totalEquity;
            const capitalLeases = balanceSheetArr[i].capitalLeaseObligations;
            const totalCapital = debt + equity /*+ treasuryStock */+ capitalLeases + preferredStock;
            const sharesOut = AVclass.financials.statements.incomeStatements[i].weightedAverageShsOutDil;

            let value;
            if(type == "fcf"){
                value = metricsArr[i].freeCashFlowPerShare;
            }else if (type == "cfroic"){
                // this part
                var operatingCashFlow = cashflowArr[i].operatingCashFlow;
                var stockBasedCompensation = cashflowArr[i].stockBasedCompensation;
                var operatingCashFlowLessSBC = operatingCashFlow - stockBasedCompensation;
                var operatingCashFlowLessSBCPerShare = operatingCashFlowLessSBC / sharesOut;
                value = operatingCashFlowLessSBCPerShare;
            }else{
                value = metricsArr[i].netIncomePerShare;
            }
            holder.push(value/(totalCapital/sharesOut));
        }

        var rocSum = holder.reduce((total, num)=>{
            return total + num;
        })
        var rocAverage = rocSum/count;
        return rocAverage;

    },
    getAdjRoE: function(balanceSheet, type, metrics){
        //const debt = balanceSheet.longTermDebt + balanceSheet.shortTermDebt
        //check for accuracy.
        const equity = balanceSheet.preferredStock + balanceSheet.totalEquity
        //const totalCapital = debt + equity;
        const sharesOut = AVclass.financials.statements.dcf[0].dilutedSharesOutstanding;

        let value;
        if(type == "fcf"){
            value = metrics.freeCashFlowPerShare
        }else{
            value = metrics.netIncomePerShare
        }
        return value/(equity/sharesOut);

    },
    getExpectedGrowthRateCF: function(balanceSheetArr, incomeStatementArr, cashflowArr){
        //continue  
        for (var i =0; i<5; i++){
            var netCapEx = statements.balanceSheets[0].propertyPlantEquipmentNet - statements.balanceSheets[1].propertyPlantEquipmentNet + statements.incomeStatements[0].depreciationAndAmortization;
            var changeInNWC = statements.cashflowStatements[0].changeInWorkingCapital;
            var reinvestmentRate = (netCapEx + changeInNWC) / operatingCashFlow;
            var expectedGrowth = reinvestmentRate * (operatingCashFlow / totalCapital);
        }
    },





    

}


