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
    if(typeof req.token !== undefined){
        let loggedInUser = req.token;
        let sql = 'SELECT * FROM BASE_REQUEST WHERE user_id = $1';
        executeQuery(sql,[loggedInUser.id])
        .then((result)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            if(result.rowCount > 0){
                res.json({
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
    if(typeof req.params !== undefined && req.params !== ''){
        let request_id = parseInt(req.params.id);
        let sql = 'SELECT * FROM BASE_REQUEST WHERE id = $1';
        executeQuery(sql,[request_id])
        .then((result)=>{
            res.statusCode = 200;
            res.setHeader('content-type', 'application/json');
            if(result.rowCount > 0){
                res.json({
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


export default router