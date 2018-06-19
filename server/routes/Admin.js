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


export default router;