$(document).ready(function () {
    'use strict';

    // SAY HELLO animation
    if ( $('.offer-home__say-hello').length && window.innerWidth > 992 ) {
        let typed = new Typed(".offer-home__say-hello", {
            strings: ['Say<br> Hello'],
            typeSpeed: 70,
            startDelay: 0,
            backSpeed: 30,
            showCursor: false,
        });
    }

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

    if (is_mobile) {
        $('.internal-nav .menu-item-has-children').on('click', function () {
            $(this).toggleClass('menu-item-has-children--open');
            $(this).find('.sub-menu').slideToggle(300);
        });
    }

    // Instagram post output
    let tok = '7935439629.1677ed0.48bce5c9f2b84c1c9a085aa9dc7f2b60',
        userid = 7935439629,
        quantity = 6;

    $.ajax({
        url: 'https://api.instagram.com/v1/users/' + userid + '/media/recent',
        dataType: 'jsonp',
        type: 'GET',
        data: {access_token: tok, count: quantity},
        success: function(result){
            console.log(result);
            for( let x in result.data ) {
                $('ul.gallery-instagram').append(`
                    <li class="gallery-instagram__item">
                        <a class="gallery-instagram__link" href="${result.data[x].images.standard_resolution.url}" data-fancybox="instagram">
                            <img class="gallery-instagram__img" src="${result.data[x].images.low_resolution.url}" width="200" height="200" alt="">
                        </a>
                    </li>`);
                // result.data[x].images.thumbnail.url - URL картинки 150х150
                // result.data[x].images.low_resolution.url - это URL картинки среднего разрешения, 320х320
                // result.data[x].images.standard_resolution.url - URL картинки 640х640
                // result.data[x].link - URL страницы данного поста в Инстаграм
            }
        },
        error: function(result){
            console.log(result);
        }
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
    $('[data-fancybox="instagram"]').fancybox({
        touch : false,
        backFocus : false,
    });

    $('.three-questions-form__button').fancybox({
        src  : '.tips-popup',
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

    // Transferring data from "Answer to three questions" in the form
    let threeQuestionsFormButton = document.querySelector('.three-questions-form__button');
    let threeQuestionsForm = document.querySelector('.three-questions-form');
    let threeQuestionsFormFields = threeQuestionsForm.querySelectorAll('.checkbox-list__field');
    let tipsPopupForm = document.querySelector('.tips-popup__form');

    threeQuestionsFormButton.addEventListener('click', function () {
        threeQuestionsFormFields.forEach(function (item, index, array) {

            let name = item.getAttribute('name');
            let targetField = tipsPopupForm.querySelector(`input[name="${name}"]`);

            targetField.value = item.checked ? item.value : '';
        });
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
                $.fancybox.close();
                $('.loader').fadeIn();

                $.ajax({
                    url: `${templateUrl}/tpl-sys-request.php`,
                    type: 'POST',
                    data: new FormData(form),
                    processData: false,
                    contentType: false,
                    beforeSend: function(){

                    },
                    success: function (data) {
                        setTimeout(function () {
                            $('.loader').fadeOut();
                        },800);

                        setTimeout(function () {
                            $.fancybox.open({
                                src: '.modal-thanks',
                                type: 'inline',
                                touch: false,
                                backFocus: false
                            });
                        },1100);

                        jQuery(form).find(".form__field").each(function(){ jQuery(this).val(''); });
                    }
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
