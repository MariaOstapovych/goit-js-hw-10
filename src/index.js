import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries'

const DEBOUNCE_DELAY = 300;


const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener("input", debounce(onBoxSearch, DEBOUNCE_DELAY));

function onBoxSearch() {
    const country = searchBox.value.trim()
    if (country === '') {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
    }
    fetchCountries(country)
        .then(data => {
            countryList.innerHTML = renderCountryList(data);
            if (data.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                countryList.innerHTML = '';
            }else if (data.length === 1) {
                countryInfo.innerHTML = createCountryCard(data);
                countryList.innerHTML = '';
            } else {
                countryInfo.innerHTML = '';
            }
        })
        .catch(err => Notiflix.Notify.failure('Oops, there is no country with that name'));
}


function renderCountryList(arr) {
    return arr.map(({ name, flags: {svg}}) => 
    `<li>
    <img src="${svg}" alt="${name} flag">
    <p>${name}</p>
    </li>`).join("");
}


function createCountryCard(arr) {
    return arr.map(({ name, capital, population, flags: { svg }, languages: { nativeName } }) => `
     <div class="country-header">
      <img src="${svg}" alt="${name} flag">
      <h2>${name}</h2>
     </div>
      <p><b>Capital:</b> ${capital}</p>
      <p><b>Population:</b> ${population}</p>
      <p><b>Languages:</b> ${nativeName}</p>
  `).join("");
}




