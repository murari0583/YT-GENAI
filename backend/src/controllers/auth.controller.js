import userModel from "../models/user.model.js";

import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken'; 
import blacklistTokenModel from "../models/blacklist.model.js"; 

function getCookieOptions() {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax'
    };
}


async function registerUserController(req, res){

    // user se data aayega

    const { username, password, email } = req.body;

    if(!username || !password || !email){
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }   
    
    // kya user pehle se exist karta hai

    try {
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

        // find one me humne $or operator use kiya hai jisse ki ya to username match kare ya email match kare, dono me se koi bhi match hone par existingUser variable me user ka data aa jayega

        if (existingUser) { 

            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hash = await bcrypt.hash(password, 10); // password ko hash karna hai 
        // user ko database me save karna hai

        const newUser = new userModel({ username, password: hash, email });

        await newUser.save();

            console.log('User registered successfully:', {
                id: newUser._id.toString(),
                username: newUser.username,
                email: newUser.email
            });

        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, getCookieOptions());
        return res.status(201).json({ 
            message: 'User registered successfully', 
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email   
            }
        });  

    } catch (error) {           
        console.error('Error registering user:', error);            
        return res.status(500).json({ message: 'Internal server error' });  

    }



}

// LOGIN CONTROLLER

async function loginUserController(req, res){

    const { username, password } = req.body;
    if(!username || !password){
        return res.status(400).json({ message: 'Username and password are required' });
    }


    // user exist bi karta hi ki nahi

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, getCookieOptions());
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// logout controller
async function logoutUserController(req, res) {

    const token = req.cookies.token;
    if (token) {
        await blacklistTokenModel.create({ token });
        res.clearCookie('token', getCookieOptions());
        return res.status(200).json({ message: 'Logout successful' });
    }       
    return res.status(400).json({ message: 'No token found' });
}    

// get me api get the current user dtails
async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching current user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



 

export default { registerUserController, loginUserController, logoutUserController, getMeController };