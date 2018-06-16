import jwt from 'jsonwebtoken'

let veryifyToken = function(req,res,next){
    const bearerHeader = req.body.token || req.headers['authorization'];

        if (!bearerHeader){
            res.status(401).send({
                message: 'Unauthorized user'
            });
        } else if(typeof bearerHeader !== undefined){
            jwt.verify(bearerHeader, process.env.SECRET_KEY,(err, authData) => {

                if(err) {
                    res.status(403).send({
                        message: "Forbidden access"
                    });
                }
              req.token = authData;
              //console.log(req.token);
              next();
            })
            
        }
}

export default veryifyToken;