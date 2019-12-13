import React, {useState, useEffect} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import "./App.css";
import Block from "./components/firstView/Block";
import Loading from "./components/Loading";
import axios from 'axios';
import {Line} from 'react-chartjs-2';
import coinInfo from './components/coinInfo';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/coin">
            <Coin />
          </Route>
          <Route path="/comparison">
            <Comparison />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
          <Route path="/info">
            <Info />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  const [coinsValue, setCoinsValue] = useState(false);
  const [coinsLoaded, setCoinsLoaded] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState(false);
  useEffect(() => {
    const getCoins = async () => {
      const { data: { data } } = await axios.get('https://production.api.coindesk.com/v2/price/ticker?assets=BTC,XMR,ETH,LTC');
      const { data: exchanges } = await axios.get('https://production.api.coindesk.com/v2/exchange-rates');
      setCoinsValue(data);
      setExchangeRates(exchanges)
      setCoinsLoaded(true);
    };
    if (!coinsValue)getCoins();
  })
  if (!coinsLoaded) return <Loading />
  return (
    <div className="App">
      <i style={{color: 'white', position: 'absolute', left: '1rem'}} className="fa fa-refresh" onClick={() => window.location.reload()}></i>
      <select style={{ backgroundColor: 'white', position: 'absolute', right: '.5rem' }} onChange={() => setSelectedExchange(document.querySelector('#toCoin').value)} id="toCoin">
        {Object.keys(exchangeRates.data).map(elem => {
          if (elem === 'USD') return <option key={elem} selected="selected">{elem}</option>
          return <option key={elem}>{elem}</option>
        })}
      </select>
      <span style={{display: 'flex', justifyContent: 'center'}}>
        <h1 className="title" style={{ color: "white" }}>CryptoWorld</h1>
      </span>
      <Grid container justify="center">
        <Block coinData={coinsValue["BTC"]} exchangeRate={exchangeRates.data[selectedExchange].rate}/>
        <Block coinData={coinsValue["XMR"]} exchangeRate={exchangeRates.data[selectedExchange].rate}/>
        <Block coinData={coinsValue["ETH"]} exchangeRate={exchangeRates.data[selectedExchange].rate}/>
        <Block coinData={coinsValue["LTC"]} exchangeRate={exchangeRates.data[selectedExchange].rate}/>
      </Grid>
      <span style={{ display: 'flex', justifyContent: 'space-around' }}>
        <span style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <Link to="/comparison"><i style={{ color: 'white' }} className="fa fa-balance-scale"></i></Link>
          <span style={{ fontSize: '.8rem' }}>
            Comparação
        </span>
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <a style={{ color: 'white', textDecoration: 'none' }} class="fa fa-money" href="https://www.melhorcambio.com/casas-de-cambio"></a>
          <span style={{ fontSize: '.8rem' }}>
            Casas de câmbio
        </span>
        </span>
        <span style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
          <Link to="/search"><i style={{ color: 'white' }} className="fa fa-exchange" w></i></Link>
          <span style={{ fontSize: '.8rem' }}>
            Conversão
        </span>
        </span>
      </span> 
    </div> 
  );
};

function Search() {
  const [coinValues, setCoinValues] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [selectedExchange, setSelectedExchange] = useState('USD');
  useEffect(() => {
    const getExchangeRates = async () => {
      const { data: tickers } = await axios.get('https://production.api.coindesk.com/v2/price/ticker?assets=all');
      const { data: exchanges } = await axios.get('https://production.api.coindesk.com/v2/exchange-rates');
      setCoinValues(tickers);
      setExchangeRates(exchanges)
    };
    if (!exchangeRates && !coinValues) getExchangeRates();
  });

  if (!exchangeRates || !coinValues) return <Loading/>
  
  return (
    <div className="App">
      <span style={{display: 'flex', color: 'white'}}>
        <Link style={{color: 'white'}} to="/"><i className="fa fa-arrow-left"></i></Link>
        <h1>Conversão</h1>
      </span>
      <div style={{color: 'white', marginBottom: '5rem'}}>
        <label htmlFor=""> From: 
          <select style={{ backgroundColor: 'white' }} onChange={() => setSelectedCoin(document.querySelector('#fromCoin').value)} id="fromCoin">
            {Object.keys(coinValues.data).map(elem => {
              return <option key={elem}>{elem}</option>
            })}
          </select>
        </label>
        <label htmlFor=""> To: 
          <select style={{ backgroundColor: 'white' }} onChange={() => setSelectedExchange(document.querySelector('#toCoin').value)} id="toCoin">
            {Object.keys(exchangeRates.data).map(elem => {
              if (elem === 'USD') return <option key={elem} selected="selected">{elem}</option>
              return <option key={elem}>{elem}</option>
            })}
          </select>
        </label>
      </div>
      <Block coinData={coinValues.data[selectedCoin]} exchangeRate={exchangeRates.data[selectedExchange].rate}/>
    </div> 
  );
};

const searchChartData = async (setLabelsState, setValuesState) => {
  const startDate = document.querySelector('#startDate').value;
  const endDate = document.querySelector('#endDate').value;
  const coin = window.location.pathname.slice(6);
  if (startDate === "") return window.alert('Insert and start date');
  if (endDate === "") return window.alert('Insert and end date');
  const chartDataUrl = `https://production.api.coindesk.com/v2/price/values/${coin}?start_date=${startDate}T00:00&end_date=${endDate}T02:16&ohlc=false`
  const {data: {data: chartData}} = await axios.get(chartDataUrl);
  const datesArray = chartData.entries.map(elem => new Date(elem[0]).toISOString().split('T')[0]);
  const valuesArray = chartData.entries.map(elem => Math.round(elem[1] * 100)/ 100);
  setLabelsState(datesArray)
  setValuesState(valuesArray)
}

function Coin() {
  const [labelState, setLabelsState] = useState(false)
  const [valuesState, setValuesState] = useState(false)
  const coin = window.location.pathname.slice(6);
  const chartData = {
    labels: labelState,
    datasets: [{
      backgroundColor: 'red',
      borderColor: 'red',
      label: coin,
      data: valuesState,
    }]
  }
  if (!coin) return window.location.pathname = '/';
  return (
    <div className="App" style={{ color: 'white', height: '95vh' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Link style={{ color: 'white' }} to="/"><i className="fa fa-arrow-left"></i></Link>
          <h1>{coin}</h1>
          <Link style={{ color: 'white' }} to={`/info/${coin}`}><i className="fa fa-info"></i></Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="">
            Data inicial
            <input type="date" style={{ backgroundColor: 'white' }} id="startDate" />
          </label>
          <label htmlFor="">
            Data final
            <input type="date" style={{ backgroundColor: 'white' }} id="endDate" />
          </label>
        </div>
        <button style={{ backgroundColor: 'white', marginTop: '2rem', borderRadius: '5px' }} onClick={() => searchChartData(setLabelsState, setValuesState)}>Search</button>
      </div>

      <div style={{backgroundColor: 'white', marginTop: '3rem'}}>
        <Line data={chartData}/>
      </div>
    </div>
  );
};

const Info = () => {
  const coin = window.location.pathname.slice(6);
  return (
    <div style={{color: 'white'}}>
      <Link style={{ color: 'white' }} to={`/coin/${coin}`}><i className="fa fa-arrow-left"></i></Link>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{coinInfo[coin].name}</h1>
      </span>
        <p>{coinInfo[coin].info}</p>
    </div>
  )
};

const Comparison = () => {
  const [coinValues, setCoinValues] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [selectedCoin2, setSelectedCoin2] = useState('BTC');
  const [selectedExchange, setSelectedExchange] = useState('USD');
  useEffect(() => {
    const getExchangeRates = async () => {
      const { data: tickers } = await axios.get('https://production.api.coindesk.com/v2/price/ticker?assets=all');
      const { data: exchanges } = await axios.get('https://production.api.coindesk.com/v2/exchange-rates');
      setCoinValues(tickers);
      setExchangeRates(exchanges)
    };
    if (!exchangeRates && !coinValues) getExchangeRates();
  });

  if (!exchangeRates || !coinValues) return <Loading/>
  return (
    <div className="App">
      <span style={{display: 'flex', color: 'white'}}>
        <Link style={{color: 'white'}} to="/"><i className="fa fa-arrow-left"></i></Link>
        <h1>Conversão (USD)</h1>
      </span>
      <div style={{color: 'white', marginBottom: '5rem'}}>
        <label htmlFor=""> From: 
          <select style={{ backgroundColor: 'white' }} onChange={() => setSelectedCoin(document.querySelector('#fromCoin').value)} id="fromCoin">
            {Object.keys(coinValues.data).map(elem => {
              return <option key={elem}>{elem}</option>
            })}
          </select>
        </label>
        <label htmlFor=""> From: 
          <select style={{ backgroundColor: 'white' }} onChange={() => setSelectedCoin2(document.querySelector('#toCoin').value)} id="toCoin">
            {Object.keys(coinValues.data).map(elem => {
              return <option key={elem}>{elem}</option>
            })}
          </select>
        </label>
      </div>
      <Block coinData={coinValues.data[selectedCoin]} exchangeRate={1}/>
      <Block coinData={coinValues.data[selectedCoin2]} exchangeRate={1}/>
    </div> 
  );
}

export default App;