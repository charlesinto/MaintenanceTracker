$(function(){
    $('input:submit').click(validatInput)
})

let validatInput = function(){
    let re =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
        if($(this).val() === 'Sign Up'){
            //get the value of input fields
            let firstname = $("input[name='fname']").val().trim();
            let lastname = $("input[name='lname']").val().trim();
            let phonenumber = $("input[name='pnumber']").val().trim();
            let email = $("input[name='email']").val().trim();
            let password = $("input[name='pwd']").val().trim();
            let confirmPassword = $("input[name='pwd2']").val().trim();
            //perform validations
            if(firstname === '' || /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(firstname)){
                $("input[name='fname']").css({"border":"1px solid red"})
                $('div#showMessage').text('* First name is required and should contain no special character').show();
                return '';
            }else{
                $('div#showMessage').text('').show();
                $("input[name='fname']").css({"border":"1px solid #ccc"})
            }
            if(lastname === ''|| /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(lastname)){
                $("input[name='lname']").css({"border":"1px solid red"});
                $('div#showMessage').text('* Last name is required and should contain no special character').show();
                return '';
            }else{
                $('div#showMessage').text('').hide();
                $("input[name='lname']").css({"border":"1px solid #ccc"})
            }
            if(phonenumber === '' || !(/\d{11}/.test(phonenumber)) ){
                $("input[name='pnumber']").css({"border":"1px solid red"})
                $('div#showMessage').text('* Phone number is required and should be numbers of 11 digits').show();
                return '';
            }else{
                $('div#showMessage').text('').hide();
                $("input[name='pnumber']").css({"border":"1px solid #ccc"})
            }
            if(email === '' || !(re.test(email))){
                $("input[name='email']").css({"border":"1px solid red"});
                $('div#showMessage').text('* email is required').show();
                return '';
            }else{
                $('div#showMessage').text('').hide();
                $("input[name='email']").css({"border":"1px solid #ccc"})
            }
            if(password === '' || !(/[a-zA-z\d]{4,}/.test(password))){
                $("input[name='pwd']").css({"border":"1px solid red"})
                $('div#showMessage').text('* Password is required and must be a minimum of 4 characters').show();
                return '';
            }else{
                $('div#showMessage').text('').hide();
                $("input[name='pwd']").css({"border":"1px solid #ccc"})
            }
            if(confirmPassword === '' || confirmPassword !== password){
                $("input[name='pwd2']").css({"border":"1px solid red"})
                $('div#showMessage').text('* Confirm password does not match password').show();
                return '';
            }else{
                $('div#showMessage').text('').hide();
                $("input[name='pwd2']").css({"border":"1px solid #ccc"})
            }
            let request = {firstname,lastname,email,phonenumber,password}
            callServer(request);
        }
}

let callServer = function(request){
    console.log(request);
    let status = -1;
    $('div.blockUi').show();
    fetch(window.location.origin + '/api/v1/auth/signup',{
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
        if (status === 201){
            console.log('dt',data)
            localStorage.setItem('token', data.token);
            localStorage.setItem('message',data.message);
            localStorage.setItem('role_id',`${data.role}`);
            $('div.blockUi').hide();
            location.href = window.origin + '/page/user_page.html'
        }else{
            $('div#showMessage').text(data.message).show();
            $('div.blockUi').hide();
        }
    })
    .catch((err)=> console.log(err));
}