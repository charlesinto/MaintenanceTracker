import connectToDb from './connectToDb';

let executeQuery = function(sql, params){
    return new Promise((resolve,reject)=>{
        connectToDb().then((client,done)=>{
            if(typeof params !== undefined && params.length > 0){
                client.query(sql,params,(err,result)=>{
                    if(err){
                        console.log('err1',err)
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
            }else{
                client.query(sql,(err,result)=>{
                    if(err){
                        console.log('err1',err)
                        reject(err);
                    }else{
                        resolve(result)
                    }
                })
            }   
                
            
        })
        .catch((err)=>{
                console.log('err2',err)
                reject(err);
        })
    })
    
}

export default executeQuery;