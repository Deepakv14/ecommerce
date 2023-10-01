const mongoose = require('mongoose');

//process.env.DB_URL ="mongodb://localhost:27017/Ecommerce"


const connectDB = () => {
    mongoose.connect("mongodb://localhost:27017/Ecommerce", { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`MongoDB connected with Server: ${data.connection.port}`)
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = connectDB;