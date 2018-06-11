$(function(){
    toogelMenu();
})

toogelMenu = function(){
    $('.menu-item').hide();
   let item_id = $('li.active a').attr('href');
   $(item_id).show();
   $('li').on('click',function(e){
       e.cancelBubble = true;
    //    e.preventDefualt();
       let clicked_list_item = $(this).first()
       clicked_div_id = clicked_list_item[0].firstChild.href.split('#')[1]
       $('.menu-item').hide();
    //    $('li.active').removeClass('active')
    //    $(this).addClass('active')
       $('div#'+ clicked_div_id).show();
   })
}