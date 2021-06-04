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
  if (searchInput.value != "") {
    const res = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    );

    const coinData = res.data;
    createCoinListElement(coinData);
    searchInput.value = "";
  }
};

const createCoinListElement = (coins) => {
  coins.forEach((coin) => {
    const coinRow = document.createElement("tr");
    coinRow.id = `${coin.id}-el`;
    coinRow.classList.add("coin-row");
    const logoImg = document.createElement("img");
    logoImg.src = coin.image;
    logoImg.classList.add("logo-td");
    const nameTd = document.createElement("td");
    nameTd.innerText = coin.name;
    nameTd.classList.add("coin-td");
    nameTd.classList.add("name-td");
    const priceTd = document.createElement("td");
    priceTd.innerText = `${coin.current_price}USD`;
    priceTd.classList.add("coin-td");
    priceTd.classList.add("price-td");
    const changeTd = document.createElement("td");
    changeTd.classList.add("coin-td");
    changeTd.classList.add("change-td");
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

const getCoinsIds = (coinsData) => {
  const coinsIds = [];
  coinsData.forEach((coinData) => {
    coinsIds.push(coinData.id);
  });
  return coinsIds;
};

const getCoinsLogos = (coinsData) => {
  const coinsLogos = [];
  coinsData.forEach((coinData) => {
    coinsLogos.push(coinData.image);
  });
  return coinsLogos;
};

const getCoinsNames = (coinsData) => {
  const coinsNames = [];
  coinsData.forEach((coinData) => {
    coinsNames.push(coinData.name);
  });
  return coinsNames;
};

const getCoinsPrices = (coinsData) => {
  const coinsPrices = [];
  coinsData.forEach((coinData) => {
    coinsPrices.push(coinData.current_price);
  });
  return coinsPrices;
};

const getCoinsChanges = (coinsData) => {
  const coinsChanges = [];
  coinsData.forEach((coinData) => {
    coinsChanges.push(
      Math.round((coinData.price_change_percentage_24h * 100) / 100)
    );
  });
  return coinsChanges;
};

const getCoinsData = async (coinRowsIdsString, coinRowsIds) => {
  if (coinRowsIdsString != "")
    await axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinRowsIdsString}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      )
      .then((res) => {
        const coinsData = res.data;
        const coinsIds = getCoinsIds(coinsData);
        const coinsLogos = getCoinsLogos(coinsData);
        const coinsNames = getCoinsNames(coinsData);
        const coinsPrices = getCoinsPrices(coinsData);
        const coinsChanges = getCoinsChanges(coinsData);

        const coinsTrIds = document.querySelectorAll(".coin-row");
        const coinTrIdsArray = Array.from(coinsTrIds);
        coinsTrIds.forEach((coinTrId) => {
          const idIndex = coinTrIdsArray.indexOf(coinTrId);
          coinTrId.id = `${coinsIds[idIndex]}-el`;
        });

        const coinsTdLogo = document.querySelectorAll(".logo-td");
        const coinTdLogoArray = Array.from(coinsTdLogo);
        coinsTdLogo.forEach((coinTdLogo) => {
          const logoIndex = coinTdLogoArray.indexOf(coinTdLogo);
          coinTdLogo.src = coinsLogos[logoIndex];
        });

        const coinsTdName = document.querySelectorAll(".name-td");
        const coinTdNameArray = Array.from(coinsTdName);
        coinsTdName.forEach((coinTdName) => {
          const nameIndex = coinTdNameArray.indexOf(coinTdName);
          coinTdName.innerText = `${coinsNames[nameIndex]}`;
        });

        const coinsTdPrice = document.querySelectorAll(".price-td");
        const coinTdPriceArray = Array.from(coinsTdPrice);
        coinsTdPrice.forEach((coinTdPrice) => {
          const priceIndex = coinTdPriceArray.indexOf(coinTdPrice);
          coinTdPrice.innerText = `${coinsPrices[priceIndex]}USD`;
        });

        const coinsTdChange = document.querySelectorAll(".change-td");
        const coinsTdChangeArray = Array.from(coinsTdChange);
        coinsTdChange.forEach((coinTdChange) => {
          const changeIndex = coinsTdChangeArray.indexOf(coinTdChange);
          coinTdChange.innerText = `${coinsChanges[changeIndex]}%`;
        });
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

const refreshCoinList = () => {
  const refreshTime = 60000 * 20;
  getCoinsStates();
  setTimeout(refreshCoinList, refreshTime);
};

refreshCoinList();
