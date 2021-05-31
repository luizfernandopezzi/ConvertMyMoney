const axios = require ('axios')
const getUrl = (date) => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${date}'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getExchangeRateApi = (url) => axios.get(url)
const extractExchangeRateApi = (res) => res.data.value[0].cotacaoVenda

const getToday = () => {
    const today = new Date()
    return (today.getMonth()+1+'-'+today.getDate()+'-'+today.getFullYear())
}

const getExchangeRate = ({ getToday, getUrl, getExchangeRateApi, extractExchangeRateApi }) => async() => {
    try{
    const today = getToday()
    const url = getUrl(today)
    const res = await getExchangeRateApi(url)
    const exchangeRateValue = extractExchangeRateApi(res)
    return exchangeRateValue
    }catch(error){
        return ''
    }
}

//Verificando a respsta obtida com o axios.get(url), function getExchangeRateApi
//console.log(getExchangeRateApi(getUrl('05-28-2021')).then(res=>console.log(res.data)))

module.exports = {
    getExchangeRateApi,
    getExchangeRate: getExchangeRate({ getToday, getUrl, getExchangeRateApi, extractExchangeRateApi}),
    extractExchangeRateApi,
    getUrl,
    getToday,
    pure: {
        getExchangeRate
    }
}
