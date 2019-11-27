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

    // is mobile
    const is_mobile = isMobile();
    if (is_mobile) document.documentElement.classList.add('is-mobile');

    // show/hide mobile menu
    $('.main-header__hamburger').on('click', function () {
        $('body:not(.show-internal-nav)').toggleClass('show-main-nav');
        $('body').removeClass('show-internal-nav');
    });

    $('.internal-nav-box__subcategories').on('click', function () {
        $('body').addClass('show-internal-nav');
    });

    $('.internal-nav .menu-item-has-children').on('click', function () {
        $(this).toggleClass('menu-item-has-children--open');
        $(this).find('.sub-menu').slideToggle(300);
    });

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

    // init popup
    $('.three-questions-form__button').fancybox({
        src  : '#js-tips-popup',
        type : 'inline',
        touch : false,
        backFocus : false,
        btnTpl: {
            smallBtn:
               `
               <button type="button" data-fancybox-close="" class="fancybox-button fancybox-close-small" title="Закрыть">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg>
               </button>
               `
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    // FORM PROCESSING

    $('[data-submit]').on('click', function(e) {
        e.preventDefault();
        $(this).parent('form').submit();
    });

    $.validator.addMethod(
        "regex",
        function(value, element, regexp) {
            let re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Пожалуйста, проверьте свои данные"
    );

    function valEl(el) {
        let validator = el.validate({
            rules:{
                name:{
                    required:true
                },
                email:{
                    required:true
                },
                phone:{
                    required:true,
                    regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
                }
            },
            messages:{
                name:{
                    required:''
                },
                email:{
                    required:'',
                    email:''
                },
                phone:{
                    required:'',
                    regex:''
                }
            },
            submitHandler: function (form) {
                $('.modal-order').modal('hide');
                $('.loader').fadeIn();

                $.ajax({
                    url: templateUrl + '/tpl-sys-request.php',
                    type: 'POST',
                    data: new FormData(form),
                    processData: false,
                    contentType: false,
                })
                    .always(function (response) {
                        setTimeout(function () {
                            $('.loader').fadeOut();
                        },800);
                        setTimeout(function () {
                            $('.modal-thanks').modal('show');
                            $( '.order__field' ).val('');
                        },1100);
                    });

                return false;
            }
        });
    }

    $('.js-form').each(function() {
        valEl( $(this) );
    });

    ////////////////////////////////////////////////////////////////////////////

    // masked input
    $('input[type="tel"]').mask('+7 (999) 999-99-99 ');

    // is mobile
    function isMobile() {
        return $.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    }

}); // end ready
