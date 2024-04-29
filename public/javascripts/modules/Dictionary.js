//import Base from "./BaseClass.js"

export const Dictionary = {

    getRoR: function(futureValue, presentValue, years){
        return Math.pow(futureValue/presentValue, 1/years);
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
    getTerminalMultiple: function(beta, erp, riskFreeRate, terminalGrowthRate){ /* FIXME: //returns capm ... also think about including cost of debt and wacc as well*/
        return 1/( (riskFreeRate + (beta*erp)) - terminalGrowthRate );
    },
    getCostOfEquity : function(riskFreeRate, beta, equityRiskPremium){
        return riskFreeRate + (beta * equityRiskPremium);
    },
    getAverages: function(fields /* array of fields*/, arr /* array of objects that contain the fields*/){
        if (!Array.isArray(fields) ) return false;
        if (!Array.isArray(arr) ) return false;


        var limit = 5 > arr.length? arr.length : 5;

        var averages = fields.map(calculate, arr);

        var obj = {};

        return averages;

        function calculate(param) {
            var newArr = [];
            
            for (var i = 0; i < limit ; i++ ){
                if (!this[i][param]) return false;
                
                newArr.push(this[i][param]);
            }
            
            var sum = newArr.reduce(reducer)

            function reducer(total, num){
                return total + num;
            }
            
            var obj = {};
            obj[param] = (sum/limit) ;

            return obj;
        }    
    }





    

}


