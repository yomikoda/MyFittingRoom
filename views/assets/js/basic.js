$(window).resize(function () {
    var width = window.innerWidth;
    console.log("width :" + width);
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    console.log("height :" + height);
});


//$('#burger').click(function () {
//    $('#burger').toggleClass('clickedburger');
//    $('header').toggleClass('responsivetab');
//    //ERASE CONSOLE LOGS   
//    if ($('#burger').hasClass('clickedburger')) {
//        $('header>h1>img').attr("src", '/assets/img/logo-silver-act-white.svg');
//        $('header').css({
//            'height': height,
//            'transition': 'all ease 1s'
//        });
//        $('body').css({
//            'overflow': 'hidden',
//            'transition': 'all ease 1s'
//        });
//    } else {
//        $('header>h1>img').attr("src", '/assets/img/logo-silver-act.svg');
//        $('header').css({
//            'height': '100px',
//            'transition': 'all ease 1s'
//        });
//        $('body').css({
//            'overflow': 'scroll',
//            'transition': 'all ease 1s'
//        });
//
//    }
//
//});

$(window).scroll(function () {
    scrollvalue = $(window).scrollTop();

    console.log(scrollvalue);

    if (scrollvalue > 720) {
        var lastScrollTop = 0;
        $(window).scroll(function (event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop && scrollvalue > 720) {
                $('nav:first-child').css({
                    'position': 'fixed',
                    'right': '0',
                    'top:': '-90px'
                });
                $('nav:first-child').addClass('peekaboo');

            } else {
                $('nav:first-child').addClass('peekabooRev');
                $('nav:first-child').css({
                    'position': 'relative',
                    'right': '0',
                    'top:': '0'
                });
            }
            lastScrollTop = st;
        });

    } else {
        $('nav:first-child').css({
            'position': 'relative',
            'right': '0',
            'top:': '0'
        });
    }

});