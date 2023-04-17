import React from "react";
import "./App.css";
import {
  getMultiCoinPriceByName,
  getSingleCoinPriceByName,
} from "./http/crypto.service";

const INITIAL_COIN = "DOGE";

class InputCoinName extends React.Component {
  render() {
    return (
      <input
        className="search-coin-input"
        value={this.props.input}
        onChange={this.props.onChange}
      />
    );
  }
}

class CoinCard extends React.Component {
  getTrendColor = (current, prev) => {
    if (!prev) return;

    if (current > prev) {
      return "green";
    } else if (current < prev) {
      return "red";
    } else {
      return;
    }
  };

  render() {
    const { item, onDelete } = this.props;
    return (
      <div className="coin-card">
        <h2>{item.name}</h2>
        <hr />
        <p className={this.getTrendColor(item.USD, item.prevUSD)}>
          USD: {item.USD}
        </p>
        <p className={this.getTrendColor(item.RUB, item.prevRUB)}>
          RUB: {item.RUB}
        </p>
        <p className={this.getTrendColor(item.EUR, item.prevEUR)}>
          EUR: {item.EUR}
        </p>
        <hr />
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      coins: [],
      input: "",
    };
  }

  handleChange = (e) => {
    this.setState((prev) => ({
      ...prev,
      input: e.target.value,
    }));
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      const coinsName = this.state.coins.map((item) => item.name);
      if (!coinsName.length) return;

      getMultiCoinPriceByName(coinsName).then((data) => {
        this.setState((prev) => ({
          ...prev,
          coins: prev.coins.map((item) => ({
            ...item,
            ...data[item.name],
            prevUSD: item.USD,
            prevRUB: item.RUB,
            prevEUR: item.EUR,
          })),
        }));
      });
    }, 5000);

    getSingleCoinPriceByName(INITIAL_COIN).then((data) => {
      this.setState((prev) => ({
        ...prev,
        input: "",
        coins: [{ ...data, name: INITIAL_COIN }],
      }));
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  handleSearch = () => {
    const candidate = this.state.coins.find(
      (item) => item.name === this.state.input
    );
    if (candidate) {
      return this.setState((prev) => ({
        ...prev,
        error: "Эта валюта уже есть в вашем списке",
      }));
    }
    getSingleCoinPriceByName(this.state.input).then((data) => {
      this.setState((prev) => ({
        ...prev,
        error: null,
        coins: [{ ...data, name: prev.input }, ...prev.coins],
      }));
    });
  };

  deleteCoin = (name) => {
    this.setState((prev) => ({
      ...prev,
      coins: prev.coins.filter((item) => name !== item.name),
    }));
  };

  render() {
    const { coins, input, error } = this.state;
    return (
      <div className="wrapper">
        <div className="search-container">
          <InputCoinName value={input} onChange={this.handleChange} />
          <button onClick={this.handleSearch}>Search</button>
        </div>

        {error && <p>{error}</p>}
        <div className="coin-cards-container">
          {coins.map((item) => (
            <CoinCard
              item={item}
              key={item.name}
              onDelete={() => this.deleteCoin(item.name)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
