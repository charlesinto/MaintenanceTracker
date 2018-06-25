$(function(){
    let request = [];
    toogelMenu();
    getUserRequest();
    closeAndOpenModal();
})

let closeAndOpenModal = function(){
    $('.close').on('click',()=>$('.modal').hide());
}
//controls the toggling from make request to view request div
toogelMenu = function(){
    $('.menu-item').hide();
   let item_id = $('li.active a').attr('href');
   $(item_id).show();
   $('li').on('click',function(e){
       e.cancelBubble = true;
    //    e.preventDefualt();
       let clicked_list_item = $(this).first()
       clicked_div_id = clicked_list_item[0].firstChild.href.split('#')[1]
       if(typeof clicked_div_id !== undefined && clicked_div_id !== ''){
            $('.menu-item').hide();
            //    $('li.active').removeClass('active')
            //    $(this).addClass('active')
            $('div#'+ clicked_div_id).show();
       }
      
   })
}
// get all the request of a user
let getUserRequest = function(){
    let status = -1;
    //block the ui until a complete fetch is made
    $('div.blockUi').show();
    fetch(window.origin + '/api/v1/users/requests',{
        method: 'GET',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json',
            'authorization': localStorage.getItem('token')
        }
    })
    .then((res)=> { status = res.status; return res.json()})
    .then((data)=>{
        $('div.blockUi').hide();
        //if a sucessful request is made
        console.log(status)
        if(status === 200){
            window.style = '';
            let obj = data.requests
            if(typeof obj !== "undefined" && obj.length > 0){
                request = obj
                let count = 1;
                //loop through the array of request and append it to a table
                request.forEach(element => {
                    $('table.mobile-table tbody').append('<tr><td>' +count+'</td><td class="r_id">'+element.id+'</td><td  class="open"><a href="#">' + element.item+'</a></td><td><div class="e_pen"><span class="edit">'
                    +'<a href = ""><img class="edit_pencil" src= "/asset/edit_pencil.svg"/></a></span></div></td></tr>')
                    $('table.desktop-table tbody').append('<tr><td>' +count+'</td><td>'+element.id+'</td><td>' + element.item+'</td><td>'+element.complaints+
                      '</td><td>'+element.datecreated+'</td><td><div class= "label">'+element.status+'</div></td><td><div class="e_pen"><span class="edit">'
                      +'<a href = ""><img class="edit_pencil" src= "/asset/edit_pencil.svg"/></a></span></div></td></tr>')
                      if(element.status !== 'PENDING'){
                        let e = $('table.mobile-table tbody tr').eq(count - 1).find('td div.e_pen').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgb(235, 229, 231)", "padding-left":"10px","padding-right":"10px", "cursor":"arrow"});
                        $('table.mobile-table tbody tr').eq(count - 1).find('td div.e_pen a').attr("href", "#");
                        $('table.desktop-table tbody tr').eq(count - 1).find('td div.e_pen a').attr("href", "#");
                        $('table.desktop-table tbody tr').eq(count - 1).find('td div.e_pen').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgb(235, 229, 231)", "cursor":"arrow"});
                        console.log(e);
                        // $('table.mobile-table tbody tr td div.e_pen').css({"border":"1px solid #00f71c", "background":"#de4567"})
                      }
                      //change the label for status of request depending on the status of a request
                      if(element.status === 'PENDING'){
                         $('table.desktop-table tbody tr').eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(215, 189, 16, 0.99)","width":"40px", "padding-left":"10px","padding-right":"10px"});
                      }
                      else if(element.status === 'REJECTED'){
                        $('table.desktop-table tbody tr').eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(215, 33, 16, 0.94)","width":"40px"});
                      }
                      else if(element.status === 'RESOLVED'){
                        $('table.desktop-table tbody tr').eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(30, 215, 16, 0.97)","width":"40px"});
                      }
                      else if(element.status === 'APPROVED'){
                        $('table.desktop-table tbody tr').eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(16, 98, 215, 0.94)","width":"40px"});
                      }
                    count++;
                });
                //add click event listener that will trigger the modal when users click on the itemm of a request
                loadModal();
                
            }
        }
        else if(status === 404){
            $('table.mobile-table tbody').append('<tr><td colspan="4">No Record</td></tr>');
            $('table.desktop-table tbody').append('<tr><td colspan="7">No Record</td></tr>');
        } 
    })
    .catch((err)=>{
        $('div.blockUi').hide();
        console.log(err);
    })
}

let loadModal = function(){
    $('.open').on('click',function(){
        //open modal
        console.log('d',this)
        let request_id = $(this).closest('tr').find('td.r_id').text();
        //customize the modal with the details of the request
        populateModal(request_id);
    })
}

let populateModal = function(request_id){
    console.log(request_id)
    window.request.forEach(element => {
       // console.log(element)
        if(element.id === parseInt(request_id)){
            let date = element.datecreated.split('T')[0]
            if(element.status === 'PENDING'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info">'+element.complaints+'</div><div class= "modal-info pending">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }
            else if(element.status === 'APPROVED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info">'+element.complaints+'</div><div class= "modal-info approved">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
                
            }
            else if(element.status === 'REJECTED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info">'+element.complaints+'</div><div class= "modal-info rejected">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }
            else if(element.status === 'RESOLVED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info">'+element.complaints+'</div><div class= "modal-info resolved">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }

        }
    })
    //shows the modal
    $('.modal').show()
}