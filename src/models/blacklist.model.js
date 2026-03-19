import mongoose from "mongoose";


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },      
    blacklistedAt: {    
        type: Date,
        default: Date.now
    }
});     

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);  
export default BlacklistToken;          
                            