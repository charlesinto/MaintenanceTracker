import express from 'express';
import assignToken from '../services/assignToken';
import trimSpace from '../services/trimWhiteSpace';
import verifyToken from '../services/verifyToken';
import Validator from 'validator';
import validateKey from '../services/validateKeys';
import inputValidate from '../services/inputValidator';
import executeQuery from '../services/queryExecutor';
import bcrypt from 'bcrypt';
const ADMIN_ROLE = 1
let router = express.Router();

router.get('/', verifyToken, (req,res)=>{
    if(typeof req.token !== undefined && req.token !== ''){
        let user = req.token;
        if(!(user.role_id === ADMIN_ROLE)){
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
export default router;