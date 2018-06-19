import jwt from 'jsonwebtoken';

let assignToken = function(payload){
    let token = process.env.SECRET_KEY || 'brillianceisevenlydistributed';
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,token,{expiresIn:'7 days'},(err,token)=>{
            if(err){
                reject(err);       
            }else{
                resolve(token);
            }
        })
            
    })
}
export default assignToken;