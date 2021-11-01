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
        forecastBlock = document.querySelector('.forecast'),
        dailyCard = document.querySelector('.forecast-daily'),
        dailyBtn = document.querySelector('.forecast-daily-day__button'),
        hourlyBtn = document.querySelector('.forecast-daily-hour__button'),
        weeklyBtn = document.querySelector('.forecast-weekly__button'),
        longForecastCard = document.querySelector('.forecast-weekly__long'),
        daylengthBlock = document.querySelector('.daylength');

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
        longForecastCard.classList.remove('forecast-weekly__long_active');
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

    function showLongForecast(btn) {
        btn.addEventListener('click', () => {
            longForecastCard.classList.toggle('forecast-weekly__long_active');
        });
    }

    showLongForecast(weeklyBtn);

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

    function toUpperCaseFirstChar(str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    function setZero(num) {
        if (num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function getCurrentData(value) {
        fetch(`${api.url}weather?q=${value}&units=metric&appid=${api.key}`)
            .then(data => {
                return data.json();
            })
            .then(displayCurrentWeather);
    }

    function displayCurrentWeather(data) {
        console.log(data);
        let city = document.querySelector('.weather__main-city'),
            date = document.querySelector('.weather__main-date'),
            temp = document.querySelector('.weather__main-temp'),
            icon = document.querySelector('.weather__main-icon'),
            descr = document.querySelector('.weather__main-descr'),
            feel = document.querySelector('.weather__main-feel'),
            minmaxTemp = document.querySelector('[data-article="minmax"]'),
            humidity = document.querySelector('[data-article="humidity"]'),
            pressure = document.querySelector('[data-article="pressure"]'),
            wind = document.querySelector('[data-article="wind"]'),
            timezoneOffset = data.timezone,
            currentDate;

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        if (timezoneOffset == 10800) {
            currentDate = new Date(data.dt * 1000);
        } else {
            currentDate = new Date((data.dt + timezoneOffset - 10800) * 1000);
        }

        if (data.cod == 400 || data.cod == 404) {
            city.innerText = 'City not found';
            date.innerText = 'Enter the correct city';
            temp.innerHTML = '--&deg;';
            icon.src = `img/error-icon.svg`;
            descr.innerText = '';
            feel.innerHTML = '';

            minmaxTemp.innerHTML = '--';
            humidity.innerText = '--';
            pressure.innerText = '--';
            wind.innerText = '--';

            forecastBlock.style.opacity = '0';
            forecastBlock.style.visibility = 'hidden';
            daylengthBlock.style.opacity = '0';
            daylengthBlock.style.visibility = 'hidden';
        } else {
            forecastBlock.style.opacity = '1';
            forecastBlock.style.visibility = 'visible';
            daylengthBlock.style.opacity = '1';
            daylengthBlock.style.visibility = 'visible';

            city.innerText = data.name;
            date.innerText = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()} ${currentDate.getFullYear()} | ${setZero(currentDate.getHours())}:${setZero(currentDate.getMinutes())}`;
            temp.innerHTML = `${Math.round(+data.main.temp)}&deg;`;
            icon.src = `img/${data.weather[0].icon}-icon.svg`;
            descr.innerText = toUpperCaseFirstChar(data.weather[0].description);
            feel.innerHTML = `Feels like ${Math.round(data.main.feels_like)}&deg;`;

            minmaxTemp.innerHTML = `${Math.round(+data.main.temp_min)}&deg; / ${Math.round(+data.main.temp_max)}&deg;`;
            humidity.innerText = `${data.main.humidity} %`;
            pressure.innerText = `${data.main.pressure} mb`;
            wind.innerText = `${Math.round(data.wind.speed)} m/s`;

            getForecastData(data.coord);
        }
    }

    function getForecastData(coord) {
        fetch(`${api.url}onecall?lat=${coord.lat}&lon=${coord.lon}&units=metric&exclude=minutely&appid=${api.key}`)
            .then(data => {
                return data.json();
            })
            .then(displayForecast);
    }

    function displayForecast(data) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            timezoneOffset = data.timezone_offset;

        function getCorrectDate(date) {
            if (timezoneOffset == 10800) {
                return new Date(date * 1000);
            } else {
                return new Date((date + timezoneOffset - 10800) * 1000);
            }
        }

        function displayDailyForecast() {
            let morningTemp = document.querySelector('[data-temp="morning"]'),
                afternoonTemp = document.querySelector('[data-temp="afternoon"]'),
                eveningTemp = document.querySelector('[data-temp="evening"]'),
                nightTemp = document.querySelector('[data-temp="night"]'),
                morningFeel = document.querySelector('[data-feel="morning"]'),
                afternoonFeel = document.querySelector('[data-feel="afternoon"]'),
                eveningFeel = document.querySelector('[data-feel="evening"]'),
                nightFeel = document.querySelector('[data-feel="night"]');

            morningTemp.innerHTML = `${Math.round(data.daily[0].temp.morn)}&deg;`;
            afternoonTemp.innerHTML = `${Math.round(data.daily[0].temp.day)}&deg;`;
            eveningTemp.innerHTML = `${Math.round(data.daily[0].temp.eve)}&deg;`;
            nightTemp.innerHTML = `${Math.round(data.daily[0].temp.night)}&deg;`;

            morningFeel.innerHTML = `${Math.round(data.daily[0].feels_like.morn)}&deg;`;
            afternoonFeel.innerHTML = `${Math.round(data.daily[0].feels_like.day)}&deg;`;
            eveningFeel.innerHTML = `${Math.round(data.daily[0].feels_like.eve)}&deg;`;
            nightFeel.innerHTML = `${Math.round(data.daily[0].feels_like.night)}&deg;`;
        }

        displayDailyForecast();

        function displayHourlyForecast() {
            let hour = document.querySelectorAll('.forecast-daily-hour__time'),
                temp = document.querySelectorAll('.forecast-daily-hour__temp'),
                descr = document.querySelectorAll('.forecast-daily-hour__descr');

            hour.forEach((hour, key) => {
                hour.innerText = `${getCorrectDate(data.hourly[key].dt).getHours()}:00`;
            });
            temp.forEach((temp, key) => {
                temp.innerHTML = `${Math.round(data.hourly[key].temp)}&deg;`;
            });
            descr.forEach((descr, key) => {
                descr.innerText = toUpperCaseFirstChar(data.hourly[key].weather[0].main);
            });
        }

        displayHourlyForecast();

        function displayShortForecast() {
            let date = document.querySelectorAll('.forecast-weekly__date'),
                dayTemp = document.querySelectorAll('.forecast-weekly__temp-day'),
                nightTemp = document.querySelectorAll('.forecast-weekly__temp-night'),
                icon = document.querySelectorAll('.forecast-weekly__icon');

            date.forEach((day, key) => {
                day.innerText = `${dayNames[getCorrectDate(data.daily[key].dt).getDay()]} ${getCorrectDate(data.daily[key].dt).getDate()}`;
            });
            dayTemp.forEach((dayTemp, key) => {
                dayTemp.innerHTML = `${Math.round(data.daily[key].temp.day)}&deg;`;
            });
            nightTemp.forEach((nightTemp, key) => {
                nightTemp.innerHTML = `${Math.round(data.daily[key].temp.night)}&deg;`;
            });
            icon.forEach((icon, key) => {
                icon.src = `img/${data.daily[key].weather[0].icon}-icon.svg`;
            });
        }

        displayShortForecast();

        function displayLongForecast() {
            let date = document.querySelectorAll('.forecast-weekly__table-date'),
                temp = document.querySelectorAll('.forecast-weekly__table-temp'),
                icon = document.querySelectorAll('.forecast-weekly__table-icon img'),
                humidity = document.querySelectorAll('.forecast-weekly__table-humidity'),
                pressure = document.querySelectorAll('.forecast-weekly__table-pressure'),
                wind = document.querySelectorAll('.forecast-weekly__table-wind'),
                feel = document.querySelectorAll('.forecast-weekly__table-feel');

            date.forEach((date, key) => {
                date.innerText = `${dayNames[getCorrectDate(data.daily[key].dt).getDay()]} ${getCorrectDate(data.daily[key].dt).getDate()}`;
            });
            temp.forEach((temp, key) => {
                temp.innerHTML = `<span>${Math.round(data.daily[key].temp.day)}&deg;</span> / <span>${Math.round(data.daily[key].temp.night)}&deg;</span>`;
            });
            icon.forEach((icon, key) => {
                icon.src = `img/${data.daily[key].weather[0].icon}-icon.svg`;
            });
            humidity.forEach((humidity, key) => {
                humidity.innerText = Math.round(data.daily[key].humidity);
            });
            pressure.forEach((pressure, key) => {
                pressure.innerText = Math.round(data.daily[key].pressure);
            });
            wind.forEach((wind, key) => {
                wind.innerText = Math.round(data.daily[key].wind_speed);
            });
            feel.forEach((feel, key) => {
                feel.innerHTML = `${Math.round(data.daily[key].feels_like.day)}&deg;`;
            });
        }

        displayLongForecast();

        function displayDaylengthInfo() {
            let sunriseTime = document.querySelector('.daylength-info__time_sunrise'),
                sunsetTime = document.querySelector('.daylength-info__time_sunset'),
                daylength = document.querySelector('.daylength-info__duration');

            function displayCurrentTime(date, selector) {
                let currentHours,
                    currentMinutes;

                currentHours = getCorrectDate(date).getHours(),
                    currentMinutes = getCorrectDate(date).getMinutes();

                selector.innerText = `${setZero(currentHours)}:${setZero(currentMinutes)}`;
            }

            displayCurrentTime(data.current.sunrise, sunriseTime);
            displayCurrentTime(data.current.sunset, sunsetTime);

            function getDaylength() {
                let sunriseDate = new Date(data.current.sunrise * 1000),
                    sunsetDate = new Date(data.current.sunset * 1000);
                const daylength = {
                    hours: Math.floor((sunsetDate - sunriseDate) / 1000 / 60 / 60),
                    minutes: Math.floor(((sunsetDate - sunriseDate) / 1000 / 60) % 60)
                };
                return daylength;
            }

            daylength.innerHTML = `<span>Daylength</span><br>${getDaylength().hours} hours ${getDaylength().minutes} minutes`;
        }

        displayDaylengthInfo();
    }

});