require('dotenv');
const secret = process.env.JWT_TOKEN;

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const WithAuth = (res, res, next) =>{
    const token = res.headers['x-access-token']
    if(!token){
        res.status(401),json({error: 'Unauthorized: no token provided'});
    }else{
        jwt.verify(token, secret, (err, decode) =>{
            if(err){
                res.status(401),json({error: 'Unauthorized: invalid token'});
            }else{
                req.email = decode.email;
                User.findOne({email: decode.email})
                    .then(user => {
                        req.user = user;
                        next();
                    })
                    .catch(err => {
                        res.status(401).json({error: err})
                    })
            }
        })
    }
}

module.exports = WithAuth;