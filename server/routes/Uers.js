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
                res.statusCode = 201;
                        res.setHeader('content-type', 'application/json');
                        return res.json({
                            message:`operation successful`,
                            request
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