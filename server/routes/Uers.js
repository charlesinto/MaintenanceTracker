import express from 'express';
import assignToken from '../services/assignToken';
import trimSpace from '../services/trimWhiteSpace';
import verifyToken from '../services/verifyToken';
import Validator from 'validator';
import validateKey from '../services/validateKeys';
import inputValidate from '../services/inputValidator';
import executeQuery from '../services/queryExecutor';
import bcrypt from 'bcrypt';

let router = express.Router();

router.get('/requests', verifyToken,(req,res)=>{
    if(typeof req.token !== "undefined"){
        let loggedInUser = req.token;
        let sql = 'SELECT * FROM BASE_REQUEST WHERE user_id = $1';
        executeQuery(sql,[loggedInUser.id])
        .then((result)=>{
            let r1 = result
            let sql = 'SELECT * FROM BASE_ITEM_CATEGORY'
            let sql1 = 'SELECT * FROM BASE_ITEM'
           executeQuery(sql)
           .then((result)=>{
                   let dataSet1 = result.rows;
                   executeQuery(sql1)
                   .then((result)=>{
                           let dataSet2 = result.rows;
                           if(r1.rowCount > 0){
                                res.statusCode = 200;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message:`operation successful`,
                                    requests:r1.rows,
                                    dataSet1,
                                    dataSet2
                                })
                            }else{
                                res.statusCode = 404;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message:'No record found',
                                    requests:r1.rows,
                                    dataSet1,
                                    dataSet2
                                })
                            }
                        
                   })
                   .catch((err)=>{
                        if(r1 > 0){
                            res.statusCode = 200;
                            res.setHeader('content-type', 'application/json');
                            res.json({
                                message:`operation successful`,
                                requests:result.rows,
                                dataSet1,
                                err
                            })
                        }else{
                            res.statusCode = 404;
                            res.setHeader('content-type', 'application/json');
                            res.json({
                                message:'No record found',
                                requests:result.rows,
                                dataSet1,
                                err
                            })
                        }
                   })
               
           })
           .catch((err)=>{
                if(r1 > 0){
                    res.statusCode = 200;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message:`operation successful`,
                        requests:result.rows,
                        err
                    })
                }else{
                    res.statusCode = 404;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message:'No record found',
                        requests:result.rows,
                        err
                    })
                }
           })
            
            
        })
        .catch((err)=>{
            console.log('not here')
            res.statusCode = 404;
            console.log('err', err)
            res.setHeader('content-type', 'application/json');
            res.json({
                message:'No record found'
            })
        })
    }
})
router.delete('/request/:id', verifyToken,(req,res)=>{
    if(typeof req.token !== "undefined" || req.token !== ''){
        let user = req.token;
        let request_id = parseInt(req.params.id);
        let sql = 'DELETE FROM BASE_REQUEST WHERE id = $1 AND USER_ID = $2';
        executeQuery(sql,[request_id, user.id])
        .then((result)=>{
            res.statusCode = 200;
            res.setHeader('content-type','application/json');
            res.json({
                message:"Record deleted Sucessfully"
            })
        })
        .catch((err)=>{
            res.statusCode = 500;
            res.setHeader('content-type','application/json');
            res.json({
                message:"Service not available"
            })
        })
    }
})
router.get('/request/:id', verifyToken,(req,res)=>{
    if(typeof req.params !== "undefined" && req.params !== ''){
        let request_id = parseInt(req.params.id);
        let sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
        executeQuery(sql,[request_id])
        .then((result)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            if(result.rowCount > 0){
                res.json({
                    message:`operation successful`,
                    requests:result.rows
                })
            }else{
                res.json({
                    message:'No record found',
                    requests:result.rows
                })
            }
        })
        .catch((err)=>{
            res.statusCode = 404;
            res.setHeader('content-type', 'application/json');
            res.json({
                message:'No record found'
            })
        })

    }
})
router.post('/request',verifyToken,(req,res)=>{
    if(typeof req.token !== "undefined" && req.token !== ''){
        let user = req.token;
        let request = trimSpace(req.body);
        if(!validateKey(request,['item', 'itemcategory', 'requestcategory', 'complaints'])){
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({message:'Bad Request,one or more keys is missing'});
        }
        if(inputValidate(res, request)){
            let sql = 'INSERT INTO BASE_REQUEST(requestcategory,item, itemcategory,complaints, user_id, status, datecreated) values ($1,$2,$3,$4,$5,$6,$7)';
            executeQuery(sql,[request.requestcategory,request.item,request.itemcategory, request.complaints,user.id,'PENDING','NOW()'])
            .then((result)=>{
                
                let sql = 'SELECT * FROM BASE_REQUEST WHERE datecreated = (SELECT MAX(datecreated) FROM BASE_REQUEST WHERE user_id = $1)';
                executeQuery(sql,[user.id])
                .then((result)=>{
                    res.statusCode = 201;
                        res.setHeader('content-type', 'application/json');
                        return res.json({
                            message:`operation successful`,
                            request,
                            newRequest: result.rows
                        })
                }) 
                .catch((err)=>{
                    res.statusCode = 400;
                    res.setHeader('content-type', 'application/json');
                    res.json({
                        message:'couldnt perform action',
                        err
                    })
                    })        
            })
            .catch((err)=>{
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message:'couldnt perform action',
                    err
                })
            })
        }
    }
})
router.put('/request/:id',verifyToken,(req,res)=>{
    if(typeof req.token !== "undefined"){
        let user = req.token;
        let request = trimSpace(req.body);
        if(!validateKey(request,['complaints'])){
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({message:'Bad Request,one or more keys is missing or has more keys than expected'});
        }
        if(inputValidate(res,request)){
            let request_id = parseInt(req.params.id);
            if(typeof request_id !== "undefined" && request_id !== ''){
                let sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
                executeQuery(sql,[request_id])
                .then((result)=>{
                    if(result.rowCount > 0){
                        if(result.rows[0].status !== 'PENDING'){
                            res.statusCode = 400;
                            res.setHeader('content-type', 'application/json');
                            return res.json({
                                message:'can\'t perform update on request '
                            })
                        }
                        let sql = 'UPDATE BASE_REQUEST SET complaints = $1 WHERE id = $2';
                        executeQuery(sql,[request.complaints,request_id])
                        .then((result)=>{
                            let sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
                            executeQuery(sql,[request_id])
                            .then((result)=>{
                                res.statusCode = 200;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message:'operation successful',
                                    request:result.rows
                                })
                            })
                            .catch((err)=>{
                                res.statusCode = 400;
                                res.setHeader('content-type','application/json');
                                res.json({
                                    message:'couldn\'t update record',
                                    err
                                })
                            })
                        })
                        .catch((err)=>{
                            res.statusCode = 400;
                            res.setHeader('content-type','application/json');
                            res.json({
                                message:'couldnt perform operation',
                                err
                            })
                        })
                    }else{
                        res.statusCode = 404;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'No record found'
                        })
                    }
                })
                .catch((err)=>{
                    res.statusCode = 500;
                    res.setHeader('content-type','application/json');
                    res.json({
                        message:'Server error',
                        err
                    })
                })
            }else{
                res.statusCode = 400;
                res.setHeader('content-type', 'application/json');
                res.json({
                    message:'invalid params'
                })
            }
            
            
        }
    }
})


export default router