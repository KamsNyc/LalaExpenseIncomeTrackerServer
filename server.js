const express = require('express');
const ConnectToDb = require('./Config/ConnectToDb');
const cors = require('cors')
require('dotenv').config();

//connect to db
ConnectToDb()

const app = express();

//configs
app.use(express.json());
app.use(cors())

//routes
app.use('/api', require('./Routes/bussinessRoute'));
app.use('/api/transaction', require('./Routes/transactionRoutes'));


app.listen(process.env.PORT, () => {
    console.log('server started')
})