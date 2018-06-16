import express from 'express';
let router = express.Router();

router.get('/',(req,res, next)=>{
    res.sendFile(__dirname + '/index.html');
});

export default router

