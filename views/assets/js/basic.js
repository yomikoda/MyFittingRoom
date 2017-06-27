$(window).resize(function () {
    var width = window.innerWidth;
    console.log("width :" + width);
    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    console.log("height :" + height);
});

var width = window.innerWidth;

if (width>650){


$(window).scroll(function () {
    scrollvalue = $(window).scrollTop();

    console.log(scrollvalue);

    if (scrollvalue > 700) {
        var lastScrollTop = 0;
        $(window).scroll(function (event) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop && scrollvalue > 720) {
                $('nav:first-child').css({
                    'position': 'fixed',
                    'right': '0',
                    'top:': '-90px'
                });
                

            } else {
                
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
    
    }

else{
    
    
  $('nav:first-child').css({
                    'position': 'relative',
                    'top': '0'
                });  

    
    
}