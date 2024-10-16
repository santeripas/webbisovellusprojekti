const apiKey = 'ee65b62e6f5c95e7e37b4973'; // Laita tähän oma ExchangeRate API-avaimesi
const weatherApiKey = 'be29c4bfd559e38e52e6861d4e62be9e'; // Laita tähän OpenWeatherMap API-avaimesi
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

// Haetaan kaikki valuutat ja täytetään dropdownit
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        const fromCurrency = document.getElementById('fromCurrency');
        const toCurrency = document.getElementById('toCurrency');
        const currencies = Object.keys(data.conversion_rates);
        
        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            fromCurrency.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            toCurrency.appendChild(option2);
        });
    })
    .catch(error => console.error('Virhe haettaessa valuuttoja:', error));

// Lisää muunnosnapin toiminto
document.getElementById('convertBtn').addEventListener('click', () => {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (amount === '' || isNaN(amount)) {
        alert('Syötä kelvollinen summa.');
        return;
    }

    const convertUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`;

    fetch(convertUrl)
        .then(response => response.json())
        .then(data => {
            const result = document.getElementById('result');
            result.textContent = `${amount} ${fromCurrency} = ${data.conversion_result} ${toCurrency}`;
        })
        .catch(error => console.error('Virhe muunnoksessa:', error));
});

// Lisää sään hakutoiminto OpenWeatherMap API:lla
document.getElementById('weatherBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;

    if (city === '') {
        alert('Syötä kelvollinen kaupunki.');
        return;
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`API virhe: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const weatherResult = document.getElementById('weatherResult');
            if (data.cod === 200) {
                const temp = data.main.temp;
                const weatherDescription = data.weather[0].description;
                weatherResult.textContent = `Sää ${city}: ${temp} °C, ${weatherDescription}.`;
            } else {
                weatherResult.textContent = 'Kaupunkia ei löytynyt.';
            }
        })
        .catch(error => {
            console.error('Virhe haettaessa säätietoja:', error);
            document.getElementById('weatherResult').textContent = `Virhe: ${error.message}`;
        });
});

const favoriteCities = []; // Taulukko suosikkikaupungeille

// Tallennetaan kaupunki suosikkeihin
document.getElementById('favoriteBtn').addEventListener('click', () => {
    const city = document.getElementById('city').value;

    if (city === '' || favoriteCities.includes(city)) {
        alert('Kaupunki on jo suosikeissa tai kelvollinen kaupunki puuttuu.');
        return;
    }

    favoriteCities.push(city); // Lisätään kaupunki suosikiksi
    updateFavoriteCities(); // Päivitetään suosikkikaupungit näkyviin
});

// Funktio päivittämään suosikkikaupungit
function updateFavoriteCities() {
    const favoriteCitiesContainer = document.getElementById('favoriteCities');
    favoriteCitiesContainer.innerHTML = ''; // Tyhjennetään aiemmat suosikit

    favoriteCities.forEach(city => {
        const cityElement = document.createElement('div');
        cityElement.textContent = city;
        favoriteCitiesContainer.appendChild(cityElement);
    });
}
