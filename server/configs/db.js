import mongoose from "mongoose";

const connectDB = async ()=>{
    try{
            mongoose.connection.on('connected', ()=> console.log("Database connnected")
    );
    await mongoose.connect("mongodb://localhost:27017/greencart")
    }
    catch(error){
        console.error(error.message);
        
    }
    
}


export default connectDB;
