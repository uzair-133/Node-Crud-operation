const User = require('../Models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// require('dotenv').config();

const signup = async (req,res) => {
    const {name,email,password} = req.body;
    console.log(req.body)
    if(!name || !email || !password){
   return res.status(400).json({message:"All fields are required"});
}
if (password.length < 6) {

        return res.status(400).json({
            message: "Password must be at least 6 characters",
            success: false
        });
    }
    try {
    const normalizedEmail = email.toLowerCase().trim();
     const user = await User.findOne({email:normalizedEmail});
     if(user){
       return res.status(400).json({message:"user already exist", success:false});
     }
     const hashedPassword = await bcrypt.hash(password,10);
     const newUser = new User({name,email,password:hashedPassword});
     await newUser.save();
      return res.status(201).json({message: "signup successfully"});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
   return res.status(400).json({message:"All fields are required"});
}
    try {
     const user = await User.findOne({email});
     if(!user){
       return res.status(400).json({message:"user not found", success:false});
     }
     const PassEqual = await bcrypt.compare(password,user.password)
     if(!PassEqual){
       return  res.status(400).json({message:"password is wrong"});
     }
     const jwtToken = jwt.sign(
        {email:user.email,_id:user._id},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '24h'}
     )
      return  res.status(201).json({message: "login successfully",token: jwtToken,
    user: { email: user.email, name: user.name }});
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

const Read = async(req,res)=>{
    const user = await User.find({});
    res.json(user);
}

//ek zaroori tip
// Agar aapka naya token (Login wala) kisi doosre user ka hai aur aap ID kisi aur user ki bhej rahe hain, toh server confuse nahi hoga kyunki ensureAuth sirf yeh dekhta hai ke aap "Valid User" hain ya nahi. Lekin security ke liye aksar log yeh check karte hain ke:
// if (req.user._id !== req.params.id) return res.status(403).json("Sirf apni profile update kar sakte hain");
const update = async(req,res) => {
    const {id} = req.params;
    const{name,email,password} = req.body;
    try{
        const updateData = {};
        if(name) updateData.name =name;
        if(email) updateData.email =email;
        if(password){
            const hashedPassword = await bcrypt.hash(password,10);
            updateData.password =hashedPassword
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        if(!updatedUser){
            return res.status(404).json({message:"user not found", success:false});
        }
        res.status(200).json({
            message: "User updated successfully",
            success: true,
            data: updatedUser
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}
   const Delete = async(req,res) => {
    const {id} = req.params;
    try{
        const DeleteUser = await User.findByIdAndDelete(id)
;        if(!DeleteUser){
            return res.status(404).json({message:"user not found", success:false});
        }
        res.status(200).json({
            message: "User deleted successfully",
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}


module.exports = {signup,login,Read,update,Delete}