import express from 'express';
import assignToken from '../services/assignToken';
import trimSpace from '../services/trimWhiteSpace';
import verifyToken from '../services/verifyToken';
import Validator from 'validator';
import validateKey from '../services/validateKeys';
import inputValidate from '../services/inputValidator';
import executeQuery from '../services/queryExecutor';
import bcrypt from 'bcrypt';
const ADMIN_ROLE = 2
let router = express.Router();

router.get('/', verifyToken, (req,res)=>{
    if(typeof req.token !== "undefined" && req.token !== ''){
        let user = req.token;
        if(!(user.role_id == ADMIN_ROLE)){
            res.statusCode = 400;
            res.setHeader('content-type', 'application/json');
            return res.json({
                message:'access denied'
            })
        }
        let sql = 'SELECT * FROM BASE_REQUEST';
        executeQuery(sql,'')
        .then((result)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            res.json({
                message:'operation successful',
                requests:result.rows
            })
        })
        .catch((err)=>{
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                message:'operation failed',
                err
            })
        })
    }
})

router.put('/:id/resolve', verifyToken, (req,res)=>{
    if(typeof req.token !== "undefined" && (typeof req.params.id !== "undefined" && req.params.id !== '')){
        let user = req.token;
        let request_id = parseInt(req.params.id);
        let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        executeQuery(sql,[request_id])
        .then((result)=>{
            if(result.rowCount > 0){
                if(result.rows[0].status === 'REJECTED'){
                    res.statusCode = 406;
                    res.setHeader('content-type','application/json');
                    return res.json({
                        message:'can perform operation'
                    })
                }
                let sql = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                executeQuery(sql,['RESOLVED', request_id])
                .then((result)=>{
                    let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    executeQuery(sql,[request_id])
                    .then((result)=>{
                        res.statusCode = 200;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation successful',
                            request:result.rows
                        })
                    })
                    .catch((err)=>{
                        res.statusCode = 444;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation failed',
                            err
                        })
                    }) 
                })
                .catch((err)=>{
                    res.statusCode = 444;
                    res.setHeader('content-type','application/json');
                    res.json({
                        message:'operation failed',
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
            res.statusCode = 444;
            res.setHeader('content-type','application/json');
            res.json({
                message:'operation failed',
                err
            })
        })
    }
})
router.put('/:id/reject', verifyToken, (req,res)=>{
    if(typeof req.token !== "undefined" && (typeof req.params.id !== "undefined" && req.params.id !== '')){
        let user = req.token;
        let request_id = parseInt(req.params.id);
        let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        executeQuery(sql,[request_id])
        .then((result)=>{
            if(result.rowCount > 0){
                if(result.rows[0].status === 'RESOLVED'){
                    res.statusCode = 406;
                    res.setHeader('content-type','application/json');
                    return res.json({
                        message:'can\'t update status'
                    })
                }
                let sql = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                executeQuery(sql,['REJECTED', request_id])
                .then((result)=>{
                    let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    executeQuery(sql,[request_id])
                    .then((result)=>{
                        res.statusCode = 200;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation successful',
                            request:result.rows
                        })
                    })
                    .catch((err)=>{
                        res.statusCode = 444;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation failed',
                            err
                        })
                    }) 
                })
                .catch((err)=>{
                    res.statusCode = 444;
                    res.setHeader('content-type','application/json');
                    res.json({
                        message:'operation failed',
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
            res.statusCode = 444;
            res.setHeader('content-type','application/json');
            res.json({
                message:'operation failed',
                err
            })
        })
    }
})
router.put('/:id/approve', verifyToken, (req,res)=>{
    if(typeof req.token !== "undefined" && (typeof req.params.id !== "undefined" && req.params.id !== '')){
        let user = req.token;
        let request_id = parseInt(req.params.id);
        let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
        executeQuery(sql,[request_id])
        .then((result)=>{
            if(result.rowCount > 0){
                if(result.rows[0].status !== 'PENDING'){
                    res.statusCode = 406;
                    res.setHeader('content-type','application/json');
                    return res.json({
                        message:'can\'t update status'
                    })
                }
                let sql = 'UPDATE BASE_REQUEST SET status = $1 where id = $2';
                executeQuery(sql,['APPROVED', request_id])
                .then((result)=>{
                    let sql = 'SELECT * FROM BASE_REQUEST WHERE ID = $1';
                    executeQuery(sql,[request_id])
                    .then((result)=>{
                        res.statusCode = 200;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation successful',
                            request:result.rows
                        })
                    })
                    .catch((err)=>{
                        res.statusCode = 444;
                        res.setHeader('content-type','application/json');
                        res.json({
                            message:'operation failed',
                            err
                        })
                    }) 
                })
                .catch((err)=>{
                    res.statusCode = 444;
                    res.setHeader('content-type','application/json');
                    res.json({
                        message:'operation failed',
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
            res.statusCode = 444;
            res.setHeader('content-type','application/json');
            res.json({
                message:'operation failed',
                err
            })
        })
    }
})
export default router;