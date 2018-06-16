import pool from '../DataBaseConnection';


let connectToDb = function(){
    return new Promise((resolve,reject)=>{
        pool.connect((err,client,done)=>{
            if(err){
                reject(err);
            }else{
                resolve(client,done);
            }
        })
    })
}

export default connectToDb;