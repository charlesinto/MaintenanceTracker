$(()=>{
    let slideIndex = 1;
    showSlides(slideIndex);
    $('.prev').off('').click(()=>{plusSlides(-1)});
    $('.next').off('').click(()=>{plusSlides(1)});
    function plusSlides(n) {
        slideIndex+=n;
        console.log(slideIndex);
        showSlides(slideIndex);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }
    function showSlides(n) {
        console.log('n', n);
         var i;
         var slides = $('.mySlides');
         var dots = $('.dot')
         if (n > slides.length) {slideIndex = 1}    
         else if (n < 1) {slideIndex = slides.length}
         for (i = 0; i < slides.length; i++) {
             slides[i].style.display = "none";  
         }
        //  for (i = 0; i < dots.length; i++) {
        //      dots[i].className = dots[i].className.replace(" active", "");
        //  }
         slides[slideIndex-1].style.display = "block";  
        // dots[slideIndex-1].className += " active";
    }
    
   
})
 

