"use strickt";
const coinsList = document.querySelector("#coins-list");
const coinsListContent = document.querySelector("#coins-list table tbody");
const searchInput = document.querySelector(".search-input");
const searchList = document.querySelector("#search-list");
const addCoinBtn = document.querySelector("#add-coin-btn");

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

  console.log(searches);

  searchesResult(searches);
  const searchElements = document.querySelectorAll(".search-element");
  console.log(searchElements);
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
    console.log("PETLA");
    console.log(searchElement);
    searchElement.addEventListener("click", () => {
      console.log(searchElement);
      console.log("PRZYPISANIE");
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

    console.log("UDALO SIE POBRAC DANE");
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
    const nameTd = document.createElement("td");
    nameTd.innerText = coin.name;
    nameTd.classList.add("coin-td");
    const priceTd = document.createElement("td");
    priceTd.innerText = `${coin.current_price}USD`;
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
  });
};

//Search and adding coins
searchInput.addEventListener("input", () => searchStates(searchInput.value));
//Adding coins to list
addCoinBtn.addEventListener("click", () => addCoinStates(searchInput.value));
