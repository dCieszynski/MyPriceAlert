"use strickt";
const coinsList = document.querySelector("#coins-list");
const coinsListContent = document.querySelector("#coins-list table tbody");
const searchInput = document.querySelector(".search-input");
const searchList = document.querySelector("#search-list");
const addCoinBtn = document.querySelector("#add-coin-btn");
let coinsRows = document.querySelectorAll(".coin-row");

//Search
const searchStates = async (searchText) => {
  const res = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h"
  );

  const coinsData = res.data;

  const regex = new RegExp(`^${searchText}`, "gi");

  let searches = coinsData.filter((coinData) => {
    return coinData.name.match(regex) || coinData.symbol.match(regex);
  });

  searchesResult(searches);
  const searchElements = document.querySelectorAll(".search-element");
  searchSelect(searchElements, searches);
};
//Search Result
const searchesResult = (searches) => {
  if (searchInput.value.length > 0) {
    while (searchList.firstChild) {
      searchList.removeChild(searchList.firstChild);
    }
    coinsList.classList.add("hidden");
    searchList.classList.add("open");
    searches.forEach((search) => {
      const searchElement = document.createElement("div");
      searchElement.id = search.id;
      searchElement.classList.add("search-element");
      const searchImg = document.createElement("img");
      searchImg.src = search.image;
      const searchName = document.createElement("div");
      searchName.innerText = search.name;
      searchElement.appendChild(searchImg);
      searchElement.appendChild(searchName);
      searchList.appendChild(searchElement);
    });
  } else {
    clearSearches(searches);
  }
};

const searchSelect = (searchElements, searches) => {
  searchElements.forEach((searchElement) => {
    searchElement.addEventListener("click", () => {
      searchInput.value = searchElement.id;
      clearSearches(searches);
    });
  });
};

const clearSearches = (searches) => {
  searches = [];
  while (searchList.firstChild) {
    searchList.removeChild(searchList.firstChild);
  }
  coinsList.classList.remove("hidden");
  searchList.classList.remove("open");
};
//Adding coins
const addCoinStates = async (coinId) => {
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
  );

  const coinData = res.data;

  let coins = coinData.filter((coinData) => {
    return coinData.id.match(coinId);
  });

  createCoinListElement(coinData);
  searchInput.value = "";
};

const createCoinListElement = (coins) => {
  coins.forEach((coin) => {
    const coinRow = document.createElement("tr");
    coinRow.id = `${coin.id}-el`;
    coinRow.classList.add("coin-row");
    const logoImg = document.createElement("img");
    logoImg.src = coin.image;
    const nameTd = document.createElement("td");
    nameTd.innerText = coin.name;
    nameTd.classList.add("coin-td");
    const priceTd = document.createElement("td");
    priceTd.innerText = `${coin.current_price}USD`;
    priceTd.classList.add("price-td");
    priceTd.classList.add("coin-td");
    const changeTd = document.createElement("td");
    changeTd.classList.add("coin-td");
    const priceChange = Math.round(
      (coin.price_change_percentage_24h * 100) / 100
    );
    changeTd.innerText = `${priceChange}%`;

    coinRow.append(logoImg);
    coinRow.append(nameTd);
    coinRow.append(priceTd);
    coinRow.append(changeTd);

    coinsListContent.append(coinRow);
    coinsRows = document.querySelectorAll(".coin-row");
  });
};

//Search and adding coins
searchInput.addEventListener("input", () => searchStates(searchInput.value));
//Adding coins to list
addCoinBtn.addEventListener("click", () => addCoinStates(searchInput.value));

const selectCoinsIds = (coinsRows) => {
  const coinRowsIds = [];
  coinsRows.forEach((coin) => {
    const coinId = coin.id.slice(0, coin.id.length - 3);
    coinRowsIds.push(coinId);
  });
  return coinRowsIds;
};

const convertCoinsRowsIds = (coinRowsIds) => {
  const coinRowsIdsString = coinRowsIds.join("%2C%20");
  return coinRowsIdsString;
};

const getCoinsPrices = (coinsData) => {
  const coinsPrices = [];
  coinsData.forEach((coinData) => {
    coinsPrices.push(coinData.current_price);
  });
  return coinsPrices;
};

const getCoinChanges = (coinsData) => {
  const coinsChanges = [];
  coinsData.forEach((coinData) => {
    coinsChanges.push(
      Math.round((coinData.price_change_percentage_24h * 100) / 100)
    );
  });
  return coinsChanges;
};

const getCoinsData = async (coinRowsIdsString, coinRowsIds) => {
  await axios
    .get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinRowsIdsString}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    )
    .then((res) => {
      const coinsData = res.data;
      const coinsPrices = getCoinsPrices(coinsData);
      const coinsChanges = getCoinChanges(coinsData);
      const coinsTdPrice = document.querySelectorAll(".price-td");
      coinsTdPrice.forEach((coinTdPrice) => {
        coinTdPrice.innerText = `${coinsPrices}USD`;
      });
      const coinsTdChange = document.querySelectorAll(".change-td");
      coinsTdChange.forEach((coinTdChange) => {
        coinTdChange.innerText = `${coinsChanges}%`;
      });
      console.log(coinsPrices);
      console.log(coinsChanges);
      console.log(coinRowsIds);
    })
    .catch((error) => {
      console.error(error);
    });
};

const getCoinsStates = () => {
  const coinsRowsIds = selectCoinsIds(coinsRows);
  const coinRowsIdsString = convertCoinsRowsIds(coinsRowsIds);
  console.log(coinRowsIdsString);
  getCoinsData(coinRowsIdsString, coinsRowsIds);
};
