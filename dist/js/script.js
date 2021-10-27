'use strict';

window.addEventListener('DOMContentLoaded', () => {
    //=================================================================== first animation
    const mainLogo = document.querySelector('.header__logo'),
        mainWrapper = document.querySelector('.search__wrapper'),
        mainTitle = document.querySelector('.search__title'),
        mainSubtitle = document.querySelector('.search__subtitle'),
        mainInput = document.querySelector('.search__input'),
        mainButton = document.querySelector('.search__button'),
        mainPhoto = document.querySelector('.search__photo');

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
    mainButton.addEventListener('click', (e) => {
        e.preventDefault();
        mainWrapper.classList.add('search__wrapper_active');
    });

    mainLogo.addEventListener('click', (e) => {
        e.preventDefault();
        mainWrapper.classList.remove('search__wrapper_active');
    });
});