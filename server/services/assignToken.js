import jwt from 'jsonwebtoken';

let assignToken = function(payload){
    return new Promise((resolve,reject)=>{
        jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:'6h'},(err,token)=>{
            if(err){
                reject(err);       
            }else{
                resolve(token);
            }
        })
            
    })
}
export default assignToken;