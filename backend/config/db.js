const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connectDB = async()=> {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Mongodb connected: ${conn.connection.host}`);
    } catch(error){
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports=connectDB;