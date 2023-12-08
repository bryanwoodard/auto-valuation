// --------- Components needed for app-------------

/*
- html
- css
- server to load it on

::future::
- database to store the valuations in 
- job to update them and update the record.



HTML
    Elements
        - components to display raw data
            - price
            - name
            - current interest/bond rate rates
            - current 
        
        - components to display calculated data based on fetch
            - ROA
            - ROE
            - ROTC
            - margins for selected input


        - inputs to add assumptions
            - # years to project
            - fcf or eps to use in val
            - future interest rate
            - div payout ratio
            - desired return
            - adjusted beta
            - ERP
            - revenue components, values and expected growth rates
            


        - components to valuation calculated from assumption inputs
            - Buy Price
            - compound return at current levels (irr)
            - Range
            - Future value
            - worst return
            - Fair value
            - cost of equity
            - cost of debt
            - WACC

JS
    Functions:
        - templating 
            - to show the calculated data
        - fetch the data
            - company specific financial data
            - current market rates
        - run the calculations
            - based on fetched company data
            - based on input data from form (assumptions)

    Library:
        - financejs




*/

