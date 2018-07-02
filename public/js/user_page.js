// import { Socket } from "net";

 window.modalTitle = '<div class="mod-body mod-header">'+
'<div class = "modal-detail" >Request Id</div>'+
'<div class = "modal-detail">Product</div>'+
'<div class = "modal-detail">Status</div>'+
'<div class = "modal-detail">Date Created</div>'+
'</div><div class="mod-body info"></div>'
$(function(){
    window.count = 0;
    toogelMenu();
    loadPage();
    closeAndOpenModal();
    postButtonClickEvent();
    instantUpdateTable();
})
let setPage = function(){
    switch(localStorage.getItem('role_id')){
        case '1':
          //  document.getElementsByClassName('make-request')[0].style.display = 'none';
          loadDropDown()
            .then((drpDowns)=>{
                window.dataSet1 = drpDowns.dataSet1;
                window.dataSet2 = drpDowns.dataSet2;
                getUserRequest();
                $('.pageLoad').show();
                $('.body').show();
                $('.preloader').hide();
            })
            .catch((err)=>{
                $('.pageLoad').show();
                $('.body').show();
                $('.preloader').hide();
                console.log(err);
            })
         
        break;
        case '2':
            $('.pageLoad').hide();
            $('.preloader').hide();
            $('.adminPage').show();
            $('.adminLoader').show();                
            searchOnClickListener();
            dropDownOnChangeListerner();
            textBoxOnChangeListener();
            loadAdminRequest();
            console.log('welcome admin');
        break;
        default:
          console.log('please identify yourself');
    }
}
let loadAdminRequest = function(){
    fetch(window.origin +'/api/v1/requests',{
        method: 'GET',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json',
            'authorization': localStorage.getItem('token')
        }
    })
    .then((res)=>{window.status = res.status;return res.json()})
    .then((data)=>{
        console.log('sta',window.status);
        console.log('dt',data);
        if(window.status == 200){
            window.request = data.requests;
            setAdminTable();
        }
    })
    .catch((err)=>console.log(err))
}
let toggleUl = function(target){
    if($(target).css('display') === 'none'){
        $(target).show()
    }else{
        $(target).hide();
    }

}
let postButtonClickEvent = function(){
    $('input:submit').on('click', function(){
        if( $(this).val() === 'log Request'){
            postRequest();
        }
    })
}
let maginifierClick = function(){
    $('img#viewRequest').click(function(){
        console.log('mouse hovers in')
        let requestId = parseInt($(this).closest('tr').find('td.r_id').text().trim());
        $('.modal').show();
        $('.request-detail').empty();
        $('.request-detail').append('<div class ="request-com">Complaints:</div><div class="complaint-details"><textarea id="complaints" disabled>'+'</textarea>'+'</div>')
        formatModalForComplaints();
        viewComplaints(requestId);
    })
}
let postRequest = function(){
    let requestcategory = $('select[name=requestCategory] option:selected').text().trim();
    let itemcategory = $('select[name=itemcategory] option:selected').text().trim();
    let item = $('select[name=item] option:selected').text().trim();
    let complaints = $('textarea[name=complain]').val().trim();
    if(requestcategory === ''){
        $('select[name=requestCategory]').css({"border":"1px solid red"})
        return false
    }else{
        $('select[name=requestCategory]').css({"border":"1px solid #333"})
    }
    if(itemcategory === ''){
        $('select[name=itemcategory]').css({"border":"1px solid red"})
        return false
    }else{
        $('select[name=itemcategory]').css({"border":"1px solid #333"})
    }
    if(item === ''){
        $('select[name=item]').css({"border":"1px solid red"})
        return false
    }else{
        $('select[name=item]').css({"border":"1px solid #333"})
    }
    if(complaints === ''){
        $('textarea[name=complain]').css({"border":"1px solid red"})
        return false
    }else{
        $('textarea[name=complain]').css({"border":"1px solid #333"})
    }

    $('div.pageLoad').show();
    fetch(window.origin + '/api/v1/user/request',{
        method: 'POST',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json',
            'authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({item,itemcategory,requestcategory,complaints})
    })
    .then((res)=>{window.status = res.status; return res.json()})
    .then((data)=>{
        console.log('nr',data.newRequest)
        if(typeof window.status !== "undefined" || window.status === 201){
            alert('Request Posted Successfully')
            socket.emit('newRequest',{message:'POST', request: data.newRequest});
            getUserRequest();
        }
    })
}
let closeAndOpenModal = function(){
    $('.close').on('click',()=>$('.modal').hide());
}
//controls the toggling from make request to view request div
let loadPage = function(){
    setPage();
}
let loadDropDown = function(){
    return new Promise((resolve,reject)=>{
        console.log('here');
        fetch(window.origin + '/api/v1/users/requests',{
            method: 'GET',
            headers:{
                'Accept': 'application/json, text/plain, */*', 
                'content-type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
        .then((res)=> { window.status = res.status; return res.json()})
        .then((data)=>{
            //if a sucessful request is made
            if(typeof window.status !== "undefined" || window.status == 200){
                console.log('if 2')
                 window.obj = data;
                if(typeof window.obj !== "undefined"){
                    console.log('dt',window.obj)
                    resolve(data);
                }
            }
            else if(typeof window.status !== "undefined" || window.status == 404){
                console.log('if 2')
                window.obj = data;
               if(typeof window.obj !== "undefined"){
                   console.log('dt',window.obj)
                   resolve(data);
               }
            }
        })
        .catch((err)=>{
            reject(err);
        })
    })
}
toogelMenu = function(){
    $('nav.nav-bar').on('click',function(){toggleUl('.operation-menu');})
    $('div.user-tools').on('click',function(){toggleUl('div.profile-menu');})
    // $('ul.mobile-menu li').on('click',function(){$('ul.mobile-menu').hide(); console.log('hide')})
    $('.menu-item').hide();
   let item_id = $('li.active a').attr('href');
   $(item_id).show();
   $('li').on('click',function(e){
       e.stopPropagation();
       $('li.active').removeClass('active');
       $(this).addClass('active');
       $(this).first().css({"color":"#fff"})
       e.cancelBubble = true;
    //    e.preventDefualt();
       let clicked_list_item = $(this).first()
       clicked_div_id = clicked_list_item[0].firstChild.href.split('#')[1]
       if(typeof clicked_div_id !== undefined && clicked_div_id !== ''){
            $('.menu-item').hide();
            //    $('li.active').removeClass('active')
            //    $(this).addClass('active')
            $('ul.mobile-menu').hide();
            toggleUl('.operation-menu');
            toggleUl('div.profile-menu');
            $('div#'+ clicked_div_id).show();
            clearDropDown($('select[name=itemcategory]'))
            setDropDown();
       }
      
   })
}
// get all the request of a user
let getUserRequest = function(){
    //block the ui until a complete fetch is made
    fetch(window.origin + '/api/v1/users/requests',{
        method: 'GET',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json',
            'authorization': localStorage.getItem('token')
        }
    })
    .then((res)=> { window.status = res.status; return res.json()})
    .then((data)=>{
        $('div.pageLoad').hide();
        switch(window.status){
            case '200':

                let obj = data.requests
                if(typeof obj !== "undefined" && obj.length > 0){
                    window.request = obj
                    let count = 1;
                    //loop through the array of request and append it to a table
                    buildTable(window.request, false);
                    //add click event listener that will trigger the modal when users click on the itemm of a request
                    loadModal();
                    setDropDown();
                }
            break;
            case '404':
                $('table.mobile-table tbody').append('<tr><td colspan="4">No Record</td></tr>');
                $('table.desktop-table tbody').append('<tr><td colspan="7">No Record</td></tr>');
                loadModal();
                setDropDown();
            break;
            default:
                console.log('none matches')
        }
        
    })
    .catch((err)=>{
        $('div.blockUi').hide();
        console.log(err);
    })
    
}
let setDropDown = function(){
    let itemCatgeory = $('select[name=itemcategory]');
    let itemCategoryDropMenu = window.dataSet1;
    itemCategoryDropMenu.forEach(element=>{
        itemCatgeory.append($('<option />').val(element.item_category_id).text(element.itemcategory.toUpperCase()))
    })
    drpDownOnchangeHandler();
}
let drpDownOnchangeHandler = function(){
    $('select[name=itemcategory]').on('change',loadItemDropDown);
}
let loadItemDropDown = function(){
    $('div.blockUi').show();
    let itemDropDowm = $('select[name=item]')
    clearDropDown(itemDropDowm);
    let item_category_id = $(this).val();
    let itemDataSet = window.dataSet2;
    itemDataSet.forEach(element=>{
        if(element.itemcategory_id === parseInt(item_category_id)){
            itemDropDowm.append($('<option />').val(element.item_id).text(element.itemname.toUpperCase()))
        }
    })
    $('div.blockUi').hide();
}
let loadModal = function(){
    $('.open').on('click',function(){
        //open modal
        console.log('d',this)
        $('.request-detail').empty();

        $('.request-detail').append(window.modalTitle);
        let request_id = $(this).closest('tr').find('td.r_id').text();
        //customize the modal with the details of the request
        populateModal(request_id);
    })
}
let clearDropDown = function(target){
    target.empty();
    target.append($('<option />').val("").text('Select Item'))
}
let addCancelClickListener = function(){
    $('.cancelRequest').on('click', function(){
        let requestid = parseInt($(this).parent().closest('tr').find('td.r_id').text().trim());
        deleteRequest(requestid);
    })
}
let deleteRequest = function(id){
   $('div.pageLoad').show();
    fetch(window.origin +'/api/v1/user/request/' + id,{
        method: 'DELETE',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json',
            'authorization': localStorage.getItem('token')
        }
    })
    .then((res)=>{window.status = res.status; return res.json()})
    .then((data)=>{
        console.log('ws',window.status)
        if(window.status == 200){
            counter = 0;
            for(i = 0;i <window.request.length; i++){
                if(window.request[i].id === id){
                    break;
                }
                counter++
            }
            console.log('id', id);
            console.log('cc',counter)
            window.request.splice(counter,1)
            window.count = window.request.length;
            buildTable(window.request,true);
            loadModal();
            
         $('div.pageLoad').hide();
        }
    })
    .catch((err)=>{
        console.log(err);
    })
}
let buildTable = function(request,REBUILD){
    $('table.mobile-table tbody').empty();
    $('table.desktop-table tbody').empty();
    count = 1;
    //empty table first
   
    request.forEach(element => {
        $('table.mobile-table tbody').append('<tr><td>' +count+'</td><td class="r_id">'+element.id+'</td><td  class="open"><a href="#">' + element.item+'</a></td><td class="perform_action"><div class="e_pen action"><span class="edit">'
        +'<a href = ""><img class="edit_pencil" src= "/asset/edit_pencil.svg"/></a></span></div><div class= "action"><img class = "cancel" src = "/asset/cancel-x.svg"></div></td></tr>')

        //build desktop table
        $('table.desktop-table tbody').append('<tr><td>' +count+'</td><td class="r_id">'+element.id+'</td><td>' + element.item+'</td><td class="view">'+'<section class= "view-complaints"><img src = "/asset/view-s.svg" id="viewRequest" class="cancel" /></section>'+
          '</td><td>'+element.datecreated+'</td><td><div class= "label">'+element.status+'</div></td><td class="perform_action"><div class="e_pen action"><span class="edit ">'
          +'<a href = ""><img class="edit_pencil" src= "/asset/edit_pencil.svg"/></a></span></div><div class= "action"><img class = "cancel cancelRequest" src = "/asset/cancel-x.svg"></div></td></tr>')
          if(element.status !== 'PENDING'){
            let e = $('table.mobile-table tbody tr').eq(count - 1).find('td div.e_pen').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgb(235, 229, 231)", "padding-left":"10px","padding-right":"10px", "cursor":"arrow"});
            $('table.mobile-table tbody tr').eq(count - 1).find('td div.e_pen a').attr("href", "#");
            $('table.desktop-table tbody tr').eq(count - 1).find('td div.e_pen a').attr("href", "#");
            $('table.desktop-table tbody tr').eq(count - 1).find('td div.e_pen').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgb(235, 229, 231)", "cursor":"arrow"});
            console.log(e);
            // $('table.mobile-table tbody tr td div.e_pen').css({"border":"1px solid #00f71c", "background":"#de4567"})
          }
          //change the label for status of request depending on the status of a request
        applyLabel(element.status, 'table.desktop-table tbody tr',count)
        count++;
    });
    addCancelClickListener();
    maginifierClick();
    $('div.pageLoad').hide();
    window.count = count;
}
let populateModal = function(request_id){
    $('div.vc-sm').remove();
     window.request.forEach(element => {
       // console.log(element)
        if(element.id === parseInt(request_id)){
            let date = element.datecreated.split('T')[0]
            if(element.status === 'PENDING'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info pending">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }
            else if(element.status === 'APPROVED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info approved">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
                
            }
            else if(element.status === 'REJECTED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info rejected">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }
            else if(element.status === 'RESOLVED'){
                $('div.info').empty();
                $('div.info').append('<div class= "modal-info">'+element.id+'</div><div class= "modal-info">'+element.item+
                '</div><div class= "modal-info resolved">'+element.status+'</div><div class= "modal-info">'+date+'</div>')
            }
            $('<div class="vc-sm label-text">Complaints</div><div class="vc-sm div"><textarea class="vc-sm text" disabled></textarea></div>').insertBefore('.modal-footer');
            $('textarea.text').val(element.complaints);
        }
    })
    //shows the modal
    $('.modal').show()
}
let viewComplaints = function(requestid){
    window.request.forEach(element=>{
        if(element.id === requestid){
            $('textarea#complaints').val(element.complaints)
        }
    })
}
let formatModalForComplaints = function(){
    $('div.vc-sm').remove();
    $('.modal-footer').addClass("modal-footer-vc")
    $('.modal-dialog').addClass("modal-dialog-vc")
    $('#complaints').addClass("textarea-vc")
    $('div.request-com').addClass("label-vc");
}
let setAdminTable = function(){
    buildAdminTable(window.request);
    $('.adminLoader').hide();
}
let applyLabel =  function(status, target, count){
    if(status === 'PENDING'){
        $(target).eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(215, 189, 16, 0.99)","width":"40px", "padding-left":"10px","padding-right":"10px"});
     }
     else if(status === 'REJECTED'){
       $(target).eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(215, 33, 16, 0.94)","width":"40px"});
     }
     else if(status === 'RESOLVED'){
       $(target).eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(30, 215, 16, 0.97)","width":"40px"});
     }
     else if(status === 'APPROVED'){
       $(target).eq(count - 1).find('td div.label').css({"border":"1px solid rgba(0,0,0,.0001)", "background":"rgba(16, 98, 215, 0.94)","width":"40px"});
     }
}
let dropDownOnChangeListerner = function(){
    $('select[name=admin-requestCategory]').on('change', function(){
        console.log('drp has changed')
      let requestcategory =  $('select[name=admin-requestCategory] option:selected').text().trim().toUpperCase();
        filterTable(window.request,requestcategory, $('input[name=request_id]').val().trim());
    })
}
let textBoxOnChangeListener = function(){
    $('input[name=request_id]').on('keyup',function(){
        console.log('fired');
        if($(this).val().trim() === ''){
            filterTable(window.request);
        }else{
            filterTable(window.request,$('select[name=admin-requestCategory] option:selected').val().trim().toUpperCase(), $(this).val().trim())
        }
    })
}
let searchOnClickListener = function(){
    $('input[type=button]').on('click',function(){
        if($(this).val() ==='Search'){
            let requestcategory = $('select[name=admin_requestcategory] option:selected').text().trim();
            let requestid = $('input[name=request_id]').val().trim();
            if(requestcategory === '' && requestid === ''){
                filterTable(window.request);
            }
            filterTable(window.request,requestcategory,requestid);
        }
    })
}
let filterTable = function(tableArray,category,id){
    if(category === '' &&  id !== ""){
        console.log('1')
        let filteredTable = tableArray.filter(element => ((element.id == id)))
        buildAdminTable(filteredTable);
    }
    else if((typeof category === "undefined" || category === '') && (typeof id === "undefined" || id === '')){
        console.log('2')
        buildAdminTable(window.request)
    }
    else if(  id == "" && category !== ''){
        console.log('3')
        let filteredTable = tableArray.filter(element => ((element.requestcategory.toUpperCase() == category)))
        buildAdminTable(filteredTable);
    }
    else if(category !== '' && id !== ''){
        console.log('4')
        console.log('here now')
        let filteredTable = tableArray.filter(element => ((element.requestcategory.toUpperCase() == category) && (element.id == id)))
        buildAdminTable(filteredTable);
    }
    
}

let buildAdminTable = function(arrayRequest){
    $('div.admin-table table.small-screen tbody').empty();
        $('div.admin-table table.big-screen tbody').empty();
    count = 1;
    if(arrayRequest.length > 0){
        arrayRequest.forEach(element=>{
            $('div.admin-table table.small-screen tbody').append(
                '<tr><td>'+ count + '</td><td class="r_id">'+element.id+'<td class= "open"><a href="#">'+element.item+'</a></td><td>'+
               '<div class="admin-action" title="Approve"><img src="/asset/approve.svg" width="32px" height="32px" ></div><div class="admin-action" title="Resolve"><img src="/asset/resolve.svg" width="32px" height="32px" ></div>' +
               '<div class="admin-action" title="Reject"><img src="/asset/reject.png" width="32px" height="32px" ></div>'+'<div class="admin-action" title="Delete"><img src="/asset/cancel-x.svg" width="32px" height="32px" ></div>'
               +'</td></tr>'
            )
            $('div.admin-table table.big-screen tbody').append(
                 '<tr><td>'+ count + '</td><td class="r_id">'+element.id+ '</td><td>'+element.requestcategory +'</td><td>'+
                 element.item+ ' <td class="view">'+'<section class= "view-complaints"><img src = "/asset/view-s.svg" width="32px" height="32px" id="viewRequest" class="cancel" /></section>'
                 +'</td><td><div class="label">'+ element.status + '</div></td><td>'+ element.datecreated + '</td><td>'+
                 '<div class="admin-action" title="Approve"><img src="/asset/approve.svg" width="32px" height="32px" ></div><div class="admin-action" title= "Resolve"><img src="/asset/resolve.svg" width="32px" height="32px" ></div>' +
               '<div class="admin-action" title="Reject"><img src="/asset/reject.png" width="32px" height="32px" ></div>'+'<div class="admin-action" title="Delete"><img src="/asset/cancel-x.svg" width="32px" height="32px" ></div>'
               +'</td></tr>'
            )
            applyLabel(element.status, 'div.admin-table table.big-screen tbody tr', count)
            count++;
        })
    }else{
        $('div.admin-table table.small-screen tbody').append('<tr><td colspan="4">No Record</td></tr>')
        $('div.admin-table table.big-screen tbody').append('<tr><td colspan="8">No Record</td></tr>')
    }
    $('div.admin-action').on('click',adminActionEventhandler);
    maginifierClick();
    loadModal();
}

let adminActionEventhandler = function(e){
    $('div.adminLoader').show();
    e.stopPropagation();
    let action = $(this)[0].title.trim().toUpperCase()
    let id = $(this).parent().closest('tr').find('td.r_id').text().trim();
    if(action == 'APPROVE'){
        fetch(`${window.origin}/api/v1/requests/${id}/approve`,{
            method: 'PUT',
            headers:{
                'Accept': 'application/json, text/plain, */*', 
                'content-type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
        .then((res)=>{window.status = res.status; return res.json()})
        .then((data)=>{
            $('div.adminLoader').hide();
            if(window.status == 200){
                //change the text of the corresponding status column to 'APPROVED'
                $(this).parent().closest('tr').find('td div.label').text('APPROVED')
                //UPDATE THE STATUS OF GLOBAL REQUEST OBJECT AND APPLY CORRESPNDING LABEL THEN RELOAD THE MODAL
                updateStatus(id,'div.admin-table table.big-screen tbody tr','APPROVED')
                socket.emit('updateStatus',{status:'APPROVED', requestId: id});
            }
        })
        .catch((err)=>console.log(err));
    }
    else if(action == 'REJECT'){
        fetch(`${window.origin}/api/v1/requests/${id}/reject`,{
            method: 'PUT',
            headers:{
                'Accept': 'application/json, text/plain, */*', 
                'content-type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
        .then((res)=>{window.status = res.status; return res.json()})
        .then((data)=>{
            $('div.adminLoader').hide();
            if(window.status == 200){
                //change the text of the corresponding status column to 'REJECTED'
                $(this).parent().closest('tr').find('td div.label').text('REJECTED')
                //UPDATE THE STATUS OF GLOBAL REQUEST OBJECT AND APPLY CORRESPNDING LABEL THEN RELOAD THE MODAL
                updateStatus(id,'div.admin-table table.big-screen tbody tr','REJECTED')
                socket.emit('updateStatus',{status:'REJECTED', requestId: id});
            }
        })
        .catch((err)=>console.log(err));
    }
    else if(action == 'RESOLVE'){
        fetch(`${window.origin}/api/v1/requests/${id}/resolve`,{
            method: 'PUT',
            headers:{
                'Accept': 'application/json, text/plain, */*', 
                'content-type': 'application/json',
                'authorization': localStorage.getItem('token')
            }
        })
        .then((res)=>{window.status = res.status; return res.json()})
        .then((data)=>{
            $('div.adminLoader').hide();
            if(window.status == 200){
                //change the text of the corresponding status column to 'RESOLVED'
                $(this).parent().closest('tr').find('td div.label').text('RESOLVED')
                //UPDATE THE STATUS OF GLOBAL REQUEST OBJECT AND APPLY CORRESPNDING LABEL THEN RELOAD THE MODAL
                updateStatus(id,'div.admin-table table.big-screen tbody tr','RESOLVED')
                socket.emit('updateStatus',{status:'RESOLVED', requestId: id});
            }
        })
        .catch((err)=>console.log(err));
    }
    else if(action == 'DELETE'){
        $('.adminLoader').hide();
    }
}
let updateStatus = function(id, target, status){
    let requests = window.request;
    let count = 1;
    requests.forEach(element =>{
        if(element.id == id){
            window.request[count - 1].status = status;
            applyLabel(status,target,count)
        }
        count++
    })
    loadModal();
}
let instantUpdateTable = function(){
    socket.on('updateStatus',function(msg){
        let cols = $('div.admin-table table.big-screen tbody tr').find('td.r_id')

        let userCols = $('table.desktop-table tbody tr').find('td.r_id')
        for(i=0; i<userCols.length;i++){
            if(userCols[i].outerText == msg.requestId){
                $('table.desktop-table tbody tr').eq(i).find('td div.label').text(msg.status);
            }
        }
        for(i = 0; i < cols.length ; i++){
            if(cols[i].outerText == msg.requestId){
                $('div.admin-table table.big-screen tbody tr').eq(i).find('td div.label').text(msg.status)
            }
          }
        updateStatus(msg.requestId,'div.admin-table table.big-screen tbody tr',msg.status );
        updateStatus(msg.requestId,'table.desktop-table tbody tr',msg.status)
    })
    socket.on('newRequest',function(msg){
        console.log('new request', msg.request[0])
        window.request.push(msg.request[0]);
        setAdminTable();
    })
}