const express = require('express')
const ejs = require('ejs')
const path = require('path')
const convert = require('./lib/convert')
const api = require('./lib/apiBcBrazil')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Routes
app.get('/', (req,res)=>{
    res.render('homeEJS', )
})

app.get('/exchanging', async (req,res)=>{
    //const exchangeRateValue = await api.getExchangeRate()  
    const exchangeRateValue = ''
    const { currencyExchange } = req.query
    if(currencyExchange === 'selectCurrency'){
        res.render('homeEJS')
    }
    if(currencyExchange === 'brlusd'){
        console.log(exchangeRateValue)
        res.render('brlusd', {exchangeRateValue: exchangeRateValue})
    }
    if(currencyExchange === 'usdbrl'){
        res.render('usdbrl', {exchangeRateValue: exchangeRateValue})
    }
})

app.get('/exchange', (req,res)=>{
    const { exchangeRate, amount, currencyExchange } = req.query
    if(exchangeRate && amount && currencyExchange === 'brlusd'){
        const dollars = convert.convertBrlToUsd(exchangeRate, amount)
        res.render('exchange', {
            currencyExchange: 'brlusd',
            error: false,
            exchangeRate: convert.toMoney(exchangeRate), 
            amount: convert.toCurrency("pt-BR","BRL",amount),
            dollars: convert.toCurrency("en-US","USD",dollars)
        })
    }
    if(exchangeRate && amount && currencyExchange === 'usdbrl'){
        const reais = convert.convertUsdToBrl(exchangeRate, amount)
        res.render('exchange', {
            error: false,
            currencyExchange: 'usdbrl',
            exchangeRate: convert.toMoney(exchangeRate), 
            amount: convert.toCurrency("en-US","USD",amount),
            reais: convert.toCurrency("pt-BR","BRL",reais)
        })
    }
    if(!exchangeRate || !amount){
        res.render('exchange', {
            currencyExchange: '',
            error: 'The inputs cannot be empty.'
        })
    }
})

//Definindo diretório de arquivos CSS
app.use(express.static(path.join(__dirname, 'public')))

app.listen(3000, err=>{
    if(err){
        console.log('The server is not running. Some error was verified.')
    }else{
        console.log('ConvertMyMoney is online!')
    }
})