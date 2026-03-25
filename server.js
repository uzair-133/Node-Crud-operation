const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const AuthRouter  = require('./Routers/AuthRouter')
const PORT = process.env.PORT || 3000
require('dotenv').config();
require('./Models/db')
app.use(bodyParser.json())
app.use(cors())
app.use('/AuthC',AuthRouter)

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})