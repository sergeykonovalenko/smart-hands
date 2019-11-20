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

}); // end ready
