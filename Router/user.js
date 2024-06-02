const express = require("express");
const router = express.Router();
const {User} = require('./models');
const jwtValidator = require('./middleware/jwt');

router.get('/:id', jwtValidator(), (req, res) => {
    const {id} = req.params;
    // example using the then, catch methods of a promise
    User.findByPk(id).then( user => {
        res.json(user);
    }).catch( err => {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    });
});

// jwtValidator() is a normal middleware example
router.delete('/users/:id', jwtValidator(), async (req, res) => {
    const {id} = req.params;
    try {
        const result = await User.destroy({where: {id}});
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});