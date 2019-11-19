$(document).ready(function () {
    'use strict';

    // WOW
    let wow = new WOW(
        {
            boxClass: 'wow',
            animateClass: 'animated',
            mobile: true,
        }
    );
    wow.init();

    // area slider
    $('.area-slider-box').slick({
        dots: true,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        prevArrow: '',
        nextArrow: '<button class="area-slider-box__arrow area-slider-box__arrow--next pulse-custom" type="button"><span class="visually-hidden">Вперед</span></button>',
    });

    // get the width of the scrollbar
    document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + "px");

    // smooth page scrolling
    $('.scrollto a').click(function () {
        let elementClick = '#'+$(this).attr('href').split('#')[1];
        let destination = $(elementClick).offset().top;
        jQuery('html:not(:animated),body:not(:animated)').animate({scrollTop: destination}, 800);
        return false;
    });

}); // end ready
