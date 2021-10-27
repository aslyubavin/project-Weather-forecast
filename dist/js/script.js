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
        weatherBlock = document.querySelector('.weather');

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
    });

    //=================================================================== weather api
    const api = {
        key: 'c04385b4f6f09f048e333ea817afc1ca',
        url: 'https://api.openweathermap.org/data/2.5/'
    };

    function getData(value) {
        fetch(`${api.url}weather?q=${value}&appid=${api.key}`)
            .then(data => {
                return data.json();
            })
            .then(displayData);
    }

    function displayData(data) {
        console.log(data);
    }

    mainForm.addEventListener('submit', (e) => {
        e.preventDefault();
        getData(mainInput.value);
        mainForm.reset();
        mainWrapper.classList.add('search__wrapper_active');
        weatherBlock.classList.remove('disN');
    });
});