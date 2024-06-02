const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('./models');

const secret_key=process.env.SECRET_KEY;

export default () => async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({error: 'Token not found'});
        }
        const token = authHeader.split(' ')[1];
        const result = jwt.verify(token, secret_key);
        // check if username and password are in the token and match exist user and expiration isnt past
        if (!result) {
            return res.status(401).json({error: 'Token invalid'});
        }
        if('username' in result && 'password' in result && 'exp' in result){
            const user = await User.findByPk(req.params.id);
            if (!user) {
                return res.status(401).json({error: 'Token invalid'});
            }
            if(user.username !== result.username){
                return res.status(401).json({error: 'Token invalid'});
            }
            const passwordMatch = await bcrypt.compare(result.password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({error: 'Token invalid'});
            }
            if (Date.now() >= result.exp * 1000) {
                return res.status(401).json({error: 'Token expired'});
            }
            return next();
        }
        else {
            return res.status(401).json({error: 'Token invalid'});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};