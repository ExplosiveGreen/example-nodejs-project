const express = require("express");
const {User} = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validate, userSchema} = require('./middleware/yup');

const secret_key = process.env.SECRET_KEY;
const router = express.Router();

// validate(userSchema) is a middleware example using yup
router.post('/register', validate(userSchema), async (req, res) => {
    const content = req.body;
    // example using async await
    try {
        const password = await bcrypt.hash(content.password, 10);
        const result = await User.create({...content, password});
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const result = await User.findOne({username});
        if (!result) {
            return res.status(401).json({error: 'authentication failed'});
        }
        const passwordMatch = await bcrypt.compare(password, result.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ result }, secret_key, {expiresIn: '1h'});
        res.json({token});
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});