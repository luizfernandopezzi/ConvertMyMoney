const apiBcBrazil = require('./apiBcBrazil')
const axios = require('axios')
const { getExchangeRate } = require('./apiBcBrazil')

jest.mock('axios') //Mock of Axios cause we are not doing an integration test. By doing this, we are not real loading axios, but passing just a version of it instead. By this way, the test is isolated, and not testing axios loading and integration, etc.

test('getExchangeRateApi', () => {
    const res = {
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    }
    axios.get.mockResolvedValue(res)
    apiBcBrazil.getExchangeRateApi('url').then( response => {
        expect(response).toEqual(res)
        console.log(axios.get.mock)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})

test('extractExchangeRateApi', () => {
    const exchangeRate = apiBcBrazil.extractExchangeRateApi({
        data: {
            value: [
                { cotacaoVenda: 3.90 }
            ]
        }
    })
    expect(exchangeRate).toBe(3.90)
})

//Agrupando vários testes ou ganhando um bloco a mais para trabalhar com o describe()
describe('getToday', () => {
    const RealDate = Date

    function mockDate(date){
        global.Date = class extends RealDate {
            constructor(){
                return new RealDate(date)
            }
        }
    }

    afterEach(()=>{
        global.Date = RealDate
    })

    test('getToday', () => {
        mockDate('2019-01-01T12:00:00')
        const today = apiBcBrazil.getToday()
        console.log(today)
        expect(today).toBe('1-1-2019')
    })
})

test('getUrl', () => {
    const url = apiBcBrazil.getUrl('MINHA-DATA')
    expect(url).toBe("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='MINHA-DATA'&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao")
})

test('getExchangeRate', () => {
    const res = {
    }

    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')

    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getExchangeRateApi = jest.fn()
    getExchangeRateApi.mockReturnValue(Promise.reject('err'))

    const extractExchangeRateApi = jest.fn()
    extractExchangeRateApi.mockReturnValue(3.9)

    apiBcBrazil.pure
        .getExchangeRate({ getToday, getUrl, getExchangeRateApi, extractExchangeRateApi })()
        .then( res => {
            expect(res).toBe('')
        })
})