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


router.post('/login',(req,res,next)=>{
   next();
})
router.post('/signup',(req,res)=>{
    //trim the request and trailling and leading spaces
    let request = trimSpace(req.body); 
    //validate if the request has the keys['firstname','lastname','email','password','phonenumber']] 
    if(!validateKey(request, ['firstname','lastname','email','password','phonenumber'])){
        res.statusCode = 400;
        res.setHeader('content-type', 'application/json');
        return res.json({message:'Bad Request,one or more keys is missing'});
    }
    //if keys exist validate the inputs
    if(inputValidate(res,request)){
        let hashpassword = bcrypt.hashSync(request.password,10);
        //check if email already exists
        let sql = 'SELECT * FROM BASE_USERS WHERE email = $1';
        executeQuery(sql,[request.email])
        .then((result)=>{
            //if email exits throw 406 and reort that the user exists
            if(result.rowCount > 0){
                res.statusCode = 406;
                res.setHeader('content-type', 'application/json');
               return res.json({
                    message:'User already exists'
                })
            }else{
                //perform insert action
                let sql = 'INSERT INTO BASE_USERS(firstname,lastname,email,phonenumber,password,role_id,DATECREATED) values($1,$2,$3,$4,$5,$6,$7)'
                executeQuery(sql,[request.firstname,request.lastname,request.email,request.phonenumber,hashpassword,1,'NOW()'])
                .then((result)=>{
                    //on successful insert get the user from the table
                    let sql = 'SELECT * FROM BASE_USERS WHERE email = $1'
                        executeQuery(sql,[request.email])
                        .then((result)=>{
                            //assign token to the user
                             assignToken({id:result.rows[0].id,firstname:result.rows[0].firstname,lastname:result.rows[0].lastname,role_id:1,email:result.rows[0].email})
                            .then((token)=>{
                                res.statusCode = 201;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message:`welcome ${request.firstname} ${request.lastname}`,
                                    token
                                })
                                
                            })//if promise is not fulfilled throw 404 and report couldnt perform validation
                            .catch((err)=>{
                                res.statusCode = 403;
                                res.setHeader('content-type', 'application/json');
                                res.json({
                                    message:'couldnt perform authentication',
                                    err
                                })
                            })
                        })//if connection to db was not successful throw error
                        .catch((err)=>{
                            res.statusCode = 500;
                            res.setHeader('content-type', 'application/json');
                            res.json({
                                message:'Server error or service unavailabe',
                                err
                            })
                        })
                })//if connection to db was not successful throw error
                .catch((err)=>{
                        res.statusCode = 500;
                        res.setHeader('content-type', 'application/json');
                        res.json({
                            message:'Server error or service unavailabe',
                            err
                        })
                });
            }
        })//if connection to db was not successful throw error
        .catch((err)=>{
            res.statusCode = 500;
            res.setHeader('content-type', 'application/json');
            res.json({
                message:'Server error or service unavailabe',
                err
            })
    });
    }
})

export default router;