const mongoose = require('mongoose');


async function ConnectToDb(){
    mongoose.connect(process.env.DB_URL);
    console.log('connected to database')
}

module.exports = ConnectToDb;
