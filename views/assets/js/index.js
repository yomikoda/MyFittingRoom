var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    
    loop: true,
    
   autoplayDisableOnInteraction:false,
    pagination: '.swiper-pagination',
    
    autoplay:true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    
  })    

var width = window.innerWidth;

if (width>650){
$(window).scroll(function(){
         ScrollValue=$(window).scrollTop();
              
     
    if(ScrollValue>450){
    
       $('#concepttextwrapper').css({'opacity':'1'});
       $('#phoneanim').css({'opacity':'1'});
      
        
    }
    
         
     if(ScrollValue>1350){
        $('#apptextcontent').css({'opacity':'1'});
        
    }    
         
         
    if(ScrollValue>1800){
        
        $('#procontent').css({'opacity':'1'}); 
    }  
         
});}
else{
    
    $(window).scroll(function(){
         ScrollValue=$(window).scrollTop();
              
     
    if(ScrollValue>50){
    
       $('#concepttextwrapper').css({'opacity':'1'});
       $('#phoneanim').css({'opacity':'1'});
      
        
    }
    
         
     if(ScrollValue>900){
        $('#apptextcontent').css({'opacity':'1'});
        
    }    
         
         
    if(ScrollValue>1200){
        
        $('#procontent').css({'opacity':'1'}); 
    }  
         
});
    
    
    
}

$('nav ul>li:first-child').on('click',function(){
        $('html,body').stop().animate({scrollTop:$('header').offset().top},1500);
        return false;
});
$('nav ul>li:nth-child(2)').on('click',function(){
        $('html,body').stop().animate({scrollTop:$('#concept').offset().top-75},1000);
        return false;
});
$('nav ul>li:nth-child(3)').on('click',function(){
        $('html,body').stop().animate({scrollTop:$('#app').offset().top-75},1500);
        return false;
});
$('nav ul>li:nth-child(4)').on('click',function(){
        $('html,body').stop().animate({scrollTop:$('#pro').offset().top-75},1500);
        return false;
});