import Validator from 'validator';

let inputValidator = function(res, obj){
    if(typeof obj !== "undefined" && obj !== '' && typeof obj === 'object' && typeof obj.length === "undefined"){
        
        let keys = Object.keys(obj)
        for(let i = 0; i< keys.length; i++){
            if(keys[i] === 'firstname' || keys[i] === 'lastname'){
                if( typeof obj[keys[i]] === undefined || obj[keys[i]] === '' || /[@!#$%^&*()\d~`<>?":{}+=?/]/i.test(obj[keys[i]])){
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({message:`${keys[i]}  required and no special character allowed`});
                    return false;
                }
                
            }
            if(keys[i] === 'phonenumber'){
                if( typeof obj[keys[i]] === "undefined" || obj[keys[i]] === '' || !Validator.isNumeric(obj[keys[i]]) || obj[keys[i]].length< 11){
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({message:`${keys[i]}  required and must be numbers of 11 digits`});
                    return false;
                }
            }
            if(keys[i] === 'email'){
                
                if(!Validator.isEmail(obj[keys[i]])){
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({message:`${keys[i]}  required and must be in valid format`});
                    return false;
                }
            }
           else if( typeof obj[keys[i]] === "undefined" || obj[keys[i]] === ''){
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({message:`${keys[i]} required`});
                return false;
           }
        }
        return true;
    
    }else{
        return false;
    }
}

export default inputValidator;
