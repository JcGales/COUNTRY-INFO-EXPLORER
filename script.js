//DOM
const baseURL = "https://restcountries.com/v3.1/";
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('search-button');
const flag = document.getElementById("flag");
const selectedCountry = document.getElementById("country-name");
const countryRegion = document.querySelector(".country-region");
const capital = document.getElementById("capital");
const population = document.getElementById("population");
const language = document.getElementById("language");
const currency = document.getElementById("currency");
const filterChips = document.querySelectorAll(".filter-chip");
const resultsContainer = document.querySelector(".results-container");
const countryCardTemplate = document.querySelector(".country-card");
const seeAllLink = document.querySelector(".section-link");


let currentRegion = "all";
let allCountriesData = [];


countryCardTemplate.style.display = "none";

//HANDLERS
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
});

seeAllLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (allCountriesData.length > 0) {
        displayMultipleCountries(allCountriesData);
    } else if (currentRegion === "all") {
        fetchAllCountries();
    } else {
        fetchCountriesByRegion(currentRegion, true);
    }
});

filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
        filterChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        currentRegion = chip.dataset.region;
        
        if (currentRegion === "all") {
            countryCardTemplate.style.display = "none";
            resultsContainer.innerHTML = `
                <div class="section-header">
                    <h2 class="section-title">Countries</h2>
                    <a href="#" class="section-link">See All</a>
                </div>
                <div class="no-results">
                    <i class="fas fa-globe no-results-icon"></i>
                    <h3 class="no-results-title">No country selected</h3>
                    <p class="no-results-subtitle">Search for a country or select a region</p>
                </div>
            `;
        } else {
            fetchCountriesByRegion(currentRegion);
        }
    });
});

//FUNCTIONS
async function handleSearch() {
    const countryName = searchInput.value.trim();
    try {
        if (!countryName) throw new Error("Please enter a country name");
        
        const data = await fetchCountryData(countryName);
        updateCountryUI(data[0]);
        searchInput.value = "";
    } catch (error) {
        alert(error.message);
    }
}

async function fetchCountryData(country) {
    try {
        const response = await fetch(`${baseURL}name/${country}?fullText=true`);
        if (!response.ok) throw new Error("Country not found. Please check spelling.");
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

async function fetchCountriesByRegion(region, showAll = false) {
    try {
        const response = await fetch(`${baseURL}region/${region}`);
        if (!response.ok) throw new Error("Failed to fetch countries in this region");
        
        const data = await response.json();
        allCountriesData = data;
        
        if (showAll) {
            displayMultipleCountries(data);
        } else {
            updateCountryUI(data[0]);
        }
    } catch (error) {
        showError(error.message);
    }
}

async function fetchAllCountries() {
    try {
        const response = await fetch(`${baseURL}all`);
        if (!response.ok) throw new Error("Failed to fetch all countries");
        
        const data = await response.json();
        allCountriesData = data;
        displayMultipleCountries(data);
        
        filterChips.forEach(c => c.classList.remove("active"));
        filterChips[0].classList.add("active");
        currentRegion = "all";
        searchInput.value = "";
    } catch (error) {
        showError(error.message);
    }
}

function updateCountryUI(countryData) {
    if (!resultsContainer.querySelector('.section-header')) {
        resultsContainer.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">Countries</h2>
                <a href="#" class="section-link">See All</a>
            </div>
        `;
    }
    
    const sectionHeader = resultsContainer.querySelector('.section-header');
    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(sectionHeader);
    
    const countryCard = countryCardTemplate.cloneNode(true);
    countryCard.style.display = "block";
    
    const cardFlag = countryCard.querySelector(".flag");
    const cardName = countryCard.querySelector(".country-name");
    const cardRegion = countryCard.querySelector(".country-region");
    const cardCapital = countryCard.querySelector("#capital");
    const cardPopulation = countryCard.querySelector("#population");
    const cardLanguage = countryCard.querySelector("#language");
    const cardCurrency = countryCard.querySelector("#currency");
    
    cardFlag.src = countryData.flags?.png || "https://flagcdn.com/us.svg";
    cardName.textContent = countryData.name?.common || "Unknown";
    cardRegion.textContent = `${countryData.region || "Unknown"} ${countryData.subregion ? `• ${countryData.subregion}` : ""}`;
    cardCapital.textContent = countryData.capital?.join(", ") || "N/A";
    cardPopulation.textContent = countryData.population?.toLocaleString() || "N/A";
    
    if (countryData.languages) {
        const languages = Object.values(countryData.languages);
        cardLanguage.textContent = languages.join(", ");
    } else {
        cardLanguage.textContent = "N/A";
    }
    
    if (countryData.currencies) {
        const currencyCode = Object.keys(countryData.currencies)[0];
        const currencyInfo = countryData.currencies[currencyCode];
        cardCurrency.textContent = `${currencyInfo.name} (${currencyInfo.symbol || "—"})`;
    } else {
        cardCurrency.textContent = "N/A";
    }
    
    resultsContainer.appendChild(countryCard);
}

function displayMultipleCountries(countries) {
    if (!resultsContainer.querySelector('.section-header')) {
        resultsContainer.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">Countries</h2>
                <a href="#" class="section-link">See All</a>
            </div>
        `;
    } else {

        const sectionHeader = resultsContainer.querySelector('.section-header');
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(sectionHeader);
    }
    

    countryCardTemplate.style.display = "none";
    

    countries.forEach(country => {
        const countryCard = countryCardTemplate.cloneNode(true);
        countryCard.style.display = "block";
        

        const cardFlag = countryCard.querySelector(".flag");
        const cardName = countryCard.querySelector(".country-name");
        const cardRegion = countryCard.querySelector(".country-region");
        const cardCapital = countryCard.querySelector("#capital");
        const cardPopulation = countryCard.querySelector("#population");
        const cardLanguage = countryCard.querySelector("#language");
        const cardCurrency = countryCard.querySelector("#currency");

        cardFlag.src = country.flags?.png || "https://flagcdn.com/us.svg";
        cardName.textContent = country.name?.common || "Unknown";
        cardRegion.textContent = `${country.region}${country.subregion ? ` • ${country.subregion}` : ''}`;
        cardCapital.textContent = country.capital?.join(", ") || "N/A";
        cardPopulation.textContent = country.population?.toLocaleString() || "N/A";
 
        if (country.languages) {
            cardLanguage.textContent = Object.values(country.languages).join(", ");
        } else {
            cardLanguage.textContent = "N/A";
        }
        if (country.currencies) {
            const currencyCode = Object.keys(country.currencies)[0];
            const currency = country.currencies[currencyCode];
            cardCurrency.textContent = `${currency.name} (${currency.symbol || "—"})`;
        } else {
            cardCurrency.textContent = "N/A";
        }
        
        resultsContainer.appendChild(countryCard);
    });
}
