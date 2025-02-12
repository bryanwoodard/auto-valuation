//Based on /route/index.js 
var express = require('express');
var router = express.Router();

const Request = require('./request/requestMethods')

/* GET home page. */
router.get('/fetch', async function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    
    const symbol = req.query.symbol;
    
    var statements = {};
    statements.price = await new Request(symbol, "price");

    if(statements.price == null || typeof statements.price == undefined){
        throw new Error("There is likely an issue with the symbol")
    }

    statements.incomeStatements = await new Request(symbol, "income-statement");
    statements.balanceSheets = await new Request(symbol, "balance-sheet-statement");
    statements.cashflowStatements = await new Request(symbol, "cash-flow-statement");
    statements.keyMetrics = await new Request(symbol, "key-metrics");
    statements.ratios = await new Request(symbol, "ratios");
    statements.financialGrowth = await new Request(symbol, "financial-growth");
    statements.dcf = await new Request(symbol, "advanced_discounted_cash_flow");
    statements.allData = await new Request(symbol, "financial-statement-full-as-reported");
    statements.profile = await new Request( symbol, "profile");
    res.json(statements);
});


// router.get('/b', function(req, res, next) {
//     res.send('You hit the "b" page --- test!');
// });

module.exports = router;
