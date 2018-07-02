$(function(){
    $('input:submit').click(function(){
        let clickedButton = $(this).val();
        console.log('cb', clickedButton);
        if (clickedButton=== 'Sign up'){
            window.location = window.origin + '/page/signup.html';
        }
        else if(clickedButton === 'Login'){
            validateInput();
        }
    })
})

let validateInput = function(){
    console.log('hereeeee')
    let email = $("input[name='email']").val().trim();
    let password = $("input[name='pwd']").val().trim();
    let re =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i

    if(email === '' || !(re.test(email))){
        $("input[name='email']").css({"border":"1px solid red"})
        return false;
    }
    if(password === ''){
        $("input[name='pwd']").css({"border":"1px solid red"});
        return false;
    }
    let request = {email,password};
    callServer(request);
}
let callServer = function(request){
    let status = -1;
    console.log(request);
    $('div.blockUi').show();
    fetch(window.location.origin + '/api/v1/auth/login',{
        method: 'POST',
        headers:{
            'Accept': 'application/json, text/plain, */*', 
            'content-type': 'application/json'
        },
        body: JSON.stringify(request)
    })
    .then((res)=>{
        status = res.status
        console.log('res', res)
        return res.json();
    })
    .then((data)=>{
        
        console.log('dt',data)
        if (status === 200){
            localStorage.setItem('token', data.token);
            localStorage.setItem('message',`welcome ${data.user}`);
            localStorage.setItem('role_id',`${data.role}`);
            $('div.blockUi').hide();
            location.href = window.origin + '/page/user_page.html'
        }else{
            $("input[name='email']").css({"border":"1px solid red"});
            $("input[name='pwd']").css({"border":"1px solid red"})
            $('div.blockUi').hide();
        }
    })
    .catch((err)=> console.log(err));
}