import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({

    username:{
        type: String,
        required: true,
        unique: [true, 'Username already exists']   


    },
    password:{
        type: String,
        required: true  

    },
    email:{
        type: String,
        required: true,
        unique: [true, 'Email already exists']  
    }
})

// user ki detail kaha pe store hogi aur wo hogi user naam ke collection me

const userModel  =  mongoose.model('User', userSchema)

export default userModel;