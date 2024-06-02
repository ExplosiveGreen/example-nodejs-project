const express = require('express');
const db = require('./models');
const routers = require('./routers.json');
require('dotenv').config()

const app = express();

routers.map((route) => app.use(route, require(`./Router/${route}`)));

db.sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port  ${process.env.PORT}`);
    })
});