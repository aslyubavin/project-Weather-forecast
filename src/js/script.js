'use strict';

window.addEventListener('DOMContentLoaded', () => {
    //=================================================================== first animation
    const mainLogo = document.querySelector('.header__logo'),
        mainWrapper = document.querySelector('.search__wrapper'),
        mainTitle = document.querySelector('.search__title'),
        mainSubtitle = document.querySelector('.search__subtitle'),
        mainForm = document.querySelector('.search__form'),
        mainInput = document.querySelector('.search__input'),
        mainButton = document.querySelector('.search__button'),
        mainPhoto = document.querySelector('.search__photo'),
        weatherBlock = document.querySelector('.weather'),
        dailyCard = document.querySelector('.forecast-daily'),
        dailyBtn = document.querySelector('.forecast-daily-day__button'),
        hourlyBtn = document.querySelector('.forecast-daily-hour__button');

    function showBlock(selector, activeClass) {
        selector.classList.remove('op-0');
        selector.classList.add(activeClass);
    }

    showBlock(mainTitle, 'op-1');
    setTimeout(showBlock, 400, mainSubtitle, 'op-1');
    setTimeout(showBlock, 800, mainInput, 'op-1');
    setTimeout(showBlock, 1200, mainButton, 'op-1');
    setTimeout(showBlock, 1200, mainPhoto, 'op-1_img');

    //=================================================================== active btn
    mainLogo.addEventListener('click', () => {
        mainWrapper.classList.remove('search__wrapper_active');
        weatherBlock.classList.add('disN');
        dailyCard.classList.remove('forecast-daily_active');
        dailyBtn.classList.add('button_active');
        hourlyBtn.classList.remove('button_active');
    });

    function rotateCard(btn) {
        btn.addEventListener('click', () => {
            dailyCard.classList.toggle('forecast-daily_active');
            dailyBtn.classList.toggle('button_active');
            hourlyBtn.classList.toggle('button_active');
        });
    }

    rotateCard(hourlyBtn);
    rotateCard(dailyBtn);

    //=================================================================== weather api
    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getCurrentData(mainInput.value);
        mainForm.reset();
        mainWrapper.classList.add('search__wrapper_active');
        weatherBlock.classList.remove('disN');
    });

    const api = {
        key: 'c04385b4f6f09f048e333ea817afc1ca',
        url: 'https://api.openweathermap.org/data/2.5/'
    };

    let city = document.querySelector('.weather__main-city'),
        date = document.querySelector('.weather__main-date'),
        temp = document.querySelector('.weather__main-temp'),
        icon = document.querySelector('.weather__main-icon'),
        descr = document.querySelector('.weather__main-descr'),
        feel = document.querySelector('.weather__main-feel'),
        minmaxTemp = document.querySelector('[data-article="minmax"]'),
        humidity = document.querySelector('[data-article="humidity"]'),
        pressure = document.querySelector('[data-article="pressure"]'),
        wind = document.querySelector('[data-article="wind"]');

    function getCurrentData(value) {
        fetch(`${api.url}weather?q=${value}&units=metric&appid=${api.key}`)
            .then(data => {
                return data.json();
            })
            .then(displayData)
            .then(getForecastData);
    }

    function getForecastData(coord) {
        fetch(`${api.url}onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&exclude=minutely&appid=${api.key}`)
            .then(data => {
                return data.json();
            })
            .then(data => {
                console.log(data);
            });
    }

    function displayData(data) {
        console.log(data);

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let currentDate = new Date(data.dt * 1000);

        if (data.cod == 400 || data.cod == 404) {
            city.innerText = 'City not found';
            date.innerText = 'Enter the correct city';
            temp.innerHTML = '--&deg';
            icon.src = `img/error-icon.svg`;
            descr.innerText = '';
            feel.innerHTML = '';

            minmaxTemp.innerHTML = '--';
            humidity.innerText = '--';
            pressure.innerText = '--';
            wind.innerText = '--';
        } else {
            city.innerText = data.name;
            date.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()} ${currentDate.getFullYear()}`;
            temp.innerHTML = `${Math.round(+data.main.temp)}&deg`;
            icon.src = `img/${data.weather[0].icon}-icon.svg`;
            descr.innerText = toUpperCaseFirstChar(data.weather[0].description);
            feel.innerHTML = `Feels like ${Math.round(data.main.feels_like)}&deg`;

            minmaxTemp.innerHTML = `${Math.round(+data.main.temp_min)}&deg / ${Math.round(+data.main.temp_max)}&deg`;
            humidity.innerText = `${data.main.humidity} %`;
            pressure.innerText = `${data.main.pressure} mb`;
            wind.innerText = `${Math.round(data.wind.speed)} m/s`;

            return data.coord;
        }
    }

    function toUpperCaseFirstChar(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }


});