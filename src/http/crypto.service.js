const API_URL = "https://min-api.cryptocompare.com";
const API_KEY =
  "fe91ca6abb175c7a80702dd392cb271617034752abc67b2fd2a84ff2991da8bc";
const DEFAULT_TSYMS = ["USD", "RUB", "EUR"];

export const getSingleCoinPriceByName = (fsym, tsyms = DEFAULT_TSYMS) => {
  const queryData = { api_key: API_KEY, tsyms, fsym };
  const queryString = new URLSearchParams(queryData).toString();

  return fetch(`${API_URL}/data/price?${queryString}`).then((response) =>
    response.json()
  );
};

export const getMultiCoinPriceByName = (fsyms, tsyms = DEFAULT_TSYMS) => {
  const queryData = { api_key: API_KEY, tsyms, fsyms };
  const queryString = new URLSearchParams(queryData).toString();

  return fetch(`${API_URL}/data/pricemulti?${queryString}`).then((response) =>
    response.json()
  );
};
